package io.gateways.server;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import io.gateways.server.enumeration.Status;
import io.gateways.server.model.Server;
import io.gateways.server.repo.ServerRepo;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Bean
	CommandLineRunner run(ServerRepo serverRepo) {
		return args -> {
			serverRepo.save(new Server(null, "192.168.1.160", "Ubuntu Linux", "16 GB", 
			"Personal PC", "https://localhosts/servers/images/server1.jpg", Status.SERVER_UP));

			serverRepo.save(new Server(null, "192.165.1.160", "Fedora Linux", "16 GB", 
			"Dell Tower", "https://localhosts/servers/images/server2.jpg", Status.SERVER_DOWN));

			serverRepo.save(new Server(null, "192.163.1.160", "MS 2008", "32 GB", 
			"Web Server", "https://localhosts/servers/images/server1.jpg", Status.SERVER_UP));

			serverRepo.save(new Server(null, "193.168.1.160", "Red Hat Enterprise Linux", "64 GB", 
			"Mail Server", "https://localhosts/servers/images/server2.jpg", Status.SERVER_DOWN));
		};
	}
}
