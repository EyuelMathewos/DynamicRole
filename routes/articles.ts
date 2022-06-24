import express, { Request, Response } from "express";
import { ForbiddenError,  } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { accessibleBy } from '@casl/prisma';
const { validator } = require('../validator/index')
// const { createRule, updateRule } = require('../validator/articlesValidation');
const router = express.Router();
const maindb = require('../conn/index');


interface CustomRequest extends Request {
  ability ? : any
}

const options = { fieldsFrom: (rule: { fields: any; }) => rule.fields || "*" };


router.route("/")
  .get(async (req: CustomRequest, res: Response) => {
   let fields = permittedFieldsOf(req.ability, 'read', "articles" , options);
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "articles");
   
      let value = await maindb.getAllSelected("articles", fields )
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
          try {
            ForbiddenError.from(req.ability).throwUnlessCan('create', "articles");   
           let value = await maindb.create("articles", req.body)
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



  })

router.route("/:id")
  .get(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    try {
      ForbiddenError.from(req.ability).throwUnlessCan('read', "articles");
      let articles = await maindb.filtterunion("articles", "accessId", "roleId", id, "accesslist", "id")
      res.json(articles);

    } catch (error: any) {
      return res.status(403).send({
        status: 'forbidden',
        message: error.message
      });
    }

  })

  .put(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    const accessibleby = accessibleBy(req.ability, 'update').articles;
    const condition = accessibleby['OR'][0];
          try {
            ForbiddenError.from(req.ability).throwUnlessCan('update', "articles");
            if( condition == null || condition == {} ){
                throw("can not update articles");
            }
            let value = await maindb.update("articles", 'id', id, req.body, condition )
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

  .delete(async (req: CustomRequest, res: Response) => {
    const id = req.params.id;
    try {
        const condition = accessibleBy(req.ability, 'delete').articles;
        const conditiondata = condition['OR'][0];
      ForbiddenError.from(req.ability).throwUnlessCan('delete', "articles");
      if( conditiondata == null || conditiondata == {} ){
        throw("can not update articles");
      }
      let value = await maindb.delete("articles", 'id', id, conditiondata)
      res.send(`Article deleted with Article id: ${id}`);
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