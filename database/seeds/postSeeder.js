const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./../../models/Post');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// Read JSON File
const posts = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', 'factories', 'postFactory.json'),
    'utf-8'
  )
);

// Import to DB
const importData = async () => {
  try {
    await Post.create(posts);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

// Delete All Data from Collection
const deleteData = async () => {
  try {
    await Post.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
