package com.codewithcoffee.FlightBooking.repository;

import com.codewithcoffee.FlightBooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {
        @Query("SELECT s FROM Seat s WHERE s.flight.id = :flightId ORDER BY s.id ASC")
        List<Seat> findByFlightId(Long flightId);
        Optional<Seat> findByFlightIdAndSeatNumber(Long flightId, String seatNumber);
        boolean existsByFlightIdAndSeatNumber(Long flightId, String seatNumber);

        @Modifying
        @Query("""
        UPDATE Seat s
        SET s.status = com.codewithcoffee.FlightBooking.entity.SeatStatus.AVAILABLE, s.holdExpiresAt = null
        WHERE s.status = com.codewithcoffee.FlightBooking.entity.SeatStatus.HELD
          AND s.holdExpiresAt < :now
        """)
        int releaseExpiredHolds(@Param("now") LocalDateTime now);
}
