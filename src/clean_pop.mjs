import read from './utils/read.mjs';

const income_pop = await read(`${process.env.BASE_PATH}/files/county_income_mod.csv`)

console.log('num pop = ', income_pop.length)
