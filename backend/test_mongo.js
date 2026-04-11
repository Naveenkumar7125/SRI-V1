require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI_SRI || 'mongodb+srv://naveenkumart906_db_user:JrY0q4QoPtIhGRfz@nk.wpf1cvv.mongodb.net/SRI?retryWrites=true&w=majority&appName=NK';

async function testConnection() {
  console.log("Attempting to connect to:", uri);
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log("✅ Successfully connected to MongoDB Atlas!");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
  } catch (err) {
    console.error("❌ Connection failed!");
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}
testConnection();
