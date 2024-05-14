import express from 'express';

import {googleauth,testrandomstudenid,refresh_token} from '../controller/auth.controller';
import { jwtRefreshTokenValidate } from "../middleware/jwtrefrech.middleware";


const router = express.Router();

// ! google auth
router.post("/google",googleauth);

router.get("/testrandomstudentid",testrandomstudenid);

router.post("/refresh",jwtRefreshTokenValidate,refresh_token);


module.exports = router;

