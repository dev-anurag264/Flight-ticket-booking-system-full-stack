package com.codewithcoffee.FlightBooking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "seat.hold")
public class SeatHoldProperties {
    private int durationMinutes = 10;
    private long sweepIntervalMs = 30000;

    public int getDurationMinutes() {
        return durationMinutes;
    }
    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public long getSweepIntervalMs() {
        return sweepIntervalMs;
    }
    public void setSweepIntervalMs(long sweepIntervalMs) {
        this.sweepIntervalMs = sweepIntervalMs;
    }
}
