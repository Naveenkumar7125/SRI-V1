require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Folder = require('./models/Folder');

const uri = process.env.MONGODB_URI_SRI || 'mongodb+srv://naveenkumart906_db_user:JrY0q4QoPtIhGRfz@nk.wpf1cvv.mongodb.net/SRI?retryWrites=true&w=majority&appName=NK';

async function checkDB() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");
    const count = await Folder.countDocuments();
    console.log("Total Folders in DB:", count);
    
    if (count > 0) {
      const latest = await Folder.find().sort({ createdAt: -1 }).limit(1);
      console.log("Latest Folder:", JSON.stringify(latest, null, 2));
    }
  } catch(e) {
    console.error("Error:", e);
  } finally {
    mongoose.connection.close();
  }
}
checkDB();
