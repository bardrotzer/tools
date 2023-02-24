import fs from 'fs'


export default (file, data) => {
    return new Promise((resolve, reject) => {
      try{
        const d = fs.writeFile(file, data, 'utf8', (err) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            resolve(`${file} is written`)
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