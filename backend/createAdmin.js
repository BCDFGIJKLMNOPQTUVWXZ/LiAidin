import { connectDB, database } from './db/db.js';

const User = database.User;

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'shreya@example.com' } });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      return;
    }

    // Just pass plain password; model hook will hash it
    const admin = await User.create({
      name: 'Shreya Singh',
      email: 'shreya@example.com',
      password: 'AdminStrongPassword123', // plain text
      role: 'admin'
    });

    console.log('Admin created successfully:', admin.email);
    process.exit(0); // exit script
  } catch (err) {
    console.error('Failed to create admin:', err);
    process.exit(1);
  }
};

createAdmin();
