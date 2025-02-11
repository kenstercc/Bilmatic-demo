import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.JDBCType;
import java.sql.ResultSet;
import java.sql.Statement;

public class ViewContractSP {
   
    
    public static void main(String[] args) {

        ResultSet myRs = null;

        try {
            // Get connection to the database
            Connection con = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/bilmatic", "root", "Pheobus@1958");
            
            // Prepare the stored procedure call
            CallableStatement stmt = con.prepareCall("{call view_contracts1(?,?,?,?,?,?,?,?)}"); 
            stmt.setString(1, "company01");
            stmt.setString(2, "com");
            stmt.setString(3, "office01");
            stmt.setString(4, "off");
            stmt.setString(5, "Account");
            stmt.setString(6, "n/a");
            stmt.setString(7, "regu");
            stmt.setString(8, "a");
            
            
            // Calling stored procedure and check results
            boolean b = stmt.execute();
            if (b==true){
                System.out.println("successful");
            }
            else
                System.out.println("Unsuccessful");

            // Get the result set
            
            myRs = stmt.getResultSet();

            System.out.println(myRs);
            ;
            
        } catch (Exception e) {
            System.out.println(e);
        }
    }}