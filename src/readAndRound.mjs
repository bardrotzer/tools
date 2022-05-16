import read from './utils/read.mjs'
import write from './utils/write.mjs'
import dotenv from 'dotenv';

const result = dotenv.config()

const INFILE = `${process.env.BASE_PATH}/workfiles/fsi_2022.csv`
const OUTFILE = `${process.env.BASE_PATH}/workfiles/fsi_2022_rounded.csv`

const roundMaxTwo = (num) => +(Math.round(num + "e+2")  + "e-2")

const output = async () => {
  const data = await read(INFILE)
  console.log(process.env.BASE_PATH, data.length)
  const nd = data.map(d => {
    d.KIcat1 = roundMaxTwo(+d.KIcat1)
    d.KIcat2 = roundMaxTwo(+d.KIcat2)
    d.KIcat3 = roundMaxTwo(+d.KIcat3)
    d.KIcat4 = roundMaxTwo(+d.KIcat4)
    d.FSI_Value = roundMaxTwo(+d.FSI_Value)
    d.FSI_Share = roundMaxTwo(+d.FSI_Share)
    d.Global_Scale_Weight = roundMaxTwo(+d.Global_Scale_Weight)
    d.Secrecy_Score = roundMaxTwo(+d.Secrecy_Score)
    return d
  })

  await write(OUTFILE, nd)
}


output()