const { getQueryFind,
        getQueryFindWithRelation} = require('./sqlQueries');

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
                        model,
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
}

module.exports = Model;
