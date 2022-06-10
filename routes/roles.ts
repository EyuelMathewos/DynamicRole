import express, { Request, Response } from "express";
import { ForbiddenError } from '@casl/ability';
var router = express.Router();
var maindb = require('../conn/index');


interface CustomRequest extends Request {
  ability ? : any
}


router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "roles");
      let value = await maindb.getAll("roles").catch((error: any) => {
        res.send(error);
      })
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
      ForbiddenError.from(req.ability).throwUnlessCan('create', "roles");
      let value = await maindb.create("roles", req.body).catch((error: any) => {
        res.send(error);
      })
      res.json(req.body);
    } catch (error: any) {
      return res.status(403).send({
        status: 'forbidden',
        message: error.message
      });
    }

  })

module.exports = router;