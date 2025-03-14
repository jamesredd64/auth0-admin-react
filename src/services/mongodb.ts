import mongoose from 'mongoose';
import dbConfig from '../config/dbconfig';

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  phoneNumber: String,
  passwordHash: String,
  profile: {
    dateOfBirth: Date,
    gender: String,
    profilePictureUrl: String,
    marketingBudget: {
      amount: Number,
      frequency: {
        type: String,
        enum: ['daily', 'monthly', 'quarterly', 'yearly']
      },
      adCosts: Number
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Use a direct collection name
export const UserModel = mongoose.model('users', userSchema);

// Database connection using simplified config
const connectDB = async () => {
  try {
    if (!dbConfig.uri) {
      throw new Error('MongoDB URI is not defined in configuration');
    }

    await mongoose.connect(dbConfig.uri, {
      dbName: dbConfig.dbName,
      w: 'majority'
    });
    console.log(`MongoDB connected successfully to ${dbConfig.dbName}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Disconnect from database
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
};

export { connectDB, disconnectDB };
