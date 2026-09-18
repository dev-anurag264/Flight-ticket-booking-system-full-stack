package com.codewithcoffee.FlightBooking.repository;

import com.codewithcoffee.FlightBooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    boolean existsByPnr(String pnr);

    Optional<Booking> findByPnr(String pnr);

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
