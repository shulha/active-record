const queries = {
    findById :             `SELECT * 
                            FROM {table} 
                            WHERE {pk} = {id}`,

    findAllWithRelation :  `SELECT *
                            FROM {table}, {model}
                            WHERE {foreignKey} = {table}.{primaryKey}`,

    findAll :              `SELECT * 
                            FROM {table}`,

    delete :               `DELETE 
                            FROM {table}
                            WHERE id = {id}`, //todo в запросах захардкожен первичный ключ полем id

    insert :               `INSERT INTO {table} SET ?`,

    update :               `UPDATE {table} 
                            SET {setString} 
                            WHERE id = ?`, //todo в запросах захардкожен первичный ключ полем id

    relation :             `SELECT *
                            FROM {table}
                            WHERE {foreignKey} = {id}`
};

function withRelation({table, foreignKey, id}) {
    return queries['relation']
        .replace(/{table}/g, table)
        .replace(/{foreignKey}/g, foreignKey)
        .replace(/{id}/g, id);
}

function getQueryFind({table, pk, id}) {
    if (id) {
        return queries['findById']
            .replace(/{table}/g, table)
            .replace(/{pk}/g, pk)
            .replace(/{id}/g, id);
    }

    return queries['findAll']
        .replace(/{table}/g, table);
}

function deleteItem(obj) {
    return queries['delete']
        .replace(/{table}/g, obj.table)
        .replace(/{id}/g, obj.id);
}

function insertItem(obj) {
    return queries['insert']
        .replace(/{table}/g, obj.table);
}

function updateItem(obj) {
    return queries['update']
        .replace(/{table}/g, obj.table)
        .replace(/{setString}/g, obj.setString);
}

module.exports = {
    getQueryFind,
    withRelation,
    deleteItem,
    insertItem,
    updateItem
};
