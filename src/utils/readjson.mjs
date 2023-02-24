import fs from 'fs'


export default (file) => {
    const results = [];
    let header;
    return new Promise((resolve, reject) => {
      try{
        const d = fs.readFile(file, 'utf8', (err, data) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            resolve(JSON.parse(data))
          }
        })
        // .pipe(csv())

        //   // get the headers
        //   .on('headers', (d) => {
        //     header = d;
        //   })
        //   // Piped data will trigger once for each row
        //   //
        //   .on('data', (d) => {
        //     results.push(d);
        //   })
        //   .on('end', () => {
        //     if (includeHeaders) {
        //       resolve({
        //         rows: results,
        //         header: header,
        //       });
        //     } else {
        //       resolve(results);
        //     }
        //   });

      } catch (e) {
        console.error(e)
      }  
      });
  }