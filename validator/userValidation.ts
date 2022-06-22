export const createRule = {
    "email": "required|email",
    "password": "required|string|min:6",
    "roleId": "required|numeric"
};

export const updateRule = {
    "email": "string",
    "password":  "string",
    "roleId":  "integer"
};

export const loginRule = {
    "email": "required|email",
    "password": "required|string|min:6"
};