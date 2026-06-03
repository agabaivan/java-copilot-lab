package com.example.copilotlab;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserServiceTest {

    private final UserService userService = new UserService();

    @Test
    void returnsAllUsersWhenSearchIsBlank() {
        List<User> users = userService.findUsers("");

        assertEquals(11, users.size());
    }

    @Test
    void returnsAllUsersWhenSearchIsNull() {
        List<User> users = userService.findUsers(null);

        assertEquals(11, users.size());
    }

    @Test
    void findsUsersByNameCaseInsensitive() {
        List<User> users = userService.findUsers("ada");

        assertEquals(1, users.size());
        assertEquals("Ada Lovelace", users.get(0).name());
    }

    @Test
    void findsUsersByTeam() {
        List<User> users = userService.findUsers("platform");

        assertEquals(1, users.size());
        assertEquals("Grace Hopper", users.get(0).name());
    }

    @Test
    void returnsEmptyListWhenNoUsersMatch() {
        List<User> users = userService.findUsers("not-a-user");

        assertTrue(users.isEmpty());
    }

    @Test
    void happyPath_findsByRolePartialMatch() {
        List<User> users = userService.findUsers("systems");

        assertEquals(1, users.size());
        assertEquals("Linus Torvalds", users.get(0).name());
    }

    @Test
    void whitespaceOnlySearchReturnsAllUsers() {
        List<User> users = userService.findUsers("   ");

        assertEquals(11, users.size());
    }

    @Test
    void caseInsensitiveSearchByRole() {
        List<User> users = userService.findUsers("PRINCIPAL");

        assertEquals(1, users.size());
        assertEquals("Grace Hopper", users.get(0).name());
    }

    @Test
    void summarizeProducesReadableStringAndHandlesNulls() {
        User normal = new User(10, "Test User", "Developer", "Dev Team");
        User withNulls = new User(11, null, null, null);

        assertEquals("Test User - Developer (Dev Team)", userService.summarize(normal));
        assertEquals(" -  ()", userService.summarize(withNulls));
    }

    @Test
    void findByIdReturnsMatchingUser() {
        User user = userService.findById(2);

        assertEquals("Grace Hopper", user.name());
        assertEquals("Platform", user.team());
    }

    @Test
    void findByIdReturnsNullWhenUserMissing() {
        assertEquals(null, userService.findById(999));
    }
}
