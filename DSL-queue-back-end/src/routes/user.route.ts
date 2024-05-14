import express from 'express';
import {useraddUser,usergetSpecificuser,usereditSpecificuser, addTeacher} from '../controller/user.controller';

const usercontroller = require('../controller/user.controller');

const router = express.Router();

router.get("/getAlluser",usercontroller.userlist);
router.post("/addUser",useraddUser);
router.get("/getSpecificuser",usergetSpecificuser)
router.put("/getusereditSpecificuser",usereditSpecificuser)
router.post("/addTeacher",addTeacher);

module.exports = router;

