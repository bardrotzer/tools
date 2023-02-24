import read from './utils/read.mjs';
import dotenv from 'dotenv';

const result = dotenv.config();

console.log('starting')
const notFound = []
const nameCsv = await read(`${process.env.BASE_PATH}/files/income.csv`);
const fipsCsv = await read(`${process.env.BASE_PATH}/files/county-pos.csv`);

nameCsv.forEach(name => {
  const filtered = fipsCsv.find(d => String(d.County).toLowerCase() === String(name.name).toLowerCase());
  if (!filtered) {
    notFound.push(name.name);
  }
})
console.log('num items = ',nameCsv.length);
console.log(notFound)