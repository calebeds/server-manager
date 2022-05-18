package io.gateways.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import io.gateways.server.model.Server;

public interface ServerRepo extends JpaRepository<Server, Long>{
    Server findByIpAddress(String ipAddress);
}
