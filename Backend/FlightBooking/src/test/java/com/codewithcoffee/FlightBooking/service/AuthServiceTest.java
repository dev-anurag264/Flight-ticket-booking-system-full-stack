package com.codewithcoffee.FlightBooking.service;

import com.codewithcoffee.FlightBooking.dto.RegisterRequest;
import com.codewithcoffee.FlightBooking.entity.Role;
import com.codewithcoffee.FlightBooking.entity.User;
import com.codewithcoffee.FlightBooking.repository.UserRepository;
import com.codewithcoffee.FlightBooking.util.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.mockito.Mockito.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_saveUserAsCustomer_returnsToken() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Anurag");
        request.setEmail("anuragcse23@gmail.com");
        request.setPassword("pass123");


        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashed-password");
        when(jwtService.generateToken(any(User.class))).thenReturn("fake-jwt");

        var response = authService.register(request);

        assertThat(response.getToken()).isEqualTo("fake-jwt");
        assertThat(response.getRole()).isEqualTo(Role.USER.name());

        verify(userRepository).save(argThat(user ->
                user.getRole() == Role.USER &&
                        user.getPassword().equals("hashed-password")
        ));
    }

    @Test
    void register_throwsConflict_whenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("taken@example.com");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("already registered");

        verify(userRepository, never()).save(any());
    }
    @Test
    void login() {
    }
}