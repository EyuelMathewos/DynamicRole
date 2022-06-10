const Validator = require('validatorjs');

export const validator = (body: any, rules: any, customMessages: any, callback: (arg0: null, arg1: boolean) => any) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};