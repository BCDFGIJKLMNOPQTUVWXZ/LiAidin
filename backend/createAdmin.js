import { connectDB, database } from './db/db.js';

const User = database.User;

const setupAdmin = async () => {
  try {
    await connectDB();

    // Step 1: Fetch ALL users with this email (could be duplicates)
    const admins = await User.findAll({
      where: { email: 'shreya@example.com' }
    });

    if (admins.length === 0) {
      console.log("No admin found. Creating one...");
    }

    if (admins.length === 1) {
      console.log("Admin already exists:", admins[0].email);
    }

    // Step 2: If duplicates exist, delete all except the first
    if (admins.length > 1) {
      console.log(`Found ${admins.length} duplicate admins. Cleaning...`);
      const [keep, ...remove] = admins;

      for (const dup of remove) {
        await dup.destroy();
        console.log(`Deleted duplicate admin with ID: ${dup.id}`);
      }
    }

    // Step 3: Create admin only if none exist
    if (admins.length === 0) {
      const admin = await User.create({
        name: 'Shreya Singh',
        email: 'shreya@example.com',
        password: 'AdminStrongPassword123',
        role: 'admin',
      });

      console.log("Admin created:", admin.email);
    }

  } catch (err) {
    console.error("Error running admin setup:", err);
  } finally {
    process.exit(0);
  }
};

setupAdmin();






// import { connectDB, database } from './db/db.js';

// const User = database.User;

// const createAdmin = async () => {
//   try {
//     await connectDB();

//     // Check if admin already exists
//     const existingAdmin = await User.findOne({ where: { email: 'shreya@example.com' } });
//     if (existingAdmin) {
//       console.log('Admin already exists:', existingAdmin.email);
//       return;
//     }

//     // Just pass plain password; model hook will hash it
//     const admin = await User.create({
//       name: 'Shreya Singh',
//       email: 'shreya@example.com',
//       password: 'AdminStrongPassword123', // plain text
//       role: 'admin'
//     });

//     console.log('Admin created successfully:', admin.email);
//     process.exit(0); // exit script
//   } catch (err) {
//     console.error('Failed to create admin:', err);
//     process.exit(1);
//   }
// };

// createAdmin();
