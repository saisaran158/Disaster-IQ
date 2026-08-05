package com.kce.project.security.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;

import org.springframework.security.core.AuthenticationException;

import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class JwtAuthenticationEntryPoint
        implements AuthenticationEntryPoint {

    @Override
    public void commence(

            HttpServletRequest request,

            HttpServletResponse response,

            AuthenticationException authException)

            throws IOException, ServletException {

        response.sendError(

                HttpServletResponse.SC_UNAUTHORIZED,

                "Unauthorized"

        );

    }

}