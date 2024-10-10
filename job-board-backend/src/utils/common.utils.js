// This function helps to set multiple fields for prepared queries with key value pairs.
exports.getPlaceholdersStringForArray = (array) => {
    if (!Array.isArray(array)) {
        throw new Error('Invalid input');
    }

    const placeholders = [...array];
    return placeholders.fill('?').join(', ').trim();
}

exports.multipleColumnSet = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const values = Object.values(object);

    columnSet = keys.map(key => `${key} = ?`).join(', ');

    return {
        columnSet,
        values
    }
};