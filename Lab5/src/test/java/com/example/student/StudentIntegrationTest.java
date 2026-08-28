package com.example.student;

import org.junit.jupiter.api.*;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class StudentIntegrationTest {

    private static final String DB_URL = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1";
    private static final String DB_USER = "sa";
    private static final String DB_PASSWORD = "";

    @BeforeEach
    void setUp() throws SQLException {
        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            try (Statement statement = connection.createStatement()) {

                statement.execute("DROP TABLE IF EXISTS students");

                statement.execute(
                        "CREATE TABLE students (" +
                                "id SERIAL PRIMARY KEY, " +
                                "student_id VARCHAR(20) UNIQUE NOT NULL, " +
                                "name VARCHAR(100) NOT NULL, " +
                                "email VARCHAR(100) UNIQUE NOT NULL, " +
                                "age INT)"
                );
            }
        }
    }

    @Test
    @Order(1)
    @DisplayName("Test 1: Create student successfully")
    void shouldCreateStudent() throws Exception {

        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "INSERT INTO students(student_id, name, email, age) " +
                            "VALUES (?, ?, ?, ?)"
            );

            statement.setString(1, "S001");
            statement.setString(2, "Sonam");
            statement.setString(3, "sonam@example.com");
            statement.setInt(4, 20);

            int result = statement.executeUpdate();

            assertEquals(1, result);
        }
    }

    @Test
    @Order(2)
    @DisplayName("Test 2: Retrieve student by student ID")
    void shouldRetrieveStudent() throws Exception {

        // Insert student
        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "INSERT INTO students(student_id, name, email, age) " +
                            "VALUES (?, ?, ?, ?)"
            );

            statement.setString(1, "S001");
            statement.setString(2, "Sonam");
            statement.setString(3, "sonam@example.com");
            statement.setInt(4, 20);

            statement.executeUpdate();
        }

        // Retrieve student
        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "SELECT * FROM students WHERE student_id = ?"
            );

            statement.setString(1, "S001");

            var result = statement.executeQuery();

            assertTrue(result.next());
            assertEquals("Sonam", result.getString("name"));
            assertEquals("sonam@example.com", result.getString("email"));
            assertEquals(20, result.getInt("age"));
        }
    }

    @Test
    @Order(3)
    @DisplayName("Test 3: Update student information")
    void shouldUpdateStudent() throws Exception {

        // Insert student
        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "INSERT INTO students(student_id, name, email, age) " +
                            "VALUES (?, ?, ?, ?)"
            );

            statement.setString(1, "S001");
            statement.setString(2, "Sonam");
            statement.setString(3, "sonam@example.com");
            statement.setInt(4, 20);

            statement.executeUpdate();
        }

        // Update student
        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "UPDATE students SET name = ? WHERE student_id = ?"
            );

            statement.setString(1, "Sonam Wangmo");
            statement.setString(2, "S001");

            int result = statement.executeUpdate();

            assertEquals(1, result);

            // Verify update
            var verify = connection.prepareStatement(
                    "SELECT name FROM students WHERE student_id = ?"
            );

            verify.setString(1, "S001");

            var resultSet = verify.executeQuery();

            assertTrue(resultSet.next());
            assertEquals("Sonam Wangmo", resultSet.getString("name"));
        }
    }

    @Test
    @Order(4)
    @DisplayName("Test 4: Delete student")
    void shouldDeleteStudent() throws Exception {

        // Insert student
        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "INSERT INTO students(student_id, name, email, age) " +
                            "VALUES (?, ?, ?, ?)"
            );

            statement.setString(1, "S001");
            statement.setString(2, "Sonam");
            statement.setString(3, "sonam@example.com");
            statement.setInt(4, 20);

            statement.executeUpdate();
        }

        // Delete student
        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "DELETE FROM students WHERE student_id = ?"
            );

            statement.setString(1, "S001");

            int result = statement.executeUpdate();

            assertEquals(1, result);

            // Verify deletion
            var verify = connection.prepareStatement(
                    "SELECT * FROM students WHERE student_id = ?"
            );

            verify.setString(1, "S001");

            var resultSet = verify.executeQuery();

            assertFalse(resultSet.next());
        }
    }

    @Test
    @Order(5)
    @DisplayName("Test 5: Handle non-existent student")
    void shouldHandleNonExistentStudent() throws Exception {

        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "SELECT * FROM students WHERE student_id = ?"
            );

            statement.setString(1, "S999");

            var result = statement.executeQuery();

            assertFalse(result.next());
        }
    }

    @Test
    @Order(6)
    @DisplayName("Test 6: Prevent duplicate student ID")
    void shouldPreventDuplicateStudent() throws Exception {

        // Insert first student
        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "INSERT INTO students(student_id, name, email, age) " +
                            "VALUES (?, ?, ?, ?)"
            );

            statement.setString(1, "S100");
            statement.setString(2, "Dorji");
            statement.setString(3, "dorji@example.com");
            statement.setInt(4, 22);

            statement.executeUpdate();
        }

        // Try duplicate student ID
        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "INSERT INTO students(student_id, name, email, age) " +
                            "VALUES (?, ?, ?, ?)"
            );

            statement.setString(1, "S100");
            statement.setString(2, "Tashi");
            statement.setString(3, "tashi@example.com");
            statement.setInt(4, 23);

            assertThrows(SQLException.class, statement::executeUpdate);
        }
    }

    @Test
    @Order(7)
    @DisplayName("Test 7: List all students")
    void shouldListAllStudents() throws Exception {

        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.prepareStatement(
                    "INSERT INTO students(student_id, name, email, age) " +
                            "VALUES (?, ?, ?, ?)"
            );

            statement.setString(1, "S001");
            statement.setString(2, "Sonam");
            statement.setString(3, "sonam@example.com");
            statement.setInt(4, 20);
            statement.executeUpdate();

            statement.setString(1, "S002");
            statement.setString(2, "Dorji");
            statement.setString(3, "dorji@example.com");
            statement.setInt(4, 21);
            statement.executeUpdate();

            statement.setString(1, "S003");
            statement.setString(2, "Tashi");
            statement.setString(3, "tashi@example.com");
            statement.setInt(4, 22);
            statement.executeUpdate();
        }

        try (Connection connection =
                     DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            var statement = connection.createStatement();

            var result = statement.executeQuery(
                    "SELECT COUNT(*) FROM students"
            );

            assertTrue(result.next());
            assertEquals(3, result.getInt(1));
        }
    }
}