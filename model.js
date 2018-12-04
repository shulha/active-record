const { getQueryFind,
        getQueryFindWithRelation,
        deleteItem } = require('./sqlQueries');

class Model {

    async find (id = null) {
        try {
            const relations = this.hasMany;
            if (relations) {
                const result = [];
                for (let i = 0; i < relations.length; i++) {
                    const model = relations[i]['model'];
                    const primaryKey = relations[i]['primaryKey'];
                    const foreignKey = relations[i]['foreignKey'];

                    result.push(await db.query(getQueryFindWithRelation({
                        table: this.constructor.table(),
                        model: model.table(),
                        foreignKey,
                        primaryKey,
                        id
                    })));
                }
                return result;
            } else {
                return (await db.query(getQueryFind({
                    table: this.constructor.table(),
                    pk: this.pk,
                    id
                })));
            }
        } catch (err) {
            console.error(err)
        }
    }

    async load(id) {
        return await this.find(id)
    }

    async loadAll() {
        return await this.find()
    }

    async delete(id) {
        if (!Number.isInteger(Number(id))) {
            throw new Error('Invalid id');
        }

        return (await db.query(deleteItem({
            table: this.constructor.table(),
            id
        })));
    }
}

module.exports = Model;
