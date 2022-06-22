import express, { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
const indexRoute = require("./routes/index");
const usersRoute = require("./routes/user");
const rolesRoute = require("./routes/roles");
const accesslistRoute = require("./routes/accesslist");
const permissionRoute = require("./routes/permissions");
const articlesRoute = require("./routes/articles");
const missingRoute = require('./routes/missingroute')
const defineAbilitiesFor = require('./accesscontrol/accesscontrol');
const { getUserRoles, getAnonymousAblity } = require("./service/auth")
const port = 3000;


const app = express();

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

    const decoded: any = jwt.decode(bearerToken);
    res.setHeader("token", bearerToken);

    const usersPermissions = await getUserRoles(decoded.clientId);
    if (usersPermissions != null) {
      const userAbility = defineAbilitiesFor(usersPermissions);
      req.ability = userAbility;
    }
  } 
  else {
    //ANONYMOUS_ABILITY
    const usersPermissions = await getAnonymousAblity();
    const userAbility = defineAbilitiesFor(usersPermissions);
    req.ability = userAbility;
  }
  next()
}

app.use(myLogger)


app.use("/", indexRoute);
app.use("/users", usersRoute);
app.use("/roles", rolesRoute);
app.use("/accesslist", accesslistRoute);
app.use("/permissions", permissionRoute);
app.use("/articles", articlesRoute);
app.use('*', missingRoute);

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})