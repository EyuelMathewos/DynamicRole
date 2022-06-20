import express, { Request, Response } from "express";
import { ForbiddenError } from '@casl/ability';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
var router = express.Router();
var maindb = require('../conn/index');
var { validator } = require('../validator/index')
var { validationRule, loginValidation } = require('../validator/userValidation');


interface CustomRequest extends Request {
  ability ? : any
}



router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "User");
      let value = await maindb.getAll("users")
      console.log(value);
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
      ForbiddenError.from(req.ability).throwUnlessCan('create', "User");

      validator(req.body, validationRule, {}, (err: any, status: any) => {
        if (!status) {
          res.status(412)
            .send({
              success: false,
              message: 'Validation failed',
              data: err
            });
        } else {

          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
              // Store hash in your password DB.
              if (err) {
                console.log(`ERROR : ${err}`);
              } else {
                req.body.password = hash;
                console.log(req.body)

                let user = await maindb.create("users", req.body).catch((error: any) => {
                  res.send(error);
                })
                res.json(user)
              }
            });
          });

        }
      })

    } catch (error: any) {
      console.log(error);
      return res.status(403).send({
        status: 'forbidden',
        message: error.message
      });
    }

  })


router.route("/login")
  .post(async (req: CustomRequest, res: Response) => {

    if (req.ability.can('create', 'User')) {
      validator(req.body, loginValidation, {}, async (err: any, status: any) => {
        if (!status) {
          res.status(412)
            .send({
              success: false,
              message: 'Validation failed',
              data: err
            });
        } else {


          let users = await maindb.filtter("users", {
            email: req.body.email
          }).catch((error: object) => {
            res.send(error);
          })
          console.log("users :");
          console.log(users);
          let value = false;
          if (users[0] != null) {
            value = bcrypt.compareSync(req.body.password, users[0].password);
          }


          if (value == true) {
            let data = {
              clientId: users[0].id,
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + (60 * 60),
            }
            console.log(data)
            const accesstokens = await maindb.create("accesstokens", data).catch((error: any) => {
              console.log(error)
            })

            console.log("accesstokens :");
            console.log(accesstokens);

            let encrypt = jwt.sign(
              data,
              "shhhhh"
            );

            res.json({
              id: accesstokens.id,
              clientId: users[0].id,
              token: encrypt
            });
          } else {
            res.status(401);
            res.send("Incorrect Password or Account Name")
          }

        }
      });

    } else {
      try {
        ForbiddenError.from(req.ability).throwUnlessCan('create', "User");
      } catch (error: any) {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      }
    }

  })

  router.route("/:id/accesstokens")
  .get(async (req: CustomRequest, res: Response) => {
    try {
     // ForbiddenError.from(req.ability).throwUnlessCan('read', "User");

      let users = await maindb.filtterunion("users", {
        id: 5
      }).catch((error: object) => {
        res.send(error);
      })
      res.json(users);

    } catch (error: any) {
      return res.status(403).send({
        status: 'forbidden',
        message: error.message
      });
    }

  })
module.exports = router;