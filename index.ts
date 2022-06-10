import express, { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
var indexRoute = require("./routes/index");
var usersRoute = require("./routes/user");
var rolesRoute = require("./routes/roles")
var maindb = require('./conn/index');
var defineAbilitiesFor = require('./accesscontrol/accesscontrol')



var app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

interface CustomRequest extends Request {
  ability ? : any
}


async function myLogger(req: CustomRequest, res: Response, next: NextFunction) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader != null) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    var decoded: any = jwt.decode(bearerToken);
    res.setHeader("token", bearerToken);
    //console.log(decoded);

    let value = await maindb.filtter("roles", {
      id: decoded.roleId
    })
    if (value[0]?.permissions != null) {
      console.log(value[0].permissions);
      const userAbility = defineAbilitiesFor(value[0].permissions);
      req.ability = userAbility;
    }

  } else {
    //ANONYMOUS_ABILITY
    let reqvalue = await maindb.filtter("roles", {
      id: 3
    })
    console.log("req value")
    console.log(reqvalue);
    const userAbility = defineAbilitiesFor(reqvalue[0].permissions);
    req.ability = userAbility;

  }

  next()
}

app.use(myLogger)


app.use("/", indexRoute);
app.use("/users", usersRoute);
app.use("/roles", rolesRoute);

app.listen(3000, () => {
  console.log(`app listening on port 3000`)
})