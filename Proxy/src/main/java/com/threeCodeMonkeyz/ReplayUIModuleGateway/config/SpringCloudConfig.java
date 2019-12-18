package com.threeCodeMonkeyz.ReplayUIModuleGateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringCloudConfig {

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route(r -> r.path("/api/**")
                        .uri("http://localhost:3000/")
                        .id("apiBackend"))

                .route(r -> r.path("/**")
                        .uri("http://localhost:8080/")
                        .id("webFrontend"))
                .build();
    }

}
