package com.codewithcoffee.FlightBooking.mapper;

import com.codewithcoffee.FlightBooking.dto.bookings.BookingResponse;
import com.codewithcoffee.FlightBooking.dto.bookings.PassengerResponse;
import com.codewithcoffee.FlightBooking.entity.Booking;
import com.codewithcoffee.FlightBooking.entity.Passenger;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingMapper {
    private final FlightMapper flightMapper;

    public BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .pnr(booking.getPnr())
                .flight(flightMapper.toResponse(booking.getFlight()))
                .status(booking.getStatus().name())
                .passengers(booking.getPassengers().stream().map(this::toPassengerResponse).toList())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    private PassengerResponse toPassengerResponse(Passenger passenger) {
        return PassengerResponse.builder()
                .id(passenger.getId())
                .seatNumber(passenger.getSeat().getSeatNumber())
                .name(passenger.getName())
                .age(passenger.getAge())
                .gender(passenger.getGender())
                .mealPreference(passenger.getMealPreference().name())
                .build();
    }
}
