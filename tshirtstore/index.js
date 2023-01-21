require('dotenv').config()
const app = require('./app')


app.listen(process.env.PORT, () => {
    console.log(`Server is running  at  ${process.env.PORT}`)
})
