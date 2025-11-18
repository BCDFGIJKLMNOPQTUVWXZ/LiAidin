import { Sequelize, DataTypes } from 'sequelize';
import UserModel from '../src/models/User.model.js';
import 'dotenv/config'; 

// Sequelize connection settings taken directly from process.env
const sequelize = new Sequelize(
  //These are the first three required arguments to the Sequelize constructor: Database Name, Username, and Password. They are securely fetched from the process.env object (loaded via dotenv) instead of being hardcoded.
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { //Starts the fourth argument, which is a required configuration object containing all options and settings.
    host: process.env.DB_HOST,  //Specifies the location (IP or hostname) of the running MySQL server (e.g., localhost).
    dialect: 'mysql',  //CRITICAL. This tells Sequelize (the ORM) that it needs to translate JavaScript into commands for a MySQL database. It uses the mysql2 driver package we installed.
    // Sequelize settings
    pool: {  //Defines the Connection Pool. This is a performance optimization that keeps a minimum (min: 0) and maximum (max: 5) number of database connections open and ready. This prevents the server from constantly opening and closing connections, making your app much faster and scalable under load.
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // Only log SQL queries in development mode
    //Logging Control. This conditional statement controls whether Sequelize prints the raw SQL queries it executes to the console. It is set to console.log (true) only if NODE_ENV is development, helping you debug. It's set to false in production.
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      freezeTableName: true,  //Prevents Sequelize from pluralizing table names. This means a model named 'User' will map to a table named 'User' instead of the default 'Users'.
    }
  }
);

//This object will be exported from your db/index.js file and imported into every other backend file that needs to interact with the database (controllers, routes, services).
const database = {}; 

database.Sequelize = Sequelize; //You are taking the imported Sequelize library (the entire module itself) and assigning it as a property on your database object. This lets later files access the Sequelize library's overall functions without having to import it repeatedly.
database.sequelize = sequelize; //Here, you are adding the specific Sequelize instance you created (configured to connect to your MySQL database) as another property on the database object. This instance is what you'll use to interact with your database (run queries, define models, etc.).
database.DataTypes = DataTypes; //You are storing the data types object provided by Sequelize. When you define your models (like your User model with the role: DataTypes.ENUM), the model file needs access to these standardized types.

// Initialize Models
database.User = UserModel(sequelize, DataTypes);
// database.MessageHistory = MessageHistoryModel(sequelize, DataTypes); // Add other models here

const connectDB = async () => {
    try {
        // Test the connection credentials
        await sequelize.authenticate();
        console.log(`MySQL Connected Successfully. Host: ${process.env.DB_HOST}`); // Use process.env directly

        // Sync models to the database (creates tables if they don't exist)
        await sequelize.sync({ force: false });
        console.log("All Sequelize models synchronized successfully.");
        
        return database;

    } catch (error) {
        console.error("SEQUELIZE db connection failed:", error);
        // Exiting the process is clean practice on failure
        process.exit(1);
    }
}

export { connectDB, database };