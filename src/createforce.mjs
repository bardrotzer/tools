import read from './utils/read.mjs'
import write from './utils/write.mjs'
import dotenv from 'dotenv';
import geo from 'd3-geo';
import d3f from 'd3-force'
import d3s from 'd3-scale';
import d3a from 'd3-array';

const result = dotenv.config()

// apply the simulation
// calling a force simulation and iterate over it till we get the perfect steady state
const applySimulation = nodes => {
  const collide = d3f
    .forceCollide()
    .radius(d => d.r + 0.5)
    .iterations(2);

  const simulation = d3f
    .forceSimulation(nodes)
    .force('collide', collide)
    .force("x", d3f.forceX().strength(0.002))
    .force("y", d3f.forceY().strength(0.002));

  while (simulation.alpha() > 0.01) {
    simulation.tick();
  }
  return simulation.nodes();
}
// size (maybe this could be an endpoint taking x and y and creating a csv if it has not been made earlier)
const chartWidth = 600
const chartHeight = 400
// projection used in the map
const projection = geo.geoAlbersUsa()
      .scale(chartWidth)
      .translate([chartWidth / 2, chartHeight / 2])


// read in the electiondata
const elections = await read(`${process.env.BASE_PATH}/output/total_elections.csv`)

// bensure pop is present for getting the min and max
const pop = elections.map(e => {
  return +e.pop
});
const min = d3a.min(pop);
const max = d3a.max(pop);
// create the radius scale
const scale = d3s
  .scalePow()
  .domain([min, max])
  .range([1, 30]);

  // create the base nodes to apply the force to
const nodes = elections.map(d => {
  const pos = projection([d.lon, d.lat]);
  return {
    fips: String(d.fips).padStart(5, '0'),
    r: scale(+d.pop),
    pop: +d.pop,
    x: pos[0],
    y: pos[1],
    xInitial: pos[0],
    yInitial: pos[1],
    dem_2008: d.dem_2008,
    rep_2008: d.rep_2008,
    dem_2012: d.dem_2012,
    rep_2012: d.rep_2012,
    dem_2016: d.dem_2016,
    rep_2016: d.rep_2016,
    dem_2020: d.dem_2020,
    rep_2020: d.rep_2020
  };
})

// apply force
const values = applySimulation(nodes)
console.log(values[30])
const refactored = values.map(d => {
  d.r = String(d.r).slice(0,5)
  d.xInitial = String(d.xInitial).slice(0,5)
  d.yInitial = String(d.yInitial).slice(0,5)
  d.x = String(d.x).slice(0,5)
  d.y = String(d.y).slice(0,5)
  d.vx = String(d.vx).slice(0,6)
  d.vy = String(d.vy).slice(0,6)
  return d;
})
console.log(refactored[30])
// write new values to a csv file
await write(`${process.env.BASE_PATH}/output/county_election_nodes.csv`, values);

