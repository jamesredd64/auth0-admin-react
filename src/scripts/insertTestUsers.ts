import { connectDB, disconnectDB, UserModel } from '../services/mongodb';
import dbConfig from '../config/dbconfig';

const testUsers = [
  {
    firstName: 'James',
    lastName: 'Redd',
    email: 'jameshredd@outlook.com',
    phoneNumber: '555-012-1515',
    profile: {
      dateOfBirth: new Date('1964-02-02'),
      gender: 'Male',
      profilePictureUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      marketingBudget: {
        amount: 15000,
        frequency: 'monthly',
        adCosts: 7500
      }
    },
    address: {
      street: '123 Tech Lane',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA'
    },
    isActive: true
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@test.com',
    phoneNumber: '555-0456',
    profile: {
      dateOfBirth: new Date('1988-06-22'),
      gender: 'Female',
      profilePictureUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      marketingBudget: {
        amount: 10000,
        frequency: 'quarterly',
        adCosts: 5000
      }
    },
    address: {
      street: '456 Marketing Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    isActive: true
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@test.com',
    phoneNumber: '555-0789',
    profile: {
      dateOfBirth: new Date('1992-03-30'),
      gender: 'Male',
      profilePictureUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
      marketingBudget: {
        amount: 20000,
        frequency: 'monthly',
        adCosts: 12000
      }
    },
    address: {
      street: '789 Innovation Blvd',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    isActive: true
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@test.com',
    phoneNumber: '555-0321',
    profile: {
      dateOfBirth: new Date('1995-11-15'),
      gender: 'Female',
      profilePictureUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
      marketingBudget: {
        amount: 8000,
        frequency: 'monthly',
        adCosts: 4000
      }
    },
    address: {
      street: '321 Digital Drive',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    isActive: true
  },
  {
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@test.com',
    phoneNumber: '555-0654',
    profile: {
      dateOfBirth: new Date('1987-08-08'),
      gender: 'Male',
      profilePictureUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
      marketingBudget: {
        amount: 12000,
        frequency: 'quarterly',
        adCosts: 6000
      }
    },
    address: {
      street: '654 Growth Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    isActive: true
  }
];

async function insertTestUsers() {
  try {
    // Connect to MongoDB using the configuration
    await connectDB();
    console.log(`Connected to MongoDB database: ${dbConfig.dbName}`);

    // Clear existing test users
    await UserModel.deleteMany({
      email: { $in: testUsers.map(user => user.email) }
    });
    console.log('Cleared existing test users');

    // Insert new test users
    const result = await UserModel.insertMany(testUsers);
    console.log('Successfully inserted test users:');
    console.log(JSON.stringify(result, null, 2));

    // Disconnect from MongoDB
    await disconnectDB();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error inserting test users:', error);
    process.exit(1);
  }
}

// Run the script
insertTestUsers();