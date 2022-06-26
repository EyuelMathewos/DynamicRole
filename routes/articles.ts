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
        try {   
            ForbiddenError.from(req.ability).throwUnlessCan('read', "articles");
            let fields = permittedFieldsOf(req.ability, 'read', "articles" , options);
            let value = await maindb.getAllSelected("articles", fields )
            res.json(value);
        } catch (error: any) {
              if ( error instanceof ForbiddenError ) {
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
                  if ( error instanceof ForbiddenError ) {
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
            let fields = permittedFieldsOf(req.ability, 'read', "articles" , options);
            let articles = await maindb.getAllSelected("articles", fields)
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
          let data = req.body
          try {
            ForbiddenError.from(req.ability).throwUnlessCan('update', "articles");
            const accessibleby = accessibleBy(req.ability, 'update').articles;
            const conditions = accessibleby['OR'][0];
                  if( conditions == null || conditions == {} || data == {} ){
                      throw({"message":"Can Not Update Article Only Article Owner Can"});

                  }
                  let value = await maindb.update("articles", 'id', id, req.body, conditions );
                  if( value == 0 ){
                    res.status(412).json({
                      message: 'Article is not updated only updated by the owner'
                    }) 
                  }else{
                    res.send({
                      result: "success",
                      message: `Article updated with Article id: ${id}`
                    })
                  }
          } catch (error: any) {
            if ( error instanceof ForbiddenError ) {
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
            ForbiddenError.from(req.ability).throwUnlessCan('delete', "articles");
            const conditions = accessibleBy(req.ability, 'delete').articles;
            const conditionsdata = conditions['OR'][0];
            if( conditionsdata == null || conditionsdata == {} ){
              throw({"message":"Can Not Delete Article Only Article Owner Can"});
            }
            let value = await maindb.delete( "articles", 'id', id, conditionsdata );
            if( value == 0 ){
              res.status(412).json({
                message: 'Article is not Deleted only updated by the owner'
              }) 
            }else{
              res.send({
                result: "success",
                message: `Article Deleted with Article id: ${id}`
              })
            }
        } catch (error: any) {
          if ( error instanceof ForbiddenError ) {
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