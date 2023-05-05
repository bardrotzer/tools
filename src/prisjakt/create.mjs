import read from '../utils/read.mjs'
import readjson from '../utils/readjson.mjs';
import writejson from '../utils/writejson.mjs';

// import write from './utils/write.mjs'
import dotenv from 'dotenv';

const result = dotenv.config()

const DATA_FILE = `./analyticsdata.csv`
const LOOKUP_FILE = './prisjakt-lookup.json'

const output = async () => {
  const data = await read(DATA_FILE)
  const json = await readjson(LOOKUP_FILE)
  const comparejson = await readjson('./prisjakt-pricelist-se-old.json')
  const models = []

  // iterate over all the phone variants defined in the lookup file
  json.forEach(j => {
    // get the corresponding phone in the prisjakt data file
    const prisjaktphone = data.find(d => d.name === j.name)
    let price = 0
    if (prisjaktphone) {
      const compare = comparejson.find(d => d.id === j.id && d.storage === j.storage && d.color === j.color)
      price = Math.round(prisjaktphone.price)
      if (compare && compare.price && price) {
        if (price / compare.price < 0.7) {
          console.log(j.pid, '--', j.name, price, compare.price, 'same:', price / compare.price)
          price = 0
        } else if (price / compare.price > 1.1) {
          console.log(j.pid, '--', j.name, price, compare.price, 'same:', price / compare.price)
        }
      } 
    }
    //
    models.push({
      "id": j.id,
      "color": j.color,
      "storage": j.storage,
      "price": price,
      "pid": j.pid
    })
  })

  writejson('./prisjakt-pricelist-se.json', JSON.stringify(models))
}

output()