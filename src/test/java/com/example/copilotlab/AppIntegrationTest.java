package com.example.copilotlab;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AppIntegrationTest {

    private App app;
    private final HttpClient client = HttpClient.newHttpClient();

    @AfterEach
    void tearDown() {
        if (app != null) {
            app.stop();
        }
    }

    @Test
    void apiUsersReturnsAllSamplesByDefault() throws IOException, InterruptedException {
        startServer();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://127.0.0.1:" + app.getPort() + "/api/users"))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("\"name\":\"Ada Lovelace\""));
        assertTrue(response.body().contains("\"name\":\"Grace Hopper\""));
        assertTrue(response.body().contains("\"name\":\"Linus Torvalds\""));
    }

    @Test
    void apiUsersSearchIsCaseInsensitive() throws IOException, InterruptedException {
        startServer();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://127.0.0.1:" + app.getPort() + "/api/users?search=platform"))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("\"name\":\"Grace Hopper\""));
        assertEquals(1, response.body().chars().filter(ch -> ch == '{').count());
    }

    @Test
    void apiUserByIdReturnsSingleUserJson() throws IOException, InterruptedException {
        startServer();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://127.0.0.1:" + app.getPort() + "/api/users/2"))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("\"id\":2"));
        assertTrue(response.body().contains("\"name\":\"Grace Hopper\""));
    }

    @Test
    void apiUserByIdReturns404ForMissingUser() throws IOException, InterruptedException {
        startServer();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://127.0.0.1:" + app.getPort() + "/api/users/999"))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(404, response.statusCode());
    }

    private void startServer() throws IOException {
        app = new App();
        app.start(0);
    }
}
