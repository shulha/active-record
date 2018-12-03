class Model {

    async load(id) {
        try {
          const relations = this.hasMany;
          if (relations) {
            const result = [];
            for (let i = 0; i < relations.length; i++) {
              const model = relations[i]['model'];
              const primaryKey = relations[i]['primaryKey'];
              const foreignKey = relations[i]['foreignKey'];

              result.push(await db.query(
                  `SELECT *
                   FROM ${this.constructor.table()}, ${model.table()}
                   WHERE ${foreignKey} = ${this.constructor.table()}.${primaryKey}
                   AND ${this.constructor.table()}.${primaryKey} = ${id}`
              ));
            }
            return result;
          } else {
              return (await db.query(`SELECT * FROM ${this.constructor.table()} WHERE ${this.pk} = ${id}`));
          }
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = Model;
