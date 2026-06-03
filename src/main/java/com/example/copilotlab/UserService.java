package com.example.copilotlab;

import java.util.List;
import java.util.Locale;

public class UserService {

    private final List<User> sampleUsers = List.of(
            new User(1, "Ada Lovelace", "Application Developer", "Modernization"),
            new User(2, "Grace Hopper", "Principal Engineer", "Platform"),
            new User(3, "Linus Torvalds", "Systems Developer", "Infrastructure"));

    public List<User> findUsers(String searchText) {
        String normalizedSearch = normalize(searchText);

        if (normalizedSearch.isBlank()) {
            return sampleUsers;
        }

        return sampleUsers.stream()
                .filter(user -> containsIgnoreCase(user.name(), normalizedSearch)
                        || containsIgnoreCase(user.role(), normalizedSearch)
                        || containsIgnoreCase(user.team(), normalizedSearch))
                .toList();
    }

    public String summarize(User user) {
        return safe(user.name()) + " - " + safe(user.role()) + " (" + safe(user.team()) + ")";
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private boolean containsIgnoreCase(String value, String searchText) {
        if (value == null) {
            return false;
        }

        return value.toLowerCase(Locale.ROOT).contains(searchText);
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
