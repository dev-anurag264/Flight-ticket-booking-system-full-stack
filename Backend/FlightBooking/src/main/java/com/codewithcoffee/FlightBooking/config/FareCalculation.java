package com.codewithcoffee.FlightBooking.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "fare")
public class FareCalculation {
    private int gstBasisPoints = 1800;
    private long airportFeePaise = 15000;

}
