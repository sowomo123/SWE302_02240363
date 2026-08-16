package com.example.library;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class LibraryService {
    private Map<String, String> books = new HashMap<>();
    private Map<String, String> borrowedBooks = new HashMap<>();

    public void addBook(String id, String title) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Book ID cannot be null or empty");
        }
        books.put(id, title);
    }

    public boolean isBookAvailable(String id) {
        return books.containsKey(id) && !borrowedBooks.containsKey(id);
    }

    public void borrowBook(String userId, String bookId) {
        if (!books.containsKey(bookId)) {
            throw new IllegalArgumentException("Book does not exist");
        }
        if (borrowedBooks.containsKey(bookId)) {
            throw new IllegalStateException("Book is already borrowed");
        }
        long userBorrowedCount = borrowedBooks.values().stream()
                .filter(userId::equals)
                .count();
        if (userBorrowedCount >= 5) {
            throw new IllegalStateException("User cannot borrow more than 5 books");
        }
        borrowedBooks.put(bookId, userId);
    }

    public void returnBook(String userId, String bookId) {
        if (!books.containsKey(bookId)) {
            throw new IllegalArgumentException("Book does not exist");
        }
        if (!borrowedBooks.containsKey(bookId)) {
            throw new IllegalStateException("Book is not currently borrowed");
        }
        if (!borrowedBooks.get(bookId).equals(userId)) {
            throw new IllegalStateException("Book was borrowed by a different user");
        }
        borrowedBooks.remove(bookId);
    }

    public double calculateOverdueFine(String bookId, LocalDate borrowDate, LocalDate returnDate) {
        LocalDate dueDate = borrowDate.plusDays(14);
        if (returnDate.isAfter(dueDate)) {
            long daysLate = returnDate.toEpochDay() - dueDate.toEpochDay();
            return daysLate * 0.50;
        }
        return 0.0;
    }
}
