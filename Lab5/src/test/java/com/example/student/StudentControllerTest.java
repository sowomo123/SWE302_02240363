package com.example.student;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
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
        student.setId(1L);
    }

    @Test
    void shouldCreateStudentThroughApi() throws Exception {
        when(studentService.addStudent(any(Student.class)))
                .thenReturn(student);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(student)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentId").value("S001"))
                .andExpect(jsonPath("$.name").value("Sonam"))
                .andExpect(jsonPath("$.email").value("sonam@example.com"));
    }

    @Test
    void shouldGetAllStudentsThroughApi() throws Exception {
        when(studentService.getAllStudents())
                .thenReturn(List.of(student));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentId").value("S001"));
    }

    @Test
    void shouldGetStudentByStudentIdThroughApi() throws Exception {
        when(studentService.getStudentByStudentId("S001"))
                .thenReturn(Optional.of(student));

        mockMvc.perform(get("/api/students/student-id/S001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Sonam"));
    }

    @Test
    void shouldReturnNotFoundForMissingStudent() throws Exception {
        when(studentService.getStudentById(999999L))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/students/999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldUpdateStudentThroughApi() throws Exception {
        Student updated = new Student(
                null,
                "Sonam Wangmo",
                null,
                21
        );

        when(studentService.updateStudent(eq(1L), any(Student.class)))
                .thenReturn(updated);

        mockMvc.perform(put("/api/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Sonam Wangmo"))
                .andExpect(jsonPath("$.age").value(21));
    }

    @Test
    void shouldDeleteStudentThroughApi() throws Exception {
        doNothing().when(studentService).deleteStudent(1L);

        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isNoContent());

        verify(studentService).deleteStudent(1L);
    }
}
