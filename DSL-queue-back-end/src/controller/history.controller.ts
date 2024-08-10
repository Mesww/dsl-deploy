// ! used for catch error
const asynchandler = require("express-async-handler");

import { $Enums } from "@prisma/client";

import { getHistory, addHistory, updateHistory, getHistorytoday, getHistoryCurrentMonth, getAllHistoryByType, getHistoryStatsByType, countTodayHistoryQueues, countHistoryQueuesByHour, countFinishedQueuesByChannelForTeachersToday } from "../service/historyRepository";
import moment from "moment";

// HistoryData.ts
export const histroyData = asynchandler(async (req: any, res: any) => {
  const gethistoryData = await getHistory();
  gethistoryData.forEach((item: any) => {
    item.datetime = moment(item.datetime).tz("Asia/Bangkok").format();
  });
  res.status(200).send(gethistoryData);
});

export const historyToday = asynchandler(async (req:any,res:any) => {
  const historytoday = await getHistorytoday();
  res.status(200).send(historytoday);
})

export const historyMonth = asynchandler(async (req:any,res:any) => {
  const historymonth = await getHistoryCurrentMonth();
  res.status(200).send(historymonth);
})

export const historyCounttoday = asynchandler(async (req: any, res: any) => {
  const historyCount = await countTodayHistoryQueues();
  res.status(200).send(historyCount);
});

export const historyCountbyHour = asynchandler(async (req: any, res: any) => {
  const historyCount = await countHistoryQueuesByHour();
  res.status(200).send(historyCount);
});

export const historyCountbyChannel = asynchandler(async (req: any, res: any) => {
  const historyCount = await countFinishedQueuesByChannelForTeachersToday();
  console.log(historyCount);
  res.status(200).send(historyCount);
})

export const historyByType = asynchandler(async (req: any, res: any) => {
  const historyByType = await getAllHistoryByType();
  res.status(200).send(historyByType);
})
export const historyStatsByType =asynchandler(async (req:any,res:any) => {
  const historyStatsByType = await getHistoryStatsByType();
  res.status(200).send(historyStatsByType);
})
// historyCreate.post.ts
export const historyCreate = asynchandler(async (req: any, res: any) => {
  const { studentid, type, rate, comment, orders, channel ,status,queueid} = req.body;
  const gethistoryCreate = await addHistory({
    studentid: studentid,
    type: type,
    rate: rate,
    comment: comment,
    orders: orders,
    channel: channel,
    status:status,
    queueid:queueid
  });
  res.status(200).send(gethistoryCreate);
});

export const historyUpdate = asynchandler(async (req:any,res:any) => {
  const {datetime,studentid,type,rate,comment, orders,channel,status,queueid} = req.body
  const historyUpdated = await updateHistory({queueid:queueid,orders:orders,status:status,rate:rate,channel:channel});
  console.log(historyUpdated);
  res.status(200).send("Update history Complete");

})