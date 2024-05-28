import express from 'express';

import{histroyData,historyCreate, historyUpdate, historyToday} from '../controller/history.controller';
const router = express.Router();

router.get("/getHistory",histroyData);
router.get("/getHistorytoday",historyToday);
router.post("/getHistoryCreate",historyCreate);
router.put("/getHistoryUpdate",historyUpdate);


module.exports = router;