package com.kce.project.security.service;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.*;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(
            String username)
            throws UsernameNotFoundException {

        return null;

    }

}