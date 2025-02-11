import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

  

public class JavaJDBC {
    public static void main(String[] args) {
        try {
            // Get connection to the database
            Connection connection = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/bilmatic", "root", "Pheobus@1958");
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("select * from billing_contract");
            while (resultSet.next()) {
                System.out.println(resultSet.getString(1) + " " + resultSet.getString(2) + " " + resultSet.getString(3));
                ;

            }
            connection.close();

            
        } catch (Exception e) {
            System.out.println(e);
        }
    }}