const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

// Login Page
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
)

// Register Page
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('此信箱已被註冊！')
        res.render('register', { name, email, password, confirmPassword })
      } else {
        return User.create({ name, email, password })
          .then(() => res.redirect('/users/login'))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
})

// Logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router