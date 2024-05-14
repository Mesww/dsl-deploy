import { Prisma } from "@prisma/client/extension";
import prisma from "../prisma/client";
import { Role, QueueType, QueueStatus } from "@prisma/client";
export async function getHistory() {
  // const allQueues = await prisma.queue.findMany();
  // console.log(allQueues);
  return await prisma.history.findMany();
}

export async function addHistory(history: {
  queueid: number;
  studentid: string;
  type: QueueType;
  rate: number;
  comment: string;
  orders: number;
  channel: number;
  status: QueueStatus;
}) {
  const res = await prisma.history.create({
    data: {
      queueid: history.queueid,
      studentid: history.studentid,
      orders: history.orders,
      channel: history.channel,
      type: history.type,
      rate: history.rate,
      status: history.status,
      comment: history.comment,
    },
  });
  console.log("queueid : " + `${res.historyid}`);
  return res;
}

export async function updateHistory(history: {
  queueid: number;
  studentid?: string;
  type?: QueueType;
  rate?: number;
  comment?: string;
  orders?: number;
  channel?: number;
  status?: QueueStatus;
}) {
  const res = await prisma.history.updateMany({
    where: {
      queueid: history.queueid,
    },
    data: {
      rate: history.rate,
      status: history.status,
      type: history.type,
      channel:history.channel
    },
  });
  return res;
}
