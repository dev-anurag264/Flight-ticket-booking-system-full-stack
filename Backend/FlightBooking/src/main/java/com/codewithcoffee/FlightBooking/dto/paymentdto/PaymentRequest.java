package com.codewithcoffee.FlightBooking.dto.paymentdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull
    private Long bookingId;

    @NotBlank(message = "idempotencyKey is required")
    private String idempotencyKey;
}
