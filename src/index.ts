import express from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import helmet from "helmet"

dotevnv.config()

import dataRouter from './routes/data.router'

const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))


app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(helmet())


app.use('/api/v1/personal-data', dataRouter);

// app.get('/', (req, res) => {  
//   res.send('Hello, TypeScript with Express!' + isAdult({name:'erick', age:18}));
// })
