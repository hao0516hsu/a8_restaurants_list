// 載入Express
const express = require('express')
// 載入Express-habdlebars
const exphbs = require('express-handlebars')
// 載入Body-parser
const bodyParser = require('body-parser')
// 載入Method-override
const methodOverride = require('method-override')
// 載入Express-session
const session = require('express-session')
// 載入Connect-flash
const flash = require('connect-flash')
// dotenv設定
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT
// 引入router
const routes = require('./routes/index')
// 引入Passport
const usePassport = require('./config/passport')
// 引入Mongoose
require('./config/mongoose')
// 引入Handlebars的自定義Helper
require("./public/javascripts/sort-method")

// handlebars設定 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 設定靜態檔案路徑
app.use(express.static('public'))
// bodyParser設定
app.use(bodyParser.urlencoded({ extended: true }))
// method-override設定
app.use(methodOverride('_method'))
// Session設定 (要放在passport和routes之前)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
// Passport設定
usePassport(app)
// flash設定
app.use(flash())
// Middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
// route設定
app.use(routes)

// 設定啟動伺服器相關
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})