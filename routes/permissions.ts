import express, { Request, Response } from "express";
import { ForbiddenError } from '@casl/ability';
const { validator } = require('../validator/index')
const { createRule, updateRule } = require('../validator/permissionsValidation');
const router = express.Router();
const maindb = require('../conn/index');


interface CustomRequest extends Request {
  ability ? : any
}


router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "permissions");
      let value = await maindb.getAll("permissions")
      res.json(value);
    } catch (error: any) {
      if (error.name == "ForbiddenError") {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      } else {
        res.send(error);
      };
    }
  })

  .post(async (req: CustomRequest, res: Response) => {
    validator(req.body, createRule).then(async (response: any) => {
        let accessId: number = req.body.accessId;
        let roleId: number = req.body.roleId;
        let data = {
          accessId,
          roleId
        }
        let valdationStatus: Boolean = response.status;
        if (valdationStatus) {
          try {
            // ForbiddenError.from(req.ability).throwUnlessCan('create', "permissions");
            let value = await maindb.create("permissions", data)
            res.json(req.body);
          } catch (error: any) {
            if (error.name == "ForbiddenError") {
              return res.status(403).send({
                status: 'forbidden',
                message: error.message
              });
            } else {
              res.send(error);
            };
          }
        }
      })
      .catch((error: Error) => {
        res.send(error);

      })

  })

router.route("/:id")
  .get(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "permissions");
      let permissions = await maindb.filtterunion("permissions", "accessId", "roleId", id, "accesslist", "id")
      res.json(permissions);

    } catch (error: any) {
      return res.status(403).send({
        status: 'forbidden',
        message: error.message
      });
    }

  })

  .put(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    validator(req.body, updateRule).then(async (response: any) => {
        let valdationStatus: Boolean = response.status;
        if (valdationStatus) {
          try {
            ForbiddenError.from(req.ability).throwUnlessCan('update', "permissions");
            let value = await maindb.update("permissions", 'id', id, req.body)
            res.json(req.body)
          } catch (error: any) {
            if (error.name == "ForbiddenError") {
              return res.status(403).send({
                status: 'forbidden',
                message: error.message
              });
            } else {
              res.send(error);
            };
          }
        }
      })
      .catch((error: Error) => {
        res.send(error);
      })
  })

  .delete(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('delete', "permissions");
      let value = await maindb.delete("permissions", 'id', id)
      res.send(`user deleted with user id: ${id}`);
    } catch (error: any) {
      if (error.name == "ForbiddenError") {
        return res.status(403).send({
          status: 'forbidden',
          message: error.message
        });
      } else {
        res.send(error);
      };
    }
  })


module.exports = router;