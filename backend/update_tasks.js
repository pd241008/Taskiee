const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const TaskSchema = new mongoose.Schema({
  priority: { type: String, default: 'Medium' }
}, { strict: false });

const Task = mongoose.model('Task', TaskSchema);

async function updateTasks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const result = await Task.updateMany(
      { priority: { $exists: false } },
      { $set: { priority: 'Medium' } }
    );
    
    console.log(`Updated ${result.modifiedCount} tasks.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateTasks();
