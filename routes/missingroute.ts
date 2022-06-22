import express,{Request,Response} from "express";

var router = express.Router();
router.route("*")
.get(function(req: Request, res: Response){
  res.status(404)
  res.send("Unknown Route");
});
module.exports = router;