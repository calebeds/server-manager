package io.gateways.server;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.gateways.server.enumeration.Status;
import io.gateways.server.model.Server;
import io.gateways.server.repo.ServerRepo;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	CommandLineRunner run(ServerRepo serverRepo) {
		return args -> {//Adding servers
			serverRepo.save(new Server(null, "192.168.1.160", "Ubuntu Linux", "16 GB",
			 "Personal PC","http://localhost:8080/server/images/server1.png", Status.SERVER_UP));
			 serverRepo.save(new Server(null, "192.168.1.160", "Fedora Linux", "16 GB",
			 "Dell Tower","http://localhost:8080/server/images/server2.png", Status.SERVER_DOWN));
			 serverRepo.save(new Server(null, "192.168.1.160", "MS 2008", "32 GB",
			 "Web Server","http://localhost:8080/server/images/server1.png", Status.SERVER_UP));
			 serverRepo.save(new Server(null, "192.168.1.160", "red Hat Enterprise Linux", "64 GB",
			 "Mail Server","http://localhost:8080/server/images/server2.png", Status.SERVER_DOWN));
		};
	}

}
