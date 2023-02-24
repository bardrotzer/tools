import read from './utils/read.mjs'
import write from './utils/write.mjs'
import dotenv from 'dotenv';

const result = dotenv.config()

const out = `${process.env.BASE_PATH}/output/election_timeline.csv`

const countyResults = await read(`${process.env.BASE_PATH}/files/county-ressults.csv`);
const countyLocation = await read(`${process.env.BASE_PATH}/files/county-pos.csv`)
const county_population = await read(`${process.env.BASE_PATH}/files/population.csv`)
const election2020 = await read(`${process.env.BASE_PATH}/files/results_2020.csv`) 
const income_pop = await read(`${process.env.BASE_PATH}/files/county_income_mod.csv`)

console.loh('num pop = ', income_pop.length)

const years = [2008, 2012, 2016]
const missing_2020 = []
const missing_location = []
const missing_results = []

/**
 * This method gets the "others" category by scanning all the other peresident candidates
 */
const otherKeys = ['results_westk','results_kennedya','results_la_rivag','results_carrollb','results_simmonsj','results_boddiep','results_hammonsb','results_hoeflingt','results_hawkinsh ','results_jorgensenj','results_venturaj','results_blankenshipd','results_pierceb','results_de_la_fuenter','results_kingr','results_segalj','results_gammonc','results_myersj','results_paigeh','results_lafontainec','results_duncanr','results_mccormick','results_huberb','results_kopitkek','results_swingg','results_scalfz','results_hunterd','results_none_of_these_candidates','results_tittles','results_charlesm','results_mchughj','results_jacob_fambrop','results_scottj','results_kishorej'];
const getOther2020 = element => {
  let others = 0;
  otherKeys.forEach(k => {
    if (element[k]) {
      others += +element[k];
    }
  })
  return others;
}


const toDecimal = (number, decimals) => {
  const str = String(number)
  return +str.slice(0, str.indexOf('.') + decimals);

}

const newData = []

county_population.forEach(d => {
  let miss = false;
  const padState = d.STATE.padStart(2,'0');
  const padfips = padState + d.COUNTY.padStart(3, '0');
  const fips = Number(d.STATE + d.COUNTY.padStart(3, '0'));
  const f2 = countyResults.find(f => f.fips_code === padfips)
  const locations = countyLocation.find(f => f.Fips === ''+fips)
  const el_2020 = election2020.find(f => f.fips === padfips);

  const retval = {
    fips: padfips,
    state: d.STNAME,
    name: d.CTYNAME,
    pop: Number(d.POPESTIMATE2016),
  }

  if (f2) {
    years.forEach(y => {
      const dem = +f2[`dem_${y}`]
      const rep = +f2[`gop_${y}`]
      const other = +f2[`oth_${y}`]
      const tot = dem + rep + other;
      const dem_p = (dem / tot)*100;
      const rep_p = (rep / tot)*100;
      retval[`dem_${y}`] = toDecimal(dem_p, 3);
      retval[`rep_${y}`] = toDecimal(rep_p, 3)
    })
  } else {
    missing_results.push(d.CTYNAME)
    miss = true;
  }

  if (el_2020) {
    const dem = +el_2020.results_bidenj;
    const rep = +el_2020.results_trumpd;
    const other = getOther2020(el_2020)   
    const tot = dem + rep + other;
    if(dem === 0 || rep === 0) {
      // no data yet, so we give 49/49. none have half
      retval.dem_2020 = 49;
      retval.dem_2020 = 49;
    } else {
      const dem_p = (dem / tot)*100;
      const rep_p = (rep / tot)*100;
      retval.dem_2020 = toDecimal(dem_p, 3)
      retval.rep_2020 = toDecimal(rep_p, 3);
    }
  } else {
    missing_2020.push(d.CTYNAME)
  }

  if(locations) {
    retval.lat = toDecimal(locations.Lat, 5),
    retval.lon = toDecimal(locations.Lon, 5)
  } else {
    missing_location.push(d.CTYNAME)
    miss = true;
  }

  if (!miss) {
    newData.push(retval)
  }

})

// console.log(newData[200], missing_location.length);
const outFileName = `${process.env.BASE_PATH}/output/total_elections.csv`
await write(outFileName, newData)