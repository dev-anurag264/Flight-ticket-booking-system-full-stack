package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.config.BookingCancellationProperties;
import com.codewithcoffee.FlightBooking.dto.bookings.BookingRequest;
import com.codewithcoffee.FlightBooking.dto.bookings.BookingResponse;
import com.codewithcoffee.FlightBooking.dto.bookings.PassengerRequest;
import com.codewithcoffee.FlightBooking.entity.*;
import com.codewithcoffee.FlightBooking.exceptions.ApiException;
import com.codewithcoffee.FlightBooking.mapper.BookingMapper;
import com.codewithcoffee.FlightBooking.repository.BookingRepository;
import com.codewithcoffee.FlightBooking.repository.FlightRepository;
import com.codewithcoffee.FlightBooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.time.Clock;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;
    private final BookingMapper bookingMapper;
    private final PnrGenerationService pnrGenerator;
    private final BookingCancellationProperties cancellationProperties;
    private final Clock clock;


    @Transactional
    public BookingResponse createBooking(Long customerId, BookingRequest request) {
        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new ApiException( "Flight not found",HttpStatus.NOT_FOUND));

        Booking booking = Booking.builder()
                .pnr(pnrGenerator.generate())
                .customer(User.builder().id(customerId).build()) // reference by ID only — see note below
                .flight(flight)
                .status(BookingStatus.PENDING)
                .build();

        for (PassengerRequest passengerRequest : request.getPassengers()) {
            Seat seat = validateAndClaimSeat(passengerRequest.getSeatId(), flight.getId(), customerId);

            Passenger passenger = Passenger.builder()
                    .seat(seat)
                    .name(passengerRequest.getName())
                    .age(passengerRequest.getAge())
                    .gender(passengerRequest.getGender())
                    .mealPreference(passengerRequest.getMealPreference())
                    .build();

            booking.addPassenger(passenger);
        }

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toResponse(saved);
    }

    private Seat validateAndClaimSeat(Long seatId, Long flightId, Long customerId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ApiException("Seat not found",HttpStatus.NOT_FOUND));

        if (!seat.getFlight().getId().equals(flightId)) {
            throw new ApiException("Seat does not belong to the specified flight",HttpStatus.BAD_REQUEST);
        }

        if (seat.getStatus() != SeatStatus.HELD) {
            throw new ApiException("Seat " + seat.getSeatNumber() + " is not currently held",HttpStatus.CONFLICT);
        }

        if (!customerId.equals(seat.getHeldByUserId())) {
            throw new ApiException("Seat " + seat.getSeatNumber() + " is held by another user",HttpStatus.FORBIDDEN);
        }

        seat.setStatus(SeatStatus.PAYMENT_PENDING);

        try {
            return seatRepository.saveAndFlush(seat);
        } catch (ObjectOptimisticLockingFailureException ex) {
            throw new ApiException(
                    "Seat " + seat.getSeatNumber() + " hold expired or changed — please reselect your seat",HttpStatus.CONFLICT);
        }
    }

    public List<BookingResponse> getBookingsForCustomer(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    public BookingResponse getByPnr(String pnr) {
        Booking booking = bookingRepository.findByPnr(pnr)
                .orElseThrow(() -> new ApiException( "Booking not found",HttpStatus.NOT_FOUND));
        return bookingMapper.toResponse(booking);
    }


    //cancel booking
    @Transactional
    public BookingResponse cancelBooking(Long customerId, Long bookingId){
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(
                () -> new ApiException("Booking not found", HttpStatus.NOT_FOUND)
        );

        //false booking
        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new ApiException( "This booking does not belong to you",HttpStatus.CONFLICT);
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ApiException("Booking is already cancelled",HttpStatus.ALREADY_REPORTED);
        }

        long hoursUntilDeparture = ChronoUnit.HOURS.between(
                LocalDateTime.now(clock), booking.getFlight().getDepartureTime()
        );
        if (hoursUntilDeparture < cancellationProperties.getMinHoursBeforeDeparture()) {
            throw new ApiException(
                    "Cannot cancel within " + cancellationProperties.getMinHoursBeforeDeparture() + " hours of departure",HttpStatus.BAD_REQUEST);
        }
        booking.setStatus(BookingStatus.CANCELLED);

        for (Passenger passenger : booking.getPassengers()) {
            Seat seat = passenger.getSeat();
            seat.setStatus(SeatStatus.AVAILABLE);
            seat.setHeldByUserId(null);
            seat.setHoldExpiresAt(null);
            seatRepository.save(seat);
        }

        return bookingMapper.toResponse(booking);

    }
}
