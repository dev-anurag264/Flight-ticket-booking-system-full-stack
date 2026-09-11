package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.dto.SeatGenerationRequest;
import com.codewithcoffee.FlightBooking.dto.SeatResponse;
import com.codewithcoffee.FlightBooking.entity.Flight;
import com.codewithcoffee.FlightBooking.entity.Seat;
import com.codewithcoffee.FlightBooking.entity.SeatClass;
import com.codewithcoffee.FlightBooking.entity.SeatStatus;
import com.codewithcoffee.FlightBooking.exceptions.ApiException;
import com.codewithcoffee.FlightBooking.mapper.SeatMapper;
import com.codewithcoffee.FlightBooking.repository.FlightRepository;
import com.codewithcoffee.FlightBooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SeatService {

    private static final char[] SEAT_LETTERS = {'A', 'B', 'C', 'D', 'E', 'F'};
    private final SeatRepository seatRepository;
    private final FlightRepository flightRepository;
    private final SeatMapper seatMapper;

    @Transactional
    public List<SeatResponse> generateSeats(Long flightId, SeatGenerationRequest request){
        Flight flight = flightRepository.findById(flightId).orElseThrow(
                () -> new ApiException("Flight Already registed",HttpStatus.CONFLICT));
        if (!seatRepository.findByFlightId(flightId).isEmpty()) {
            throw new ApiException("Seats already generated for this flight", HttpStatus.CONFLICT);
        }
        if (request.getSeatsPerRow() > SEAT_LETTERS.length) {
            throw new ApiException(
                    "seatsPerRow cannot exceed " + SEAT_LETTERS.length, HttpStatus.BAD_REQUEST);
        }
        List<Seat> seats = new ArrayList<>();
        int row = 3;
        int economyRow = 20;

        row = buildRows(flight, SeatClass.BUSINESS, request.getBusinessRows(), request.getSeatsPerRow(), row, seats);

        int i = buildRows(flight, SeatClass.ECONOMY, request.getEconomyRows(), request.getSeatsPerRow(), row, seats);
        log.info("Returned value of buildRows "+ i);
        try {
            List<Seat> saved = seatRepository.saveAll(seats);
            seatRepository.flush(); // force the insert (and constraint check) now, inside this try block
            return saved.stream().map(seatMapper::toResponse).toList();
        } catch (DataIntegrityViolationException ex) {
            throw new ApiException( "Seats already generated for this flight",HttpStatus.CONFLICT);
        }

    }

    private int buildRows(Flight flight, SeatClass seatClass, int rowCount, int seatsPerRow, int startRow, List<Seat> seats) {
        for (int r = startRow; r < startRow + rowCount; r++) {
            for (int s = 0; s < seatsPerRow; s++) {
                seats.add(Seat.builder()
                        .flight(flight)
                        .seatNumber(r + String.valueOf(SEAT_LETTERS[s]))
                        .seatClass(seatClass)
                        .status(SeatStatus.AVAILABLE)
                        .build());
            }
        }
        return startRow + rowCount;
    }

    public List<SeatResponse> getSeatsForFlight(Long flightId) {
        return seatRepository.findByFlightId(flightId).stream()
                .map(seatMapper::toResponse)
                .toList();
    }

}
