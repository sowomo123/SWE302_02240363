package com.example.library;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class LibraryServiceTest {

    private LibraryService libraryService;

    @BeforeEach
    void setUp() {
        libraryService = new LibraryService();
    }

    @Nested
    class AddBookTests {
        @Test
        void addBookWithValidIdAndTitle_makesBookAvailable() {
            libraryService.addBook("B001", "The Great Gatsby");
            assertTrue(libraryService.isBookAvailable("B001"));
        }

        @Test
        void addBookWithEmptyId_throwsException() {
            assertThrows(IllegalArgumentException.class, () -> {
                libraryService.addBook("", "The Great Gatsby");
            });
        }

        @Test
        void addBookWithNullId_throwsException() {
            assertThrows(IllegalArgumentException.class, () -> {
                libraryService.addBook(null, "The Great Gatsby");
            });
        }
    }

    @Nested
    class BorrowBookTests {
        @Test
        void borrowAvailableBook_makesBookUnavailable() {
            libraryService.addBook("B001", "The Great Gatsby");
            libraryService.borrowBook("U001", "B001");
            assertFalse(libraryService.isBookAvailable("B001"));
        }

        @Test
        void borrowAlreadyBorrowedBook_throwsException() {
            libraryService.addBook("B001", "The Great Gatsby");
            libraryService.borrowBook("U001", "B001");
            assertThrows(IllegalStateException.class, () -> {
                libraryService.borrowBook("U002", "B001");
            });
        }

        @Test
        void borrowNonexistentBook_throwsException() {
            assertThrows(IllegalArgumentException.class, () -> {
                libraryService.borrowBook("U001", "B999");
            });
        }

        @Test
        void borrowExactlyFiveBooks_succeeds() {
            libraryService.addBook("B001", "Book 1");
            libraryService.addBook("B002", "Book 2");
            libraryService.addBook("B003", "Book 3");
            libraryService.addBook("B004", "Book 4");
            libraryService.addBook("B005", "Book 5");
            
            libraryService.borrowBook("U001", "B001");
            libraryService.borrowBook("U001", "B002");
            libraryService.borrowBook("U001", "B003");
            libraryService.borrowBook("U001", "B004");
            libraryService.borrowBook("U001", "B005");
            
            assertFalse(libraryService.isBookAvailable("B005"));
        }

        @Test
        void borrowSixthBook_throwsException() {
            libraryService.addBook("B001", "Book 1");
            libraryService.addBook("B002", "Book 2");
            libraryService.addBook("B003", "Book 3");
            libraryService.addBook("B004", "Book 4");
            libraryService.addBook("B005", "Book 5");
            libraryService.addBook("B006", "Book 6");
            
            libraryService.borrowBook("U001", "B001");
            libraryService.borrowBook("U001", "B002");
            libraryService.borrowBook("U001", "B003");
            libraryService.borrowBook("U001", "B004");
            libraryService.borrowBook("U001", "B005");
            
            assertThrows(IllegalStateException.class, () -> {
                libraryService.borrowBook("U001", "B006");
            });
        }
    }

    @Nested
    class ReturnBookTests {
        @Test
        void returnBorrowedBook_makesBookAvailable() {
            libraryService.addBook("B001", "The Great Gatsby");
            libraryService.borrowBook("U001", "B001");
            libraryService.returnBook("U001", "B001");
            assertTrue(libraryService.isBookAvailable("B001"));
        }

        @Test
        void returnNotBorrowedBook_throwsException() {
            libraryService.addBook("B001", "The Great Gatsby");
            assertThrows(IllegalStateException.class, () -> {
                libraryService.returnBook("U001", "B001");
            });
        }

        @Test
        void returnBookBorrowedByDifferentUser_throwsException() {
            libraryService.addBook("B001", "The Great Gatsby");
            libraryService.borrowBook("U001", "B001");
            assertThrows(IllegalStateException.class, () -> {
                libraryService.returnBook("U002", "B001");
            });
        }

        @Test
        void returnInvalidBookId_throwsException() {
            assertThrows(IllegalArgumentException.class, () -> {
                libraryService.returnBook("U001", "B999");
            });
        }

        @Test
        void bookCanBeBorrowedAgainAfterReturn() {
            libraryService.addBook("B001", "The Great Gatsby");
            libraryService.borrowBook("U001", "B001");
            libraryService.returnBook("U001", "B001");
            libraryService.borrowBook("U002", "B001");
            assertFalse(libraryService.isBookAvailable("B001"));
        }
    }

    @Nested
    class OverdueFineTests {
        @Test
        void returnOnDueDate_chargesNoFine() {
            libraryService.addBook("B001", "The Great Gatsby");
            LocalDate borrowDate = LocalDate.of(2024, 1, 1);
            LocalDate returnDate = LocalDate.of(2024, 1, 15); // 14 days later
            double fine = libraryService.calculateOverdueFine("B001", borrowDate, returnDate);
            assertEquals(0.0, fine);
        }

        @Test
        void returnAfterDueDate_chargesFinePerDay() {
            libraryService.addBook("B001", "The Great Gatsby");
            LocalDate borrowDate = LocalDate.of(2024, 1, 1);
            LocalDate returnDate = LocalDate.of(2024, 1, 16); // 15 days later (1 day late)
            double fine = libraryService.calculateOverdueFine("B001", borrowDate, returnDate);
            assertEquals(0.50, fine);
        }
    }
}
