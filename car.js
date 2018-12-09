const Model = require('./model');

class Car extends Model {
  static table() {
    return 'cars';
  }

  constructor() {
    super();

    this.fields = ['id', 'user_id', 'model', 'year'];

  }
}

Car.pk ='id' ;
Car.fk ='user_id' ;

module.exports = Car;
