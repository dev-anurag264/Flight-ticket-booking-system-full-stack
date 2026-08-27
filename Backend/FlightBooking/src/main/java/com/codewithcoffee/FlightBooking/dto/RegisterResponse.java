package com.codewithcoffee.FlightBooking.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RegisterResponse {
    private String token;
    private String email;
    private String role;
}
