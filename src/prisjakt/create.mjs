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
  
  const models = []
  json.forEach(j => {
    const d = data.find(d => d.name === j.name)
    let price = 0
    if (d) {
      price = Math.round(d.price)
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