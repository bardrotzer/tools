import read from './utils/read.mjs'
import write from './utils/write.mjs'
import dotenv from 'dotenv';

const result = dotenv.config()

const county_location_file = `${process.env.BASE_PATH}/files/county-pos.csv`
const county_election_results_file = `${process.env.BASE_PATH}/files/county-ressults.csv`
const county_population_file = `${process.env.BASE_PATH}/files/population.csv`

const out = `${process.env.BASE_PATH}/output/election.csv`

const county_location_ = await read(county_location_file)
const county_election_results = await read(county_election_results_file)
const county_population = await read(county_population_file)

const missing = [];
const pop = [];

county_population.forEach(d => {
  let miss = false;
  const padState = d.STATE.padStart(2,'0');
  const padfips = padState + d.COUNTY.padStart(3, '0');
  const fips = d.STATE + d.COUNTY.padStart(3, '0');
  const f2 = county_election_results.find(f => f.fips_code === padfips)
  const f1 = county_location_.find(f => f.Fips === fips)
  const retval = {
    fips: padfips,
    state: d.STNAME,
    name: d.CTYNAME,
    pop: Number(d.POPESTIMATE2016),
  }

  if (f2) {
    const dem = +f2.dem_2016
    const rep = +f2.gop_2016
    const other = +f2.oth_2016
    const tot = dem + rep + other;
    const dem_p = (dem / tot)*100;
    const rep_p = (rep / tot)*100;
    retval.dem = dem_p;
    retval.rep = rep_p;
  } else {
    missing.push(d.CTYNAME)
    miss = true;
  }

  if(f1) {
    retval.lat = Number(f1.Lat),
    retval.lon = Number(f1.Lon)
  } else {
    missing.push(d.CTYNAME)
     miss = true;
  }

  if (!miss) {
    pop.push(retval);
  }
})
const outFileName = `${process.env.BASE_PATH}/output/county_elections.csv`
await write(outFileName, pop)


//console.log(pop[0])
console.log(missing)