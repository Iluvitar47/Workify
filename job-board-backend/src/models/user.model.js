const query = require('../db/db-connection');
const { multipleColumnSet } = require('../utils/common.utils');
const Role = require('../utils/userRoles.utils');

class UserModel {
    tableName = 'people';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        let sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        return result[0];
    }

    search = async (params) => {
        const { columnSet, values } = multipleColumnSet(params);

        const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`;

        const result = await query(sql, [...values]);
        return result;
    }

    create = async ({ permission = Role.Applicants, firstname, lastname, email, phone, experiences, studies, skills, business_sector, target_job, location, password }) => {
        const sql = `INSERT INTO ${this.tableName}
        (permission, firstname, lastname, email, phone, experiences, studies, skills, business_sector, target_job, location, password) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;

        const result = await query(sql, [permission, firstname, lastname, email, phone, experiences, studies, skills, business_sector, target_job, location, password]);  
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        let sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`;
        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        let sql = `DELETE FROM ${this.tableName}
        WHERE id = ?`;

        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new UserModel;