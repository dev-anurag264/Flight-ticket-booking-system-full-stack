package com.codewithcoffee.FlightBooking.repository;

import com.codewithcoffee.FlightBooking.entity.Flight;
import com.codewithcoffee.FlightBooking.entity.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight,Long> {
    boolean existsByFlightNumber(String flightNumber);

    @Query("""
            SELECT f FROM Flight f
            WHERE f.originAirport.iataCode = :origin
              AND f.destinationAirport.iataCode = :destination
              AND f.departureTime BETWEEN :startOfDay AND :endOfDay
              AND f.status <> :cancelledStatus
            """)
    List<Flight> searchFlights(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay,
            @Param("cancelledStatus") FlightStatus cancelledStatus
    );
}

