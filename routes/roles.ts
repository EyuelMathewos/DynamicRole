import express, { Request, Response } from "express";
import { ForbiddenError } from '@casl/ability';
const router = express.Router();
const maindb = require('../conn/index');
const { validator } = require('../validator/index')
const { createRule, updateRule } = require('../validator/roleValidation');


interface CustomRequest extends Request {
  ability ? : any
}


router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "roles");
      let value = await maindb.getAll("roles")
      res.json(value);
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

  .post(async (req: CustomRequest, res: Response) => {
    validator(req.body, createRule).then(async (response: any) => {
      let valdationStatus: Boolean = response.status;
      if (valdationStatus) {
        try {
          ForbiddenError.from(req.ability).throwUnlessCan('create', "roles");
          let value = await maindb.create("roles", req.body)
          res.json(req.body);
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
    }).catch((error: Error) => {
      res.status(412)
      res.send(error)
    })

  })

router.route("/:id")
  .get(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "roles");
      let value = await maindb.filtter("roles", 'id', id)
      res.json(value);
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
      let valdationStatus: Boolean = response.status;
      if (valdationStatus) {
          try {
            ForbiddenError.from(req.ability).throwUnlessCan('update', "roles");
            let value = await maindb.update("roles", 'id', id, req.body)
            res.json(req.body)
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
  })

  .delete(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('delete', "roles");
      let value = await maindb.delete("roles", 'id', id)
      res.send(`role deleted with role id: ${id}`);
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