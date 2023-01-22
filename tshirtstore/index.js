require('dotenv').config()
const app = require('./app')
const connectWithDb = require('./config/db')


//connect with db
connectWithDb();


app.listen(process.env.PORT, () => {
    console.log(`Server is running  at  ${process.env.PORT}`)
})
