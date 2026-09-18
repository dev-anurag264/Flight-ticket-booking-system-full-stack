package com.codewithcoffee.FlightBooking.dto.paymentdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private String bookingPnr;
    private long amount;
    private String status;
    private int attempts;
}