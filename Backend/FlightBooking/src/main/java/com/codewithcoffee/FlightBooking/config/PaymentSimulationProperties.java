package com.codewithcoffee.FlightBooking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "payment.simulation")
public class PaymentSimulationProperties {
    private int failureRatePercent = 20;

    public int getFailureRatePercent() { return failureRatePercent; }
    public void setFailureRatePercent(int failureRatePercent) { this.failureRatePercent = failureRatePercent; }
}
