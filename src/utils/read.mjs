import fs from 'fs'
import csv from 'csv-parser'

export default (file, includeHeaders = false) => {
    const results = [];
    let header;
    return new Promise((resolve, reject) => {
      try{
        fs.createReadStream(file)
        .pipe(csv())

          // get the headers
          .on('headers', (d) => {
            header = d;
          })
          // Piped data will trigger once for each row
          //
          .on('data', (d) => {
            results.push(d);
          })
          .on('end', () => {
            if (includeHeaders) {
              resolve({
                rows: results,
                header: header,
              });
            } else {
              resolve(results);
            }
          });

      } catch (e) {
        console.error(e)
      }  
      });
  }