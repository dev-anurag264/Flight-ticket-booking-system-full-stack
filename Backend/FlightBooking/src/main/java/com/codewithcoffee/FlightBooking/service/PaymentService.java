package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.config.FareCalculation;
import com.codewithcoffee.FlightBooking.config.PaymentSimulationProperties;
import com.codewithcoffee.FlightBooking.dto.FareBreakdown;
import com.codewithcoffee.FlightBooking.dto.paymentdto.PaymentRequest;
import com.codewithcoffee.FlightBooking.dto.paymentdto.PaymentResponse;
import com.codewithcoffee.FlightBooking.entity.*;
import com.codewithcoffee.FlightBooking.exceptions.ApiException;
import com.codewithcoffee.FlightBooking.repository.BookingRepository;
import com.codewithcoffee.FlightBooking.repository.PaymentRepository;
import com.codewithcoffee.FlightBooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final SeatRepository seatRepository;
    private final FareCalculator fareCalculator;
    private final PaymentSimulationProperties simulationProperties;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public PaymentResponse processPayment(Long customerId, PaymentRequest request) {
        // 1. True idempotency short-circuit: same key seen before -> return the SAME result, no reprocessing.
        var existingByKey = paymentRepository.findByIdempotencyKey(request.getIdempotencyKey());
        if (existingByKey.isPresent()) {
            return toResponse(existingByKey.get());
        }

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ApiException( "Booking not found", HttpStatus.NOT_FOUND));

        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new ApiException( "This booking does not belong to you",HttpStatus.FORBIDDEN);
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new ApiException( "This booking is already paid for", HttpStatus.CONFLICT);
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ApiException( "Cannot pay for a cancelled booking",HttpStatus.CONFLICT);
        }

        FareBreakdown fare = fareCalculator.calculate(booking.getFlight());

        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .map(existing -> prepareRetry(existing, request.getIdempotencyKey()))
                .orElseGet(() -> Payment.builder()
                        .booking(booking)
                        .idempotencyKey(request.getIdempotencyKey())
                        .amount(fare.getTotalPaise())
                        .status(PaymentStatus.PENDING)
                        .attempts(1)
                        .build());

        boolean success = simulateOutCome();

        payment.setStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);

        try {
            Payment saved = paymentRepository.saveAndFlush(payment);

            if (success) {
                confirmBookingAndSeats(booking);
            }

            return toResponse(saved);
        } catch (DataIntegrityViolationException ex) {
            // Concurrent duplicate submission with the same idempotency key raced us — return the winner's result.
            Payment winner = paymentRepository.findByIdempotencyKey(request.getIdempotencyKey())
                    .orElseThrow(() -> new ApiException( "Payment could not be processed",HttpStatus.CONFLICT));
            return toResponse(winner);
        }
    }
    private Payment prepareRetry(Payment existing, String newIdempotencyKey) {
        if (existing.getStatus() == PaymentStatus.SUCCESS) {
            throw new ApiException( "This booking is already paid for",HttpStatus.CONFLICT);
        }
        existing.setIdempotencyKey(newIdempotencyKey);
        existing.setAttempts(existing.getAttempts() + 1);
        existing.setStatus(PaymentStatus.PENDING);
        return existing;
    }

    private boolean simulateOutCome() {
        return random.nextInt(100) >= simulationProperties.getFailureRatePercent();
    }

    private void confirmBookingAndSeats(Booking booking) {
        booking.setStatus(BookingStatus.CONFIRMED);
        for (Passenger passenger : booking.getPassengers()) {
            Seat seat = passenger.getSeat();
            seat.setStatus(SeatStatus.CONFIRMED);
            seatRepository.save(seat);
        }
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingPnr(payment.getBooking().getPnr())
                .amount(payment.getAmount())
                .status(payment.getStatus().name())
                .attempts(payment.getAttempts())
                .build();
    }
}
