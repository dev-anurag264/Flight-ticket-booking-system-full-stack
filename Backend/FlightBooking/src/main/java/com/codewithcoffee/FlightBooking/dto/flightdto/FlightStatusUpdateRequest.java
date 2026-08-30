package com.codewithcoffee.FlightBooking.dto.flightdto;

import com.codewithcoffee.FlightBooking.entity.FlightStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FlightStatusUpdateRequest {
    @NotNull
    private FlightStatus status;
}
