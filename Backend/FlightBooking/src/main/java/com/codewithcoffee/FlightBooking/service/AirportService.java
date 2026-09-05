package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.dto.airportdto.AirportRequest;
import com.codewithcoffee.FlightBooking.dto.airportdto.AirportResponse;
import com.codewithcoffee.FlightBooking.entity.Airport;
import com.codewithcoffee.FlightBooking.exceptions.ApiException;
import com.codewithcoffee.FlightBooking.mapper.AirportMapper;
import com.codewithcoffee.FlightBooking.repository.AirportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AirportService {
    private final AirportRepository airportRepository;
    private final AirportMapper airportMapper;


    public AirportResponse create(AirportRequest request) {
        String code = request.getIataCode().toUpperCase();
        if (airportRepository.existsByIataCode(code)) {
            throw new ApiException("Airport with this IATA code already exists", HttpStatus.CONFLICT);
        }
        Airport saved = airportRepository.save(airportMapper.toEntity(request));
        return airportMapper.toResponse(saved);
    }

    public List<AirportResponse> getAll() {
        return airportRepository.findAll().stream()
                .map(airportMapper::toResponse)
                .toList();
    }

    public AirportResponse getById(Long id) {
        Airport airport = findAirportOrThrow(id);
        return airportMapper.toResponse(airport);
    }

    public AirportResponse update(Long id, AirportRequest request) {
        Airport airport = findAirportOrThrow(id);
        String newCode = request.getIataCode().toUpperCase();

        if (!airport.getIataCode().equals(newCode) && airportRepository.existsByIataCode(newCode)) {
            throw new RuntimeException(HttpStatus.CONFLICT + "Airport with this IATA code already exists");
        }

        airport.setIataCode(newCode);
        airport.setName(request.getName());
        airport.setCity(request.getCity());
        airport.setCountry(request.getCountry());

        return airportMapper.toResponse(airport);
    }

    public void delete(Long id) {
        Airport airport = findAirportOrThrow(id);
        airportRepository.delete(airport);
    }

    private Airport findAirportOrThrow(Long id) {
        return airportRepository.findById(id)
                .orElseThrow(() -> new ApiException("Airport not found", HttpStatus.NOT_FOUND));
    }
}
