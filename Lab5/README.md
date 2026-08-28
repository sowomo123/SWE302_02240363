# Student Management System - Lab 5 Integration Tests

## Overview
This project implements a Student Management System with integration tests using Testcontainers and PostgreSQL database for SWE302 Lab 5.

## Project Structure
```
Lab5/
├── src/
│   ├── main/
│   │   ├── java/com/example/student/
│   │   │   ├── Student.java              # Entity class
│   │   │   ├── StudentRepository.java     # JPA Repository
│   │   │   ├── StudentService.java        # Business logic
│   │   │   └── StudentManagementApplication.java  # Spring Boot main class
│   │   └── resources/
│   │       └── application.properties    # Database configuration
│   └── test/
│       ├── java/com/example/student/
│       │   └── StudentIntegrationTest.java        # Integration tests with Testcontainers
│       └── resources/
│           └── application.properties    # Test database configuration
└── pom.xml
```

## Technology Stack
- **Java 17**: Programming language
- **Spring Boot 3.2.0**: Application framework
- **Spring Data JPA**: ORM and database operations
- **PostgreSQL 16**: Database
- **Testcontainers 1.19.3**: Database containerization for testing
- **JUnit 5**: Testing framework
- **Maven**: Build tool

## Database Configuration
The system connects to PostgreSQL with these credentials:
- **Host**: localhost:5432
- **Database**: studentdb
- **Username**: studentuser
- **Password**: studentpass

## Running the Tests

### Prerequisites
1. Java 17 or higher installed
2. Maven 3.6 or higher installed
3. Docker Desktop running
4. PostgreSQL Docker image downloaded

### Run Integration Tests
```bash
cd Lab5
mvn test
```

This will:
1. Start a PostgreSQL container using Testcontainers
2. Run all integration tests
3. Automatically stop the container after tests complete

## Test Coverage

The integration tests cover the following scenarios:

1. **Create student** - Insert a new student record
2. **Retrieve student** - Fetch student details by student ID
3. **Update student** - Modify student information
4. **Delete student** - Remove a student record
5. **Non-existent student** - Handle queries for non-existent records
6. **Duplicate prevention** - Prevent duplicate student IDs
7. **List all students** - Retrieve all student records

## Features Implemented

### Student Management Operations
- **Add/Register Student**: Create new student records with validation
- **View Student Details**: Retrieve student information by ID or student ID
- **List All Students**: Get all registered students
- **Update Student**: Modify student information
- **Delete Student**: Remove student records by ID or student ID

### Business Rules
- Student ID must be unique (prevents duplicates)
- Email must be unique (prevents duplicates)
- Student ID, name, and email are required fields
- Proper error handling for non-existent records

## Lab Requirements Met

✅ Student Management System connected to PostgreSQL database  
✅ Core features implemented: Add, View, Update, Delete students  
✅ Invalid/non-existent record handling  
✅ Duplicate record prevention  
✅ Testcontainers configuration for PostgreSQL  
✅ Integration tests using actual database (not mocked)  
✅ Tests for all major database operations  
✅ Proper test environment isolation  
