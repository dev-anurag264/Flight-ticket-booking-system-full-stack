package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.config.FareCalculation;
import com.codewithcoffee.FlightBooking.dto.FareBreakdown;
import com.codewithcoffee.FlightBooking.entity.Flight;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
@RequiredArgsConstructor
public class FareCalculator {
    private final FareCalculation fareCalculation;

    public FareBreakdown calculate(Flight flight) {
        long baseFarePaise = flight.getBaseFare()
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        long gstPaise = (baseFarePaise * fareCalculation.getGstBasisPoints()) / 10_000;
        long airportFeePaise = fareCalculation.getAirportFeePaise();
        long totalPaise = baseFarePaise + gstPaise + airportFeePaise;

        return FareBreakdown.builder()
                .baseFarePaise(baseFarePaise)
                .gstPaise(gstPaise)
                .airportFeePaise(airportFeePaise)
                .totalPaise(totalPaise)
                .build();
    }
}
