import readjson from '../utils/readjson.mjs';
import writejson from '../utils/writejson.mjs';

import axios from 'axios';

const blacklist = ['Fyndiq', 'Billigteknik']

const base_api_url = 'https://api.schibsted.com/prisjakt/partner-search/products/'
const market = 'se'
const clientId = '25bc7a461420417985b7a15d796057d9'
// const token = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjlrZi9aakFSWVdOeWxnMUVodE9MVHdrUWVlWT0ifQ.eyJhdWQiOiJodHRwczovL2FwaS5zY2hpYnN0ZWQuY29tL3ByaXNqYWt0L3BhcnRuZXItc2VhcmNoIiwiaXNzIjoiaHR0cHM6Ly9hcGkuc2NoaWJzdGVkLmNvbS9wcmlzamFrdC9iMmItYXV0aCIsInN1YiI6IjI1YmM3YTQ2MTQyMDQxNzk4NWI3YTE1ZDc5NjA1N2Q5IiwiaWF0IjoxNjc2NDY3MTA3LCJleHAiOjE2NzY0Njc3MDd9.Mj0U_K3Gyqf8TY0hdhOd-UK6APKeTG6XQVF0-Jk6B9IjMK-vd1t3hZG0ZKFzRLgjvpLDllZ38MjJFRs7RJ53PWRn5fpONkxOnS2fXkX3wD10ZG0SEWb3m6te1KWcw4jBUTbtq0Uf3yo8vTZEJqN-LjYzdL0H0H6FHojlcVRtdSFa9ntaM3f0mOn8vEy0FgGFKqbElvhs9U9Fcb7qq3s_NKawrRkYVlfsqehPgBvHgIvuUBvia57ZPqA5GOLfJBe20NH6begyxOJp_Ivir3fzrBKaa7y5yldHjtjAwZNxHXogqegJCvW-x3q3A71UlQrGGMmoj_WJzF1uJ8B1DrIsfA'

/**
 * returns the lowest price after cleaning up the suppliers that are providing used phones
 * @param {Object} data 
 */
const getLowestPrice = (data) => {
  if (!data || !data.length) {
    return 0
  }
  let price = 1000000000
   data.forEach(d => {
    if(!blacklist.includes(d?.shop?.name)) { // && d?.price?.currency === 'NOK'
      price = Math.min(price, d.price.value)
    }
  })
  // console.log(data)
  // console.log('final', price)
  return price
}


const getToken = async() => {
  const postUrl = 'https://api.schibsted.com/prisjakt/partner-search/token'
  const { data } = await axios.post(postUrl, {
      'grant_type': 'client_credentials',
      'client_id': '25bc7a461420417985b7a15d796057d9',
      'client_secret': 'b89382403B344BAD983527e418e2D553'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
  })
  console.log(data)
  return data.access_token
  }


const lookupPhone = (pid, accessToken) => {

  const url = `${base_api_url}${pid}?market=${market}`
  return new Promise( (resolve, reject) => {

    axios.get(url, {
       headers: {
         'Authorization': `Bearer ${accessToken}`,
         'client-id': clientId
       }
     }).then(function({status, data}) {
        console.log(data)
       console.log(data.offers)
       const stat = status === 200 ? 'OK' : 'Error'
       const price = getLowestPrice(data.offers)
        resolve(price)       
     })
     .catch(function (error) {
       const stat = error.response.status === 401 ? 'Missing' : 'Error'
       console.log('id: ', pid, stat, error.response.status)
       reject(0)
     })
  })
}

const test = async () => {
  const json = await readjson('./prisjakt-nybrukt.json')
  const keys = Object.keys(json)
  const accessToken = await getToken()
  const priceData = []


  await lookupPhone("5183925", accessToken).then((price) => {
    console.log(price)
  }).catch(e => {
    console.error(e)
  })


  // console.log("name", ",prisjakt_price", ",prisjakt_id", ",model")

  // const numLoops = keys.length
  // for(let i = 0; i < numLoops; i += 1) {
  // const start = 21
  // const numLoops = start + 1
  // for(let i = start; i < numLoops; i += 1) {
  //   const pid = json[keys[i]].pid
    
  //   await lookupPhone(pid).then((price) => {
  //     priceData.push({
  //       name: data.productName,
  //       id: json[keys[i]].id,
  //       storage: json[keys[i]].storage,
  //       prisjaktid: json[keys[i]].pid,
  //       price: price
  //     })
  //   })
  // }

  // writejson(`./prisjakt-from-api-${market}.json`, JSON.stringify(priceData))
}

test()
// getToken()

