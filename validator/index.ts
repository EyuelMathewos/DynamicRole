const Validator = require('validatorjs');

export const validator = ( body: any, rules: any, customMessages: any ) => {
    return new Promise(async function (resolve, reject) {
        const validation = new Validator(body, rules, customMessages);
        validation.passes(() => resolve({status:true}));
        validation.fails(() => {
            validation.errors.status=false
            reject(validation.errors)
        });
    })
};