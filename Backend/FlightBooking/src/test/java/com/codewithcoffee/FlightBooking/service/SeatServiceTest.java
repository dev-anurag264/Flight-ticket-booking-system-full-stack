package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.repository.FlightRepository;
import com.codewithcoffee.FlightBooking.repository.SeatRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class SeatServiceTest {

    @Mock
    private SeatRepository seatRepository;
    @Mock
    private FlightRepository flightRepository;
    @InjectMocks
    private SeatService seatService;

    @Test
    void generateSeats_throwsNotFound_whenFlightDoesNotExist(){

    }

    @Test
    void generateSeats_throwsConflict_whenFlightAlreadyHasSeats(){

    }

    @Test
    void generateSeats_createsCorrectTotalCount_acrossClasses(){

    }

    @Test
    void generateSeats_translatesConstraintViolation_toConflict(){

    }
}