package com.codewithcoffee.FlightBooking.repository;

import com.codewithcoffee.FlightBooking.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassengerRepository extends JpaRepository<Passenger, Long> {

}
