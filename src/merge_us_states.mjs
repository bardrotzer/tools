import topojson from 'topojson-client'
import fs from 'fs'

import dotenv from 'dotenv';
const result = dotenv.config()

const statesToMerge = [
  9, 10, 12, 13, 17, 18, 19, 21, 23, 24,
 25, 26, 29, 31, 33, 34, 36, 37, 39, 42,
 44, 45, 47, 50, 51, 54, 55
];

fs.readFile(`${process.env.BASE_PATH}/files/states-10m.json`, (err, data) => {
  if (err) {
    throw new Error(err)
  }
  const us = JSON.parse(data);
  console.log(us.objects.states)
  const merged = topojson.merge(us, us.objects.states.geometries.filter((d) => statesToMerge.includes(d.id)))
  console.log(merged)
})

