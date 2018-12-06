require('dotenv').config();
const mysql = require('mysql');
const util = require('util');
const User = require('./user');
const Car = require('./car');

global.db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

global.db.query = util.promisify(global.db.query);

db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + db.threadId);
});

(async function() {
  try {
// Открыть с БД и вывести в консоль существующего пользователя с машинами
      const user2 = await User.load(2);
      console.log(user2);
      console.log( user2 instanceof User );

      const users = await User.loadAll();
      console.log(users);

      // const car1 = await Car.load(1);
      // console.log(car1);
      //
      // const cars = await Car.loadAll();
      // console.log(cars);



  } catch (err) {
      console.error(err)
  }
})();


// Создать нового пользователя

// Изменить имя пользователю

// Удалить пользователя

// Добавить пользователю новую машину
