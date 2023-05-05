import readjson from '../utils/readjson.mjs';
import writejson from '../utils/writejson.mjs';

import axios from 'axios';

const blacklist = ['Fyndiq', 'Billigteknik']

const base_api_url = 'https://api.schibsted.com/prisjakt/partner-search/products/'
const market = 'se'
const CLIENT_ID = '25bc7a461420417985b7a15d796057d9'
const CLIENT_SECRET = 'b89382403B344BAD983527e418e2D553'
// const token = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjlrZi9aakFSWVdOeWxnMUVodE9MVHdrUWVlWT0ifQ.eyJhdWQiOiJodHRwczovL2FwaS5zY2hpYnN0ZWQuY29tL3ByaXNqYWt0L3BhcnRuZXItc2VhcmNoIiwiaXNzIjoiaHR0cHM6Ly9hcGkuc2NoaWJzdGVkLmNvbS9wcmlzamFrdC9iMmItYXV0aCIsInN1YiI6IjI1YmM3YTQ2MTQyMDQxNzk4NWI3YTE1ZDc5NjA1N2Q5IiwiaWF0IjoxNjc2NDY3MTA3LCJleHAiOjE2NzY0Njc3MDd9.Mj0U_K3Gyqf8TY0hdhOd-UK6APKeTG6XQVF0-Jk6B9IjMK-vd1t3hZG0ZKFzRLgjvpLDllZ38MjJFRs7RJ53PWRn5fpONkxOnS2fXkX3wD10ZG0SEWb3m6te1KWcw4jBUTbtq0Uf3yo8vTZEJqN-LjYzdL0H0H6FHojlcVRtdSFa9ntaM3f0mOn8vEy0FgGFKqbElvhs9U9Fcb7qq3s_NKawrRkYVlfsqehPgBvHgIvuUBvia57ZPqA5GOLfJBe20NH6begyxOJp_Ivir3fzrBKaa7y5yldHjtjAwZNxHXogqegJCvW-x3q3A71UlQrGGMmoj_WJzF1uJ8B1DrIsfA'


const createCsvData = (data) => {
  if (data.offers && data.offers.length) {
    console.log(`${data.productId}, ${data.productName}, , , `)
    let mean = data.offers.reduce((acc, curr) => acc + curr.price.value, 0) / data.offers.length
    console.log(`, Shop, Price, Mean ~ (${Math.round(mean)}), Diff from mean (%) `)
    data.offers.forEach(o => {
      console.log(`, ${o.shop.name}, ${o.price.value},, ${Math.round(((mean-o.price.value)/o.price.value)*100)} `)

    })
    console.log(`, , , , `)
  }
}


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
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
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
         'client-id': CLIENT_ID
       }
     }).then(function({status, data}) {
        console.log('data',data)
        console.log('status', status)

        if (data.success) {
          data.data.offers.forEach(d => {
            console.log(d.shop.name)
            console.log(d.price.value)
            console.log(d.alternativePrices)
          })
          console.log('offers', data.data.offers)
        }
       const stat = status === 200 ? 'OK' : 'Error'
      //  const price = getLowestPrice(data.offers)

      // createCsvData(data)
      // resolve(data.offers.length)       
     })
     .catch((error) => {
      console.log('error', error)
      //  const stat = error.response.status === 401 ? 'Missing' : 'Error'
      //  console.log('id: ', pid, stat, error.response.status)
       reject(0)
     })
  })
}

const test = async () => {
  const json = await readjson('./prisjakt-lookup.json')
  const accessToken = await getToken()
  const priceData = []
  // 5338238


  // const errlist = [5187546, 5594641, 5338238, 5594642, 5595710, 5595712, 5595711, 5683804, 5855621, 5855617, 5855648, 5855649, 5855650, 5855644, 5851667, 5855622, 5855618, 5855652, 5855651, 5956327, 5956321, 5956325, 5956320, 5956311, 6922579, 5057278, 5838252]
  // for(let i = 0; i < errlist.length; i += 1) {
  //   const pid = errlist[i]
    
    // await lookupPhone('5172022', accessToken)
    // .then((price) => {
    //   console.log(5172022, price)
    // }).catch(e => {
    //   console.error(5172022, 'err',e)
    // })
  // }

  // await lookupPhone("5594641", accessToken).then((price) => {
  //   console.log(price)
  // }).catch(e => {
  //   console.error(e)
  // })


  // console.log("name", ",prisjakt_price", ",prisjakt_id", ",model")
  const start = 10 // 0
  const end =  12// json.length
  for(let i = start; i < end; i += 1) {


    const pid = json[i].pid
    
    await lookupPhone(pid, accessToken)
    .then((price) => {
      priceData.push({
        name: json[i].name,
        id: json[i].id,
        storage: json[i].storage,
        prisjaktid: json[i].pid,
        price: price
      })
    })
    .catch(e => {
      // console.log('error in', json[i].pid,'----', json[i].name)
      priceData.push({
        name: json[i].name,
        id: json[i].id,
        storage: json[i].storage,
        prisjaktid: json[i].pid,
        price: 0
      })
    })
  }

  // writejson(`./prisjakt-from-api-${market}.json`, JSON.stringify(priceData))
}

const calc = () => {
  
  const nums = [2026,2299,3566,3797,3799,5870]
  let sum = 0
  nums.forEach(n => {
    sum += n
  })
  console.log(sum, (Math.round(sum/6)))
}
// calc()
test()
// getToken()

