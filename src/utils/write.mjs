import csvWriter from 'csv-writer';

export default async (file, data, header) => {

  header = header || Object.keys(data[0]).map(d => {
    return {
      id: d,
      title: d,
    };
  });
  try {

    console.log(csvWriter)

    await csvWriter.createObjectCsvWriter({
      path: file,
      header: header
    }).writeRecords(data); 


  } catch (e) {
    console.error(file, e)
  }
}