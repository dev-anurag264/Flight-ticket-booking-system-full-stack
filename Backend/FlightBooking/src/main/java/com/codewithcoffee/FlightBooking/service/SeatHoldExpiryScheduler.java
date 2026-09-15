package com.codewithcoffee.FlightBooking.service;


import com.codewithcoffee.FlightBooking.config.SeatHoldProperties;
import com.codewithcoffee.FlightBooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
@Slf4j
public class SeatHoldExpiryScheduler {
    private final SeatRepository seatRepository;
    private final SeatHoldProperties  seatHoldProperties;
    private final Clock clock;

    @Scheduled(fixedDelayString = "${seat.hold.sweep-interval-ms}")
    @Transactional
    public void releaseExpiredHold(){
        int releaseCount = seatRepository.releaseExpiredHolds(LocalDateTime.now(clock));
        if (releaseCount > 0) {
            log.info("Released {} expired seat hold(s)", releaseCount);
        }
    }
}
