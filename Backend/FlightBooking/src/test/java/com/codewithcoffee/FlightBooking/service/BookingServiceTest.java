package com.codewithcoffee.FlightBooking.service;



import com.codewithcoffee.FlightBooking.config.BookingCancellationProperties;
import com.codewithcoffee.FlightBooking.dto.bookings.BookingRequest;
import com.codewithcoffee.FlightBooking.dto.bookings.PassengerRequest;
import com.codewithcoffee.FlightBooking.entity.*;
import com.codewithcoffee.FlightBooking.exceptions.ApiException;
import com.codewithcoffee.FlightBooking.mapper.BookingMapper;
import com.codewithcoffee.FlightBooking.repository.BookingRepository;
import com.codewithcoffee.FlightBooking.repository.FlightRepository;
import com.codewithcoffee.FlightBooking.repository.SeatRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock private BookingRepository bookingRepository;
    @Mock private FlightRepository flightRepository;
    @Mock private SeatRepository seatRepository;
    @Mock private BookingMapper bookingMapper;
    @Mock private PnrGenerationService pnrGenerator;

    private final Clock fixedClock =
            Clock.fixed(Instant.parse("2026-10-10T00:00:00Z"), ZoneId.of("UTC"));
    private final BookingCancellationProperties cancellationProperties = new BookingCancellationProperties();

    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        cancellationProperties.setMinHoursBeforeDeparture(24);
        bookingService = new BookingService(
                bookingRepository, flightRepository, seatRepository, bookingMapper, pnrGenerator,
                cancellationProperties, fixedClock);
    }

    @Test
    void createBooking_throwsConflict_whenSeatNotHeld() {
        Flight flight = Flight.builder().id(1L).build();
        Seat seat = Seat.builder().id(10L).flight(flight).seatNumber("5A").status(SeatStatus.AVAILABLE).build();

        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(pnrGenerator.generate()).thenReturn("ABC123");
        when(seatRepository.findById(10L)).thenReturn(Optional.of(seat));

        BookingRequest request = bookingRequest(1L, passenger(10L, "Alice"));

        assertThatThrownBy(() -> bookingService.createBooking(99L, request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("not currently held");
    }

    @Test
    void createBooking_throwsForbidden_whenSeatHeldByDifferentUser() {
        Flight flight = Flight.builder().id(1L).build();
        Seat seat = Seat.builder().id(10L).flight(flight).seatNumber("5A")
                .status(SeatStatus.HELD).heldByUserId(555L).build();

        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(pnrGenerator.generate()).thenReturn("ABC123");
        when(seatRepository.findById(10L)).thenReturn(Optional.of(seat));

        BookingRequest request = bookingRequest(1L, passenger(10L, "Alice"));

        assertThatThrownBy(() -> bookingService.createBooking(99L, request)) // 99L != 555L
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("held by another user");
    }

    @Test
    void createBooking_succeeds_whenSeatHeldByRequestingCustomer() {
        Flight flight = Flight.builder().id(1L).build();
        Seat seat = Seat.builder().id(10L).flight(flight).seatNumber("5A")
                .status(SeatStatus.HELD).heldByUserId(99L).build();

        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(pnrGenerator.generate()).thenReturn("ABC123");
        when(seatRepository.findById(10L)).thenReturn(Optional.of(seat));
        when(seatRepository.saveAndFlush(seat)).thenReturn(seat);
        when(bookingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BookingRequest request = bookingRequest(1L, passenger(10L, "Alice"));

        bookingService.createBooking(99L, request);

        assertThat(seat.getStatus()).isEqualTo(SeatStatus.PAYMENT_PENDING);
        verify(bookingMapper).toResponse(any());
    }

    // ---------- cancelBooking ----------

    @Test
    void cancelBooking_throwsForbidden_whenNotOwner() {
        User owner = User.builder().id(1L).build();
        Booking booking = Booking.builder().id(1L).customer(owner).status(BookingStatus.PENDING).build();
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.cancelBooking(2L, 1L)) // requester 2L != owner 1L
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("does not belong to you");
    }

    @Test
    void cancelBooking_throwsBadRequest_whenTooCloseToDeparture() {
        User owner = User.builder().id(1L).build();
        Flight flight = Flight.builder().departureTime(LocalDateTime.now(fixedClock).plusHours(5)).build();
        Booking booking = Booking.builder().id(1L).customer(owner).flight(flight)
                .status(BookingStatus.PENDING).passengers(List.of()).build();

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.cancelBooking(1L, 1L))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Cannot cancel within");
    }

    @Test
    void cancelBooking_releasesSeats_whenEligible() {
        User owner = User.builder().id(1L).build();
        Flight flight = Flight.builder().departureTime(LocalDateTime.now(fixedClock).plusDays(3)).build();
        Seat seat = Seat.builder().id(10L).status(SeatStatus.PAYMENT_PENDING).heldByUserId(1L).build();
        Passenger passenger = Passenger.builder().seat(seat).build();
        Booking booking = Booking.builder().id(1L).customer(owner).flight(flight)
                .status(BookingStatus.PENDING).passengers(List.of(passenger)).build();

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        bookingService.cancelBooking(1L, 1L);

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(seat.getStatus()).isEqualTo(SeatStatus.AVAILABLE);
        assertThat(seat.getHeldByUserId()).isNull();
        verify(seatRepository).save(seat);
    }

    private BookingRequest bookingRequest(Long flightId, PassengerRequest... passengers) {
        BookingRequest request = new BookingRequest();
        request.setFlightId(flightId);
        request.setPassengers(List.of(passengers));
        return request;
    }

    private PassengerRequest passenger(Long seatId, String name) {
        PassengerRequest p = new PassengerRequest();
        p.setSeatId(seatId);
        p.setName(name);
        p.setAge(30);
        p.setGender("FEMALE");
        p.setMealPreference(MealPreference.NONE);
        return p;
    }
}