import bcrypt from 'bcryptjs';
var maindb = require('../conn/index');

function authHandler(){

}

export function getUser  ( email : string ) {
  return new Promise(async  (resolve, reject) => {
      try{
        let value = await maindb.filtter( "users",'email', email );
        resolve(value);
      }catch( error ){
        reject(error);
      }
  })
}

export function getUserRoles  ( clientId : any ) {
  return new Promise(async  (resolve, reject) => {
      try{
        let user = await maindb.filtter( "users",'id', clientId );
        let permissions = await maindb.filtterunion( "permissions", "accessId", "roleId", 1,  "accesslist", "id" )
        resolve(permissions);
      }catch( error ){
        reject(error);
      }
  })
}
//ANONYMOUS_ABILITY
export function getAnonymousAblity  ( clientId : any ) {
  return new Promise(async  (resolve, reject) => {
      try{
        let permissions = await maindb.filtterunion( "permissions", "accessId", "roleId", 3,  "accesslist", "id" )
        // console.log(permissions);
        resolve(permissions);
      }catch( error ){
        reject(error);
      }
  })
}

export function generateHash ( password : string ) {
  return new Promise(async  (resolve, reject) => {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password , salt, async function (err, hash) {
          if (err) {
            reject(err);
          } else {
            resolve ( hash );
          }
        });
      });
    }
)}