import express from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import cron from "node-cron"
const { sequelize } = require('./utils/database')

dotevnv.config()

import dataRouter from './routes/data.router'
import clientsRouter from './routes/clients.router'
import { log } from "./utils/utils"
import { checkUUID } from "./utils/tasks"

const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))


app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(helmet())


app.use('/api/v1/data', dataRouter)
app.use('/api/v1/clients', clientsRouter)

app.get('/', (req, res) => res.send(`Hello, API-NUFI is working! Port: ${port}`))

// checkUUID()
// checks every 5 minutes for nss and history update
// cron.schedule('*/5 * * * *', () => checkUUID())

sequelize.authenticate()
    .then(() => log('Connection has been established successfully'))
    .catch((err:Error) => log(`Unable to connect to the database: ${err}`))