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
      const user = new User();
      const user1 = await user.load(2);
      // console.log(user1);

      const car = new Car();
      const car1 = await car.load(2);
      // console.log(car1);

      const users = await user.loadAll();
      // console.log(users);

      // const deletingResult = await user.delete(2);
      // console.log(deletingResult);

  } catch (err) {
      console.error(err)
  }
})();

// Открыть с БД и вывести в консоль сузествующего пользователя с машинами

// Создать нового пользователя

// Изменить имя пользователю

// Удалить пользователя

// Добавить пользователю новую машину
