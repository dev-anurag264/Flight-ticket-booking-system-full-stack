package com.codewithcoffee.FlightBooking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeatGenerationRequest {
    @NotNull
    @Min(0)
    private Integer businessRows;

    @NotNull
    @Min(1)
    private Integer economyRows;

    @NotNull
    @Min(0)
    private Integer firstClassRows;

    @NotNull
    @Min(4)
    private Integer seatsPerRow;
}
