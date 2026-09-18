package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


import java.security.SecureRandom;

@Component
@RequiredArgsConstructor
public class PnrGenerationService {

    private final BookingRepository bookingRepository;
    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int PNR_LENGTH = 6;
    private static final int Max_Attempts = 10;

    private static SecureRandom random =  new SecureRandom();

    public String generate() {
        for (int attempt = 0; attempt < Max_Attempts; attempt++) {
            String candidate = randomCode();
            if (!bookingRepository.existsByPnr(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Failed to generate a unique PNR after " + Max_Attempts + " attempts");
    }


    private String randomCode() {
        StringBuilder sb = new StringBuilder(PNR_LENGTH);
        for (int i = 0; i < PNR_LENGTH; i++) {
            sb.append(ALPHANUMERIC.charAt(random.nextInt(ALPHANUMERIC.length())));
        }
        return sb.toString();
    }
}
