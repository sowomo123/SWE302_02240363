package com.example.student;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student(
                "S001",
                "Sonam",
                "sonam@example.com",
                20
        );
    }

    @Test
    void shouldAddStudentSuccessfully() {
        when(studentRepository.existsByStudentId("S001"))
                .thenReturn(false);
        when(studentRepository.existsByEmail("sonam@example.com"))
                .thenReturn(false);
        when(studentRepository.save(student))
                .thenReturn(student);

        Student result = studentService.addStudent(student);

        assertNotNull(result);
        assertEquals("S001", result.getStudentId());
        verify(studentRepository).save(student);
    }

    @Test
    void shouldRejectMissingStudentId() {
        student.setStudentId(null);

        IllegalArgumentException error = assertThrows(
                IllegalArgumentException.class,
                () -> studentService.addStudent(student)
        );

        assertEquals(
                "Student ID cannot be null or empty",
                error.getMessage()
        );
        verify(studentRepository, never()).save(any());
    }

    @Test
    void shouldRejectEmptyStudentName() {
        student.setName("");

        assertThrows(
                IllegalArgumentException.class,
                () -> studentService.addStudent(student)
        );

        verify(studentRepository, never()).save(any());
    }

    @Test
    void shouldRejectWhitespaceOnlyStudentName() {
        student.setName("   ");

        assertThrows(
                IllegalArgumentException.class,
                () -> studentService.addStudent(student)
        );

        verify(studentRepository, never()).save(any());
    }

    @Test
    void shouldRejectMissingEmail() {
        student.setEmail(null);

        assertThrows(
                IllegalArgumentException.class,
                () -> studentService.addStudent(student)
        );

        verify(studentRepository, never()).save(any());
    }

    @Test
    void shouldRejectDuplicateStudentId() {
        when(studentRepository.existsByStudentId("S001"))
                .thenReturn(true);

        assertThrows(
                IllegalStateException.class,
                () -> studentService.addStudent(student)
        );

        verify(studentRepository, never()).save(any());
    }

    @Test
    void shouldRejectDuplicateEmail() {
        when(studentRepository.existsByStudentId("S001"))
                .thenReturn(false);
        when(studentRepository.existsByEmail("sonam@example.com"))
                .thenReturn(true);

        assertThrows(
                IllegalStateException.class,
                () -> studentService.addStudent(student)
        );

        verify(studentRepository, never()).save(any());
    }

    @Test
    void shouldReturnAllStudents() {
        when(studentRepository.findAll())
                .thenReturn(List.of(student));

        List<Student> result = studentService.getAllStudents();

        assertEquals(1, result.size());
        assertEquals("S001", result.get(0).getStudentId());
    }

    @Test
    void shouldReturnStudentWhenFound() {
        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        Optional<Student> result =
                studentService.getStudentById(1L);

        assertTrue(result.isPresent());
        assertEquals("Sonam", result.get().getName());
    }

    @Test
    void shouldRejectUpdateForMissingStudent() {
        when(studentRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                IllegalArgumentException.class,
                () -> studentService.updateStudent(999L, student)
        );
    }
}
