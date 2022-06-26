import express, { Request, Response } from "express";
import { ForbiddenError } from '@casl/ability';
const { validator } = require('../validator/index')
var { createRule, updateRule } = require('../validator/accessListValidation');
const router = express.Router();
const maindb = require('../conn/index');


interface CustomRequest extends Request {
  ability ? : any
}


router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "accesslist");
      let value = await maindb.getAll("accesslist")
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
            ForbiddenError.from(req.ability).throwUnlessCan('create', "accesslist");
            let value = await maindb.create("accesslist", req.body)
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
      })
      .catch((error: Error) => {
        res.status(412)
        res.send(error)
      })

  })

router.route("/:id")
  .get(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "accesslist");
      let value = await maindb.filtter("accesslist", 'id', id)
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
        let valdationStatus: Boolean = response.status;
        if (valdationStatus) {
          try {
            ForbiddenError.from(req.ability).throwUnlessCan('update', "accesslist");
            let value = await maindb.update("accesslist", 'id', id, req.body)
            res.json(req.body)
          } catch (error) {
            res.send(error);
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
      ForbiddenError.from(req.ability).throwUnlessCan('delete', "accesslist");
      let value = await maindb.delete("accesslist", 'id', id)
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