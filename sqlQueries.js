const queries = {
    findByIdWithRelation : `SELECT *
                            FROM {table}, {model}
                            WHERE {foreignKey} = {table}.{primaryKey}
                            AND {table}.{primaryKey} = {id}`,

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
                            WHERE id = {id}`,

    insert :               `INSERT INTO {table} SET ?`,

    update :               `UPDATE {table} 
                            SET {setString} 
                            WHERE id = ?`
};

function getQueryFind(obj) {
    if (obj.id) {
        return queries['findById']
            .replace(/{table}/g, obj.table)
            .replace(/{pk}/g, obj.pk)
            .replace(/{id}/g, obj.id);
    }

    return queries['findAll']
        .replace(/{table}/g, obj.table);
}

function getQueryFindWithRelation(obj) {
    if (obj.id) {
        return queries['findByIdWithRelation']
            .replace(/{table}/g, obj.table)
            .replace(/{model}/g, obj.model)
            .replace(/{foreignKey}/g, obj.foreignKey)
            .replace(/{primaryKey}/g, obj.primaryKey)
            .replace(/{id}/g, obj.id);
    }

    return queries['findAllWithRelation']
        .replace(/{table}/g, obj.table)
        .replace(/{model}/g, obj.model)
        .replace(/{foreignKey}/g, obj.foreignKey)
        .replace(/{primaryKey}/g, obj.primaryKey);
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
    getQueryFindWithRelation,
    deleteItem,
    insertItem,
    updateItem
};
