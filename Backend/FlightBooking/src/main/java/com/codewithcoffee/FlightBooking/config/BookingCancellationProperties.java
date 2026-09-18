package com.codewithcoffee.FlightBooking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "booking.cancellation")
public class BookingCancellationProperties {
    private int  minHoursBeforeDeparture= 24;

    public int getMinHoursBeforeDeparture(){
        return minHoursBeforeDeparture;
    }
    public void setMinHoursBeforeDeparture(int minHoursBeforeDeparture) {
        this.minHoursBeforeDeparture = minHoursBeforeDeparture;
    }
}
