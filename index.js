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
      // const user = new User();
      // const user1 = await user.load(2);
      // // console.log(user1);
      //
      // const car = new Car();
      // const car1 = await car.load(2);
      // // console.log(car1);
      //
      // const users = await user.loadAll();
      // // console.log(users);
      //
      // // const deletingResult = await user.delete(2);
      // // console.log(deletingResult);

      const car1 = new Car();
      car1.model = 'first';
      car1.year  = 2012;

      const car2 = new Car();
      car2.model = 'second';
      car2.year  = 3030;

      const newUser = new User();
      // newUser.id         = 2;
      newUser.first_name = 'lolo';
      newUser.last_name  = 'LALALA';
      newUser.age        = 22;
      newUser.gender     = 'M';
      newUser.cars       = [
        car1,
        car2
      ];

      const result = await newUser.save();
      console.log(result);

  } catch (err) {
      console.error(err)
  }
})();

// Открыть с БД и вывести в консоль сузествующего пользователя с машинами

// Создать нового пользователя

// Изменить имя пользователю

// Удалить пользователя

// Добавить пользователю новую машину
