const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverrride = require('method-override')

const server = express()

// middlewares
server.use(express.urlencoded({extended: true}))
server.use(express.static('public')) 
server.use(methodOverrride('_method'))
server.use(routes)  

server.set("view engine", "njk")

nunjucks.configure("views", {
    express: server,
    noCache: true,
    autoescape: false
})


// rotas

// conf. server.js
server.listen(5000, function() {
    console.log('server is running...')
})