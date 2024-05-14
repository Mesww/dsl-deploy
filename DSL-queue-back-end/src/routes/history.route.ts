import express from 'express';

import{histroyData,historyCreate, historyUpdate} from '../controller/history.controller';
const router = express.Router();

router.get("/getHistory",histroyData);
router.post("/getHistoryCreate",historyCreate);
router.put("/getHistoryUpdate",historyUpdate);


module.exports = router;