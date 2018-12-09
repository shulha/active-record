const queries = {
    findById :             `SELECT * 
                            FROM {table} 
                            WHERE {pk} = {id}`,

    findAll :              `SELECT * 
                            FROM {table}`,

    delete :               `DELETE 
                            FROM {table}
                            WHERE {pk} = {id}`,

    insert :               `INSERT INTO {table} SET ?`,

    update :               `UPDATE {table} 
                            SET ? 
                            WHERE {pk} = {id}`,

    relation :             `SELECT *
                            FROM {table}
                            WHERE {foreignKey} = {id}`,
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

function deleteItem({table, pk, id}) {
    return queries['delete']
        .replace(/{table}/g, table)
        .replace(/{pk}/g, pk)
        .replace(/{id}/g, id);
}

function insertItem({table}) {
    return queries['insert']
        .replace(/{table}/g, table);
}

function updateItem({table, pk, id}) {
    return queries['update']
        .replace(/{table}/g, table)
        .replace(/{pk}/g, pk)
        .replace(/{id}/g, id);
}

module.exports = {
    getQueryFind,
    withRelation,
    deleteItem,
    insertItem,
    updateItem
};
