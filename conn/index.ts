const knex = require('knex')({
    client: 'postgres',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'master',
    }

});


module.exports = {
    filtter: function (collection: string, value: any) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await knex(collection).select("*").where(value);
                resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    },

    filtterunion: function (collection: string, value: any) {
        return new Promise(async  (resolve, reject) => {
            try {

                const res = knex('users').select('*')
                .fullOuterJoin("accesstokens",{ 'accesstokens.clientId' : 'users.id'})

                resolve(res);
            } catch (error) {
                console.log(error)
                reject(error);
            }
        });
    },


    create: function (collection: string, value: any) {

        return new Promise(async function (resolve, reject) {
            try {
                const res = await knex(collection).insert(value).returning('id').then(function (data: any) {
                    // use id here
                    console.log("id");
                    console.log(data[0].id);
                    value.id = data[0].id;
                    resolve(value);
                });
                //resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    },
    getAll: async function (collection: object) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await knex.select('*').from(collection);
                resolve(res);

            } catch (error) {
                reject(error);
            }
        });
    },
    getAllSelected: async function (collection: object, selectedFields: object) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await knex.select( selectedFields ).from(collection);
                resolve(res);

            } catch (error) {
                reject(error);
            }
        });
    },

    update: function ( collection: string, id: string, value: string, data: object, condition: object = {} ) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await knex(collection).where({
                    [id]: value
                })
                .andWhere(condition)
                .update(data)
                resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    },
    delete: function (collection: string, id: string, value: object, condition: object = {}) {
        return new Promise(async function (resolve, reject) {
            try {
                const res = await knex(collection).where({
                    [id]: value
                })
                .andWhere(condition)
                .del()
                resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    }

};