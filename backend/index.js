import 'dotenv/config';
import { connectDB } from './db/db.js'; // Use connectDB from our new file
import app from './app.js'; // Import the Express app definition

// Connect to the SQL database and start the Express server
connectDB()
.then(() => {
    // The server is wrapped in a variable to allow for error handling
    const server = app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port: ${process.env.PORT || 5000}`);
    });

    // Listen for unexpected runtime errors
    server.on("error", (err) => {
        console.error("Runtime server error:", err);
    });
})
.catch((err) => {
    // Note: The error message changed from "MONGO db" to reflect SEQUELIZE
    console.error("SEQUELIZE db connection failed !!!", err);
});