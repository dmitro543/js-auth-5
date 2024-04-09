// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'user@email',
  password: 123,
  role: 1,
})

User.create({
  email: 'admin@email',
  password: 123,
  role: 2,
})

User.create({
  email: 'developer@email',
  password: 123,
  role: 3,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/sign-up', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('sign-up', {
    // вказуємо назву контейнера
    name: 'sign-up',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password', 'field-checkbox', 'field-select'],

    // вказуємо назву сторінки
    title: 'Sign-up',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'Користувач' },
        {
            value: User.USER_ROLE.ADMIN,
            text: 'Адміністратор'
        },
        {
            value: User.USER_ROLE.DEVELOPER,
            text: 'Розробник'
        }
      ]
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/sign-up', function (req, res) {
  const { email, password, role } = req.body

  console.log(req.body)

  if(!email || !password || !role) {
    return res.status(400).json({
      message: "Помилка. обов'язкові поля відсутні",
    })
  }

  try {
     User.create({ email, password, role })

     return res.status(200).json({
       message: "Користувач успішно створений",
     })
   }  catch(err) {
     return res.status(400).json({
       message: err.message,
     })
   }
})

router.get('/logout', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('logout', {
    // вказуємо назву контейнера
    name: 'logout',

    // вказуємо назву сторінки
    title: 'logout',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/home', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('home', {
    // вказуємо назву контейнера
    name: 'home',

    // вказуємо назву сторінки
    title: 'Home page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// router.post('/sign-up', function (req, res) {
//    const { email, password, role } = req.body

//    console.log(req.body)

//    if(!email || !password || !role) {
//      return res.status(400).json({
//        message: "Помилка. обов'язкові поля відсутні",
//      })
//    }

//    try {
//       const user = User.getByEmail(email);

//       if(user) {
//         return res.status(400).json({
//           message: "Помилка такий користувач вже існує існує"
//         })
//       }

//       const newUser = User.create({ email, password, role })

//       const session = Session.create(newUser)

//       Confirm.create(newUser.email)
//       User.create({ email, password, role })

//       return res.status(200).json({
//         message: "Користувач успішно створений",
//         // session,
//       })
//     }  catch(err) {
//       return res.status(400).json({
//         message: err.message,
//       })
//     }
// })

router.get('/recovery', function (req, res) {

  return res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'recovery',
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/sign-up-confirm', function (req, res) {
  const { renew, email } = req.body

  if(renew) {
    Confirm.create(email)
  }

   return res.render('sign-up-confirm', {
    // вказуємо назву контейнера
    name: 'sign-up-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'sign-up-confirm',
    data: {  },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/sign-up-confirm', function (req, res) {
  const { code, token } = req.body

  if(!code || !token) {
    return res.status(400).json({
      message: "Помилка обов'язкові поля відсутні"
    })
  }

  try {
     const session = Session.get(token)

     if(!session) {
      return res.status(400).json({
        message: 'Помилка ви не увійшли в аккаунт'
      })
     }

     const email = Confirm.getData(code)

     if(!email) {
      return res.status(400).json({
        message: 'Код не існує'
      })
     }

     if(email !== session.user.email) {
      return res.status(400).json({
        message: 'Код не дійсний'
      })
     }

     session.user.isConfirm = true

    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session,
    })
  }
  catch(err) {
    return res.status(400).json({
      message: err.message
    })
  }

  console.log(code, token)
})

router.post('/recovery', function (req, res) {
  const {email} = req.body

  console.log(email)

  if(!email) {
    return res.status(400).json({
      message: "Помилка обов'язкові поля відсутні"
    })
  }

  const user = User.getByEmail(email);

  try {
      const user = User.getByEmail(email);

      if(!user) {
        return res.status(400).json({
          message: "Користувач з таким email не існує"
        })
      }
     
    Confirm.create(email)
    return res.status(200).json({
      message: "Код для відновлення паролю відправлено"
    })
  }
  catch (err) {
    return res.status(400).json({
      message: err.message
    })
  }
}) 

router.get('/recovery-confirm', function (req, res) {

  return res.render('recovery-confirm', {
    // вказуємо назву контейнера
    name: 'recovery-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'recovery-confirm',
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  if(!code || !password) {
    return res.status(400).json({
      message: "Помилка. обов'язкові поля відсутні"
    })
  }


  try{
    const email = Confirm.getData(Number(code))

    if(!email) {
      return res.status(400).json({
        message: "Код не існує"
      })
    }

    const user = User.getByEmail(email)

    if(!user) {
      return res.status(400).json({
        message: "Користувач з таким email не існує"
      })
    }

    user.password = password;

    console.log(user)

    const session = Session.create(user);

    return res.status(200).json({
      message: "Пароль змінено",
      session,
    })
  }
  catch(err) {
    return res.status(400).json({
      message: err.message
    })
  }
})

router.get('/login', function (req, res) {

  return res.render('login', {
    // вказуємо назву контейнера
    name: 'login',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'login page',
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/login', function (req, res) {
  const { email, password } = req.body

  if(!email || !password) {
    return res.status(400).json({
      message: "Помилка. обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if(!user) {
      return res.status(400).json({
        message: "Помилка. Користувач з таким email не існує",
      })
    }

    if(user.password !== password) {
      return res.status(400).json({
        message: "Помилка. Пароль не підходить",
      })
    }

     const session = Session.create(user)

    return res.status(200).json({
      message: "Ви увійшли",
      session,
    })
  }
  catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router