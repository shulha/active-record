const { getQueryFind,
        withRelation,
        deleteItem,
        insertItem,
        updateItem } = require('./sqlQueries');

class Model {

    static async find (id = null)
    {
        const arrayResult = [];

        const queryResult = await db.query(getQueryFind({
            table: this.table(),
            pk: this.pk,
            id
        }));

        const relations = this.hasMany;
        for (let item of queryResult) {
            let classObject = new this;
            for (let field of classObject.fields) {
                classObject[field] = item[field];
            }
            if (relations) {
                let relArr = [];
                for (let i = 0; i < relations.length; i++) {
                    const tableName = (relations[i]['model']).table();
                    const foreignKey = relations[i]['foreignKey'];

                    const cars = await db.query(withRelation({
                                    table: tableName,
                                    foreignKey,
                                    id: item.id
                                }));
                    relArr[tableName] = JSON.parse(JSON.stringify(cars));
                }
                classObject.relations = relArr;
            }

            arrayResult.push(classObject);
        }

        return arrayResult;
    }

    static async load(id)
    {
        return (await this.find(id)).shift()
    }

    static async loadAll()
    {
        return await this.find()
    }

    async delete()
    {
        return (await db.query(deleteItem({
            table: this.constructor.table(),
            id: this.id,
            pk: this.pk
        })));
    }

    async save() {
        const table      = this.constructor.table();
        const id         = this.id;
        const first_name = this.first_name;
        const last_name  = this.last_name;
        const age        = this.age;
        const gender     = this.gender;
        const cars       = this.cars;
        let user_id,
            resultUser,
            resultCar = [];

        if (!id) {
            if (first_name && last_name && age && gender) {
                const data = {
                  first_name,
                  last_name,
                  age,
                  gender
                };
                resultUser = await db.query(insertItem({table}), data);
                user_id = resultUser.insertId;
            } else
                throw new Error('Empty column');
        } else {
            user_id = id;
            let setString = '';
            const data = [];
            if (first_name) {
              setString += 'first_name = ?, ';
              data.push(first_name);
            }
            if (last_name) {
              setString += 'last_name = ?, ';
              data.push(last_name);
            }
            if (age) {
              setString += 'age = ?, ';
              data.push(age);
            }
            if (gender) {
              setString += 'gender = ?, ';
              data.push(gender);
            }
            data.push(id);
            setString = setString.slice(0, -2);

            resultUser = await db.query(updateItem({table, setString}), data);
        }

        if (cars) {
            for (let car of cars) {
                const table = car.constructor.table();
                const model = car.model;
                const year  = car.year;
                if (user_id && model && year) {
                    const data = {
                      user_id,
                      model,
                      year
                    };
                    resultCar.push(await db.query(insertItem({table}), data));
                } else
                    throw new Error('Empty column');
            }
        }
      return [resultUser, resultCar];
    }
}

module.exports = Model;
