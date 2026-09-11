package com.codewithcoffee.FlightBooking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "seats",
        uniqueConstraints = @UniqueConstraint(columnNames = {"flight_id", "seat_number"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @Column(name = "seat_number", nullable = false, length = 5)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_class", nullable = false, length = 20)
    private SeatClass seatClass;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SeatStatus status=SeatStatus.AVAILABLE;

    @Version
    @Column(nullable = false)
    private Long version;


}
