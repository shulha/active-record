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
//       const user2 = await User.load(2);
//       console.log(user2);
//       console.log( user2 instanceof User );

//       const users = await User.loadAll();
//       console.log(users);

      // const car1 = await Car.load(1);
      // console.log(car1);
      //
      // const cars = await Car.loadAll();
      // console.log(cars);

// Удалить пользователя
//       const user3 = await User.load(3);
//       const deletingResult = await user3.delete();
//       console.log(deletingResult);

      const car1 = new Car();
      car1.model = 'first';
      car1.year  = 2012;

      const car2 = new Car();
      car2.model = 'second';
      car2.year  = 3030;

    // const car = new Car();
    // car.model = 'bmw';
    // car.year  = 2300;
    // car.user_id = 1;
    // const result = await car.save();

      const newUser = new User();
      // newUser.id         = 32;
      newUser.first_name = 'lolo';
      newUser.last_name  = 'BROS';
      newUser.age        = 300;
      newUser.gender     = 'M';
      newUser.relations  = [
          cars = [ car1, car2 ]
      ];

      const result = await newUser.save();
      console.log(result);
      // newUser.age = 30;
      // newUser.relations  = [
      //     cars = [ car2 ]
      // ];
      // const newResult = await newUser.save();
      // console.log(newResult);

  } catch (err) {
      console.error(err)
  }
})();


// Создать нового пользователя

// Изменить имя пользователю

// Добавить пользователю новую машину
