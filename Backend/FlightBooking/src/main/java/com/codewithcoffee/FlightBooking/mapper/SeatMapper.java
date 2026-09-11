package com.codewithcoffee.FlightBooking.mapper;

import com.codewithcoffee.FlightBooking.dto.SeatResponse;
import com.codewithcoffee.FlightBooking.entity.Seat;
import org.springframework.stereotype.Component;

@Component
public class SeatMapper {
    public SeatResponse toResponse(Seat seat) {
        return SeatResponse.builder()
                .id(seat.getId())
                .seatNumber(seat.getSeatNumber())
                .seatClass(seat.getSeatClass().name())
                .status(seat.getStatus().name())
                .build();
    }
}
