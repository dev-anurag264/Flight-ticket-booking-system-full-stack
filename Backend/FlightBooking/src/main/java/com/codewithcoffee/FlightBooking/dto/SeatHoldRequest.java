package com.codewithcoffee.FlightBooking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeatHoldRequest {
    @NotNull
    private Long seatId;
}
