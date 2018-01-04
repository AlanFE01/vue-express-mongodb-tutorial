const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const http = require('http')
const dbConfig = require('../config/db')
const mongoose = require('mongoose')

const db = mongoose.connect(dbConfig.mongodb)
db.connection.on('error', function (error) {
  console.log('数据库连接失败：' + error)
})
db.connection.on('open', function () {
  console.log('数据库连接成功')
})

const port = process.env.PORT || 3000

const userRoutes = require('./api/routes/user')

// 程序使用的中间件
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({
      msg: 'keyi'
    })
  }
  // 必须调用，不然下面的路由不会走
  next()
})

// 加载路由模块
app.use('/api', userRoutes)

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

app.use((req, res, next) => {
  res.status(200).json({
    message: 'it works'
  })
})

const server = http.createServer(app)

server.listen(port)
