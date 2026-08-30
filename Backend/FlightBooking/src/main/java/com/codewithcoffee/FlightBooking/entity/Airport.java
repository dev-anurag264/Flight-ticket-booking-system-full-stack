package com.codewithcoffee.FlightBooking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "airports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "iata_code", nullable = false, unique = true, length = 3)
    private String iataCode;

    @Column(nullable = false, length = 200)
    private String name;
    @Column(nullable = false, length = 100)
    private String country;
    @Column(nullable = false, length = 100)
    private String city;


}
