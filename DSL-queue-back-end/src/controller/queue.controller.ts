// ! used for catch error
const asynchandler = require("express-async-handler");
import moment from "moment-timezone";
const gTTS = require("gtts");
import stream from "stream";

import { $Enums } from "@prisma/client";
import {
  resetQueueOrder,
  getAllqueues,
  getSpecific,
  getSpecificstatusrefuse,
  addQueue,
  updateQueuestatus,
  updateAllQueuestatus,
  updateQueuechannel,
  getCountqueuebefore,
  deleteQueue,
  getSpecificstatus,
} from "../service/queueRepository";
import { Request, Response } from "express";
// queueData
export const queue = asynchandler(async (req: any, res: any) => {
  const getQueue = await getAllqueues();
  // Convert each datetime field to Asia/Bangkok timezone
  getQueue.forEach((item: any) => {
    item.datetime = moment(item.datetime).tz("Asia/Bangkok").format();
  });

  res.status(200).send(getQueue);
});

// queueDataspecific.post
export const queueSpecific = asynchandler(async (req: any, res: any) => {
  const { queueid, studentID, channel, status } = req.query;
  const getQueueSpecific = await getSpecific({
    queueid: parseInt(queueid),
    studentID: studentID,
    channel: parseInt(channel),
    status: status,
  });
  // console.log(getQueueSpecific.length);
  if (getQueueSpecific.length <= 1 && getQueueSpecific[0] === null) {
    return res.status(200).send(null);
  }
  getQueueSpecific.forEach((item: any) => {
    item.datetime = moment(item.datetime).tz("Asia/Bangkok").format();
  });
  res.status(200).send(getQueueSpecific);
});
export const queueSpecificstatus = asynchandler(async (req: any, res: any) => {
  const { status } = req.query;
  const getQueueSpecificstatus = await getSpecificstatus({ status: status });
  // console.log(getQueueSpecific.length);
  res.status(200).send(getQueueSpecificstatus);
});

// queueDataspecificstatusrefuse.get
export const queueSpecificstatusrefuse = asynchandler(
  async (req: any, res: any) => {
    const { status1, status2, status3 } = req.query;
    const getQueueSpecificstatusrefuse = await getSpecificstatusrefuse({
      status1: status1,
      status2: status2,
      status3: status3,
    });
    getQueueSpecificstatusrefuse.forEach((item: any) => {
      item.datetime = moment(item.datetime).tz("Asia/Bangkok").format();
    });
    res.status(200).send(getQueueSpecificstatusrefuse);
  }
);

//queueCreate.post
export const queueaddQueue = asynchandler(async (req: any, res: any) => {
  const { studentID, type } = req.body;
  const getqueueaddQueue = await addQueue({ studentID: studentID, type: type });
  res.status(200).send(getqueueaddQueue);
});

export const resetQueue = asynchandler(async (req: any, res: any) => {
  await resetQueueOrder();
  return res.status(200).send({ message: "Reset completed!" });
});

// queueUpdatestatus.put
export const queueUpdatestatus = asynchandler(async (req: any, res: any) => {
  const { queueid, status } = req.body;
  const getqueueUpdatestatus = await updateQueuestatus({
    queueid: queueid,
    status: status,
  });

  res.status(200).send(getqueueUpdatestatus);
});

export const queueupdateAllQueuestatus = asynchandler(
  async (req: any, res: any) => {
    const { status, changeStatus } = req.body;
    const getqueueupdateAllQueuestatus = await updateAllQueuestatus({
      status: status,
      changeStatus: changeStatus,
    });

    res.status(200).send(getqueueupdateAllQueuestatus);
  }
);

export const queueupdateQueuechannel = asynchandler(
  async (req: any, res: any) => {
    const { queueid, channel } = req.body;
    console.log(queueid, channel);
    const getqueueupdateQueuechannel = await updateQueuechannel({
      queueid: queueid,
      channel: channel,
    });
    res.status(200).send(getqueueupdateQueuechannel);
  }
);

export const queueCountqueuebefore = asynchandler(
  async (req: any, res: any) => {
    const { queueidstring } = req.query;
    console.log(queueidstring);
    const queueid = parseInt(queueidstring);
    const getqueueCountqueuebefore = await getCountqueuebefore({
      queueid: queueid,
    });

    res.status(200).send({ queuebefore: getqueueCountqueuebefore });
  }
);

export const queueSpeack = asynchandler(async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }
  const gtts = new gTTS(text, "th");
  // Set appropriate headers
  res.set({
    "Content-Type": "audio/mpeg",
    "Transfer-Encoding": "chunked",
  });
  // Create a pass-through stream
  const passThrough = new stream.PassThrough();

  // Pipe the gTTS stream to the pass-through stream
  gtts.stream().pipe(passThrough);

  // Pipe the pass-through stream to the response
  passThrough.pipe(res);

  // Handle potential errors
  passThrough.on("error", (error) => {
    console.error("Stream error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });
});

export const queuedeleteQueue = asynchandler(async (req: any, res: any) => {
  const { queueid } = req.query;

  const getqueuedeleteQueue = await deleteQueue({ queueid: parseInt(queueid) });
  res.status(200).send(getqueuedeleteQueue);
});
