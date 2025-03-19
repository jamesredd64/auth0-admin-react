const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jredd2013:Zeusyboy4ever!!@mern-cluster.oistpfp.mongodb.net/?retryWrites=true&w=majority';

// Define the schemas
const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profile: {
    firstName: String,
    lastName: String,
    phoneNumber: String,
    avatar: String,
    bio: String,
    title: String,
    company: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  marketingBudget: {
    frequency: {
      type: String,
      enum: ['daily', 'monthly', 'quarterly', 'yearly']
    },
    adBudget: Number,
    costPerAcquisition: Number,
    dailySpendingLimit: Number,
    marketingChannels: String,
    monthlyBudget: Number,
    preferredPlatforms: String,
    notificationPreferences: [String],
    roiTarget: Number
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Define indexes
async function createIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }

    // Create User model
    const User = mongoose.model('User', userSchema);

    // Create indexes
    await User.collection.createIndex({ auth0Id: 1 }, { unique: true });
    console.log('Created index on auth0Id');

    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('Created index on email');

    await User.collection.createIndex({ 'profile.firstName': 1, 'profile.lastName': 1 });
    console.log('Created index on name fields');

    await User.collection.createIndex({ createdAt: 1 });
    console.log('Created index on createdAt');

    await User.collection.createIndex({ updatedAt: 1 });
    console.log('Created index on updatedAt');

    console.log('All indexes created successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
createIndexes().catch(console.error);


