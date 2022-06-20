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
    filtter: function (collection: string, value: any) {
        return new Promise(async function (resolve, reject) {
            try {
                // knex('users').select('first_name').where('age','>', '18')
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