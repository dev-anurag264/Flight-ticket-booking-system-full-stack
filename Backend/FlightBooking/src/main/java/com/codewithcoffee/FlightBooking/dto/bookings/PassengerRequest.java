package com.codewithcoffee.FlightBooking.dto.bookings;


import com.codewithcoffee.FlightBooking.entity.MealPreference;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PassengerRequest {

    private Long seatId;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotNull
    @Min(value = 1, message = "Age must be at least 2")
    @Max(value = 120, message = "Age must be realistic")
    private Integer age;

    @NotBlank
    private String gender;

    @NotNull
    private MealPreference mealPreference;
}
