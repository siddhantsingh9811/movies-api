const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler');
const morgan = require('morgan')
const checkDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const contentRoutes = require('./routes/contentRoutes')

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)

// database connection
checkDB()

// error handling
app.use(errorHandler)

module.exports = app