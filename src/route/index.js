// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

// Підключіть файли роутів
const test = require('./test')
// Підключіть інші файли роутів, якщо є
const auth = require('./auth')
const user = require('./user')

// Об'єднайте файли роутів за потреби
router.use('/', test)

router.use('/', auth)
router.use('/', user)
// Використовуйте інші файли роутів, якщо є

// Експортуємо глобальний роутер
module.exports = router
