package com.codewithcoffee.FlightBooking.repository;

import com.codewithcoffee.FlightBooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {
        List<Seat> findByFlightId(Long flightId);
        Optional<Seat> findByFlightIdAndSeatNumber(Long flightId, String seatNumber);
        boolean existsByFlightIdAndSeatNumber(Long flightId, String seatNumber);
}
