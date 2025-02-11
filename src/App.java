import java.sql.Connection;
import java.sql.DriverManager;

class JDBCTest {

    private static final String url = "jdbc:mysql://localhost:3306/bilmatic";

    private static final String user = "root";

    private static final String password = "Pheobus@1958";

    public static void main(String args[]) {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("Success");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}