// const jwt = require("jsonwebtoken")
import jwt from 'jsonwebtoken';
export const jwtValidate = async (req:any,res:any , next:any) => {
  try {
    if (!req.headers["authorization"]) return res.sendStatus(401);
    const token = req.headers["authorization"].replace("Bearer ", "");

    jwt.verify(token, process.env.ACCESS_SECRET!, (err:any,decoded:any)=> {
      if (err) {throw new Error(err)}
    });

    

    next();
  } catch (error) {
  }
};
