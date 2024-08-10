import express from 'express';

import{histroyData,historyCreate, historyUpdate, historyToday, historyMonth, historyByType, historyStatsByType, historyCounttoday, historyCountbyHour, historyCountbyChannel} from '../controller/history.controller';
const router = express.Router();

router.get("/getHistory",histroyData);
router.get("/getHistorytoday",historyToday);
router.post("/getHistoryCreate",historyCreate);
router.put("/getHistoryUpdate",historyUpdate);
router.get("/getHistoryMonth",historyMonth);
router.get("/getHistoryByType",historyByType);
router.get("/getHistoryStatsByType",historyStatsByType);
router.get("/getHistoryCounttoday",historyCounttoday);
router.get("/getHistoryCountbyHour",historyCountbyHour);
router.get("/getHistoryCountbyChannel",historyCountbyChannel);
module.exports = router;