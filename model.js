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
            classObject.fields.map(field => {
                classObject[field] = item[field];
            });
            if (relations) {
                await this.addRelations(relations, item, classObject);
            }

            arrayResult.push(classObject);
        }

        return arrayResult;
    }

    static async addRelations(relations, item, classObject) {
        let relArr = [];
        for (let i = 0; i < relations.length; i++) {
            const model = relations[i]['model'];
            const tableName = model.table();
            const foreignKey = relations[i]['foreignKey'];

            const cars = await db.query(withRelation({
                table: tableName,
                foreignKey,
                id: item.id
            }));
            const carResults = [];

            for (let car of cars) {
                const relObject = new model;
                relObject.fields.map(field => {
                    relObject[field] = car[field];
                });

                carResults.push(relObject);
            }
            relArr[tableName] = carResults;
        }
        classObject.relations = relArr;
    }

    static async load(id)
    {
        if (id && Number.isInteger(Number(id))) {
            return (await this.find(id)).shift()
        }

        throw new Error('Invalid id');
    }

    static async loadAll()
    {
        return await this.find()
    }

    async delete()
    {
         await db.query(deleteItem({
            table: this.constructor.table(),
            id: this.id,
            pk: this.constructor.pk
        }));
    }

    async save() {
        const table = this.constructor.table();
        const id    = this.id;
        const data  = {};

        for (let field of this.fields) {
            if (field !== this.constructor.pk) {
                data[field] = this[field];
            }
        }

        let resultUser, resultCar = [];

        if (!id) {
            resultUser = (await db.query(insertItem({table}), data));
            this.id = resultUser.insertId;
        } else {
            resultUser = await db.query(updateItem({
                table,
                pk: this.constructor.pk,
                id
            }), data);
        }

        if (this.relations) {
            for (let relation of this.relations) {
                const relData = {};
                for (let item of relation) {
                    for (let field of item.fields) {
                        if (field !== item.pk) {
                            relData[field] = item[field];
                        }
                        relData.user_id = this.id;
                    }

                    resultCar.push(await db.query(insertItem({
                        table: item.constructor.table()
                    }), relData))
                }
            }
        }
      return [resultUser, resultCar];
    }
}

module.exports = Model;
