const { getQueryFind,
        withRelation,
        deleteItem,
        insertItem,
        updateItem,
        deleteRelation } = require('./sqlQueries');

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
         await db.query(deleteItem({
            table: this.constructor.table(),
            id: this.id,
            pk: this.pk
        }));
    }

    async save() {
        const table = this.constructor.table();
        const id    = this.id;
        const data  = {};

        for (let field of this.fields) {
            if (field !== 'id') {
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
                pk: this.pk,
                id
            }), data);
        }

        if (this.relations) {
            for (let relation of this.relations) {
                const relData = {};
                // await db.query(deleteRelation({
                //     table: item.constructor.table(),
                //     foreignKey: item.constructor.fk,
                //     id: this.id
                // }));
                for (let item of relation) {
                    for (let field of item.fields) {
                        if (field !== 'id') {
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
