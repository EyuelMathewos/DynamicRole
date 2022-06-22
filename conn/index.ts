const knex = require('knex')({
    client: 'postgres',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'dynamicrole',
    }

});




module.exports = {
    filtter: function (collection: string, key:any ,value: any) {
        return new Promise(async function (resolve, reject) {
            try {
                // knex('users').select('first_name').where('age','>', '18')
                const res = await knex(collection).select("*").where(key,value);
                resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    },

    filtterunion: function ( currentTableName: string, currentIdName:string, key:any ,value: any, joinTableName: string, joinTableIdName: string ) {
        return new Promise(async  (resolve, reject) => {
            try {
                let joinValue : string = `${joinTableName}.${joinTableIdName}` 
                let currentValue : string = `${currentTableName}.${currentIdName}`
                const res = knex.select('*')
                .from(currentTableName).where(key, value)
                .fullOuterJoin(joinTableName, currentValue ,joinValue)

                resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    },

    create: function (collection: string, value: any) {

        return new Promise(async function (resolve, reject) {
            try {
                const res = await knex(collection).insert(value);
                resolve(value);
            } catch (error) {
                reject(error);
            }
        });
    },
    getAll: async function (collection: string) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await knex.select('*').from(collection);
                resolve(res);

            } catch (error) {
                reject(error);
            }
        });
    },
    update: function (collection: string, id: string, value: string, data: object) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await knex(collection).where({
                    [id]: value
                }).update(data)
                resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    },
    delete: function (collection: string, id: string, value: object) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await knex(collection).where({
                    [id]: value
                }).del()
                resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    }

};