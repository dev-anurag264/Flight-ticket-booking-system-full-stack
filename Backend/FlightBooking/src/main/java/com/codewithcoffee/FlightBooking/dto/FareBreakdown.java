package com.codewithcoffee.FlightBooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class FareBreakdown {
    private long baseFarePaise;
    private long gstPaise;
    private long airportFeePaise;
    private long totalPaise;
}
