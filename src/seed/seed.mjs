import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import dbConnect from '../lib/dbConnect.js';
import ProductModel from '../models/productmodel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to read and parse JSON
const readJSON = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

const tvs = readJSON('tvs.json');
const watches = readJSON('watches.json');
const facewash = readJSON('facewash.json');
const games = readJSON('games.json');
const headphones = readJSON('headphones.json');
const laptops = readJSON('laptops.json');
const makeup = readJSON('makeup.json');
const shoes = readJSON('shoes.json');
const smartphones = readJSON('smartphones.json');

async function seedDatabase() {
  try {
    await dbConnect();
    console.log('connected to the database');
    await ProductModel.deleteMany({});
    console.log('All the previous data is removed');

    const allProducts = [
      ...tvs,
      ...watches,
      ...facewash,
      ...games,
      ...headphones,
      ...laptops,
      ...makeup,
      ...shoes,
      ...smartphones,
    ];

    await ProductModel.insertMany(allProducts);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
}

seedDatabase();