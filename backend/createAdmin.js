import { connectDB, database } from './db/db.js';
const User = database.User;

const setupAdmin = async () => {
  try {
    await connectDB();

    // Step 1: Remove duplicates
    const users = await User.findAll({ where: { email: 'shreya@example.com' } });
    if (users.length > 1) {
      const [keep, ...remove] = users;
      for (const user of remove) {
        await user.destroy();
        console.log('Deleted duplicate user:', user.id);
      }
    }

    // Step 2: Create admin safely
    const [admin, created] = await User.findOrCreate({
      where: { email: 'shreya@example.com' },
      defaults: {
        name: 'Shreya Singh',
        password: 'AdminStrongPassword123', // hashed by model hook
        role: 'admin'
      },
    });

    if (created) {
      console.log('Admin created successfully:', admin.email);
    } else {
      console.log('Admin already exists:', admin.email);
    }

  } catch (err) {
    console.error('Error setting up admin:', err);
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
