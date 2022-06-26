import express, { Request, Response } from "express";
import { ForbiddenError } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { accessibleBy } from '@casl/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const router = express.Router();
const maindb = require('../conn/index');
const { validator } = require('../validator/index')
const { createRule, loginRule, updateRule } = require('../validator/userValidation');
const { generateHash, getUser } = require("../service/auth")


interface CustomRequest extends Request {
  ability ? : any
}

const options = { fieldsFrom: (rule: { fields: any; }) => rule.fields || "*" };

router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "users");
      let fields = permittedFieldsOf(req.ability, 'read', "users" , options);
      let value = await maindb.getAllSelected( "users", fields )
      res.json(value);

    } catch (error: any) {
      return res.status(403).send({
        status: 'forbidden',
        message: error.message
      });
    }

  })


  .post(async (req: CustomRequest, res: Response) => {
    try {
      // ForbiddenError.from(req.ability).throwUnlessCan('create', "users");
      validator(req.body, createRule).then(async (response: any) => {
          let valdationStatus: Boolean = response.status;
          if (valdationStatus) {
            const hash = await generateHash(req.body.password);
            req.body.password = hash;
            try {
              let user = await maindb.create("users", req.body);
              res.json(user)
            } catch (error: any) {
              if ( error instanceof ForbiddenError ) {
                return res.status(403).send({
                  status: 'forbidden',
                  message: error.message
                });
              } else {
                res.send(error);
              }
            }
          }
        })
        .catch((error: Error) => {
          res.status(412)
          res.send(error)
        })
    } catch (error: any) {
      return res.status(403).send({
        status: 'forbidden',
        message: error.message
      });
    }
  })


router.route("/login")
  .post(async (req: CustomRequest, res: Response) => {

    validator(req.body, loginRule).then(async (response: any) => {
      const users = await getUser(req.body.email);
      let isPass = users[0]?.password != null ? bcrypt.compareSync(req.body.password, users[0].password) : false;
      if (isPass) {
        try {
          ForbiddenError.from(req.ability).throwUnlessCan('create', "users");
          let data = {
            clientId: users[0].id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
          };
          const accesstokens = await maindb.create("accesstokens", data);
          let encrypt = jwt.sign(data, "shhhhh");
          res.json({
            id: accesstokens.id,
            clientId: users[0].id,
            token: encrypt
          });
        } catch (error: any) {
          if ( error instanceof ForbiddenError ) {
            return res.status(403).send({
              status: 'forbidden',
              message: error.message
            });
          } else {
            res.send(error);
          }
        }
      } else {
        res.status(401);
        res.send("Incorrect Password or Account Name")
      }
    }).catch((error: Error) => {
      res.status(412)
      res.send(error)
    });
  });

router.route("/:id/accesstokens")
  .get(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('create', "accesstokens");
      let users = await maindb.filtterunion("users", "id", "id", id, "accesstokens", "clientId")
      res.json(users);

    } catch (error: any) {
      if ( error instanceof ForbiddenError ) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      } else {
        res.send(error);
      }
    }

  })

router.route("/:id")
  .get(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "users");
      let value = await maindb.filtter("users", 'id', id)
      res.json(value)
    } catch (error: any) {
      if ( error instanceof ForbiddenError ) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      } else {
        res.send(error);
      }
    }
  })

  .put(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    
    validator(req.body, updateRule).then(async (response: any) => {
        let data = req.body;
        let valdationStatus: Boolean = response.status;

        if ( valdationStatus ) {
          try {
            ForbiddenError.from(req.ability).throwUnlessCan('update', "users");
            const accessibleby = accessibleBy(req.ability, 'update').users;
            const conditions = accessibleby['OR'][0];
                  if( conditions == null || conditions == {} || data == {}){
                      throw({ message: "Can Not Update User Data Only Account Owner Can"});
                  }
            let value = await maindb.update( "users", 'id', id, req.body, conditions )
            console.log(value);
            if( value == 0 ){
              res.status(412).json({
                message: 'Can Not Update User Data Only Account Owner Can'
              }) 
            }else{
              res.send({
                result: "success",
                message: `User Data Updated with a User Id: ${id}`
              })
            }
            //res.json(req.body)
          } catch (error: any) {
            if ( error instanceof ForbiddenError ) {
              return res.status(403).send({
                status: 'forbidden',
                message: error.message
              });
            } else {
             res.send(error);
            }
          }
        }
      })
      .catch((error: Error) => {
        res.status(412)
        res.send(error)
      })
  })

  .delete(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('delete', "users");
      let value = await maindb.delete("users", 'id', id)
      res.send(`user deleted with user id: ${id}`);
    } catch (error: any) {
      if ( error instanceof ForbiddenError ) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      } else {
        res.send(error);
      }
    }
  })

module.exports = router;