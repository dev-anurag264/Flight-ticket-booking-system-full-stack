package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.dto.airportdto.AirportRequest;
import com.codewithcoffee.FlightBooking.entity.Airport;
import com.codewithcoffee.FlightBooking.exceptions.ApiException;
import com.codewithcoffee.FlightBooking.mapper.AirportMapper;
import com.codewithcoffee.FlightBooking.repository.AirportRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AirportServiceTest {

    @Mock
    private AirportRepository airportRepository;
    @Mock
    private AirportMapper mapper;

    @InjectMocks
    private AirportService airportService;

    @Test
    void create_saveAirport_whenIATACodeIsUnique(){
        AirportRequest request = new AirportRequest();
        request.setIataCode("BLR");
        request.setName("Kempegowda International");
        request.setCity("Bengaluru");
        request.setCountry("India");

        Airport entity = Airport.builder().iataCode("BLR").build();
        when(airportRepository.existsByIataCode("BLR")).thenReturn(false); //iata code is duplicate
        when(mapper.toEntity(request)).thenReturn(entity);
        when(airportRepository.save(entity)).thenReturn(entity);

        airportService.create(request);

        verify(airportRepository).save(entity);
        verify(mapper).toResponse(entity);
    }

    @Test
    void create_throwsConflict_whenIataCodeAlreadyExists() {
        AirportRequest request = new AirportRequest();
        request.setIataCode("BLR");

        when(airportRepository.existsByIataCode("BLR")).thenReturn(true);

        assertThatThrownBy(() -> airportService.create(request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("already exists");

        verify(airportRepository, never()).save(any());
    }

    @Test
    void getById_throwsNotFound_whenAirportDoesNotExist() {
        when(airportRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> airportService.getById(99L))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("not found");
    }
}