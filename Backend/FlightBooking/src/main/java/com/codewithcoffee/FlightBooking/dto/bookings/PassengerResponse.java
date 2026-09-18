package com.codewithcoffee.FlightBooking.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class PassengerResponse {
    private Long id;
    private String seatNumber;
    private String name;
    private Integer age;
    private String gender;
    private String mealPreference;
}
