public class Main {

    public static void main(String[] args) {

        int total = calculateTotal(10, 20);

        System.out.println("Total: " + total);

        String user1 = "Sonam";
        String user2 = "Sonam";

        if (areUsersEqual(user1, user2)) {
            System.out.println("Users are same");
        }

        int a = 10;
        int b = 2;

        if (b != 0) {
            System.out.println(a / b);
        }

        System.out.println(calculate(10, 20));
    }

    private static int calculateTotal(int x, int y) {

        if (x > 5 && y > 10 && x + y > 20) {
            return x + y;
        }

        if (x > 5 && y <= 10) {
            return x * y;
        }

        return x - y;
    }

    private static boolean areUsersEqual(String firstUser, String secondUser) {
        return firstUser.equals(secondUser);
    }

    private static int calculate(int value, int count) {

        int result = 0;

        for (int i = 0; i < count; i++) {
            result += value;
        }

        return result;
    }
}