import { Prisma } from "@prisma/client/extension";
import prisma from "../prisma/client";
import { Role, QueueType, QueueStatus } from "@prisma/client";

let reset = false;


export async function getAllqueues() {
  // const allQueues = await prisma.queue.findMany();
  // console.log(allQueues);
  return await prisma.queue.findMany();
}

export async function getSpecific(queue: {
  queueid?: number;
  studentID?: string;
  channel?: number;
  status?: QueueStatus;
}) {
  let res = [];
  console.log("isNaN : ", Number.isNaN(queue.queueid));
  if (Number.isNaN(queue.queueid) && queue.studentID === undefined) {
    console.log(queue.channel);
    res = await prisma.queue.findMany({
      where: {
        channel: queue.channel,
        status: queue.status,
      },
    });
  } else if (Number.isNaN(queue.queueid) === false) {
    res.push(
      await prisma.queue.findUnique({
        where: {
          queueid: queue.queueid,
        },
      })
    );
  } else {
    console.log("test");
    res.push(
      await prisma.queue.findUnique({
        where: {
          studentID: queue.studentID,
        },
      })
    );
    console.log(res);
  }
  return res;
}

//! status can null because "?" after status2
export async function getSpecificstatusrefuse(queue: {
  status1: QueueStatus;
  status2?: QueueStatus;
  status3?: QueueStatus;
}) {
  const res = await prisma.queue.findMany({
    where: {
      NOT: {
        // !finde rows are not including queue.status1 or queue.status2
        OR: [{ status: queue.status1 }, { status: queue.status2 },{status:queue.status3}],
      },
    },
  });
  return res;
}
export async function getSpecificstatus(queue: {
  status: QueueStatus;
}) {
  const res = await prisma.queue.findMany({
    where: {
      status :queue.status
    },
  });
  return res;
}
export async function addQueue(queue: { studentID: string; type: QueueType }) {
  // Get the current maximum value of the orders column
  let lastOrder: { lastOrder: number }[] = [{
    lastOrder: 0
  }];
  if (reset === true) {
    lastOrder[0].lastOrder = 0
    console.log(lastOrder[0]);
    reset = false
  }else{
    lastOrder =  await prisma.$queryRaw`
    SELECT MAX(orders) AS lastOrder FROM Queue;
  `;
  }
  let orderCounter =  (lastOrder[0].lastOrder || 0) + 1;

  const res = await prisma.queue.create({
    data: {
      studentID: queue.studentID,
      datetime: new Date(),
      type: queue.type,
      channel: 0,
      orders: orderCounter,
      status: QueueStatus.WAIT,
      rate: 0,
      comment: "",
    },
  });
  console.log("queueid : " + `${res.queueid}`);
  return res;
}

export async function resetQueueOrder() {
  // ? set reset true for reset new order to 1
  reset = true;
  const res = await prisma.queue.updateMany({
    where:{
      NOT:{ 
        AND:[{
          status:"FINISH"
        },{
          status:"SKIP"
        }  ]
      }
    },
    data:{
      status: "FINISH"
    }
  })
}

export async function updateQueuestatus(queue: {
  queueid: number;
  status: QueueStatus;
}) {
  const res = await prisma.queue.update({
    where: {
      queueid: queue.queueid,
    },
    data: {
      status: queue.status,
    },
  });
}

export async function updateAllQueuestatus(queue: {
  status: QueueStatus;
  changeStatus: QueueStatus;
}) {
  const res = await prisma.queue.updateMany({
    where: {
      status: queue.changeStatus,
    },
    data: {
      status: queue.status,
    },
  });
}

export async function updateQueuechannel(queue: {
  queueid: number;
  channel: number;
}) {
  console.log(queue);
  const res = await prisma.queue.update({
    where: {
      queueid: queue.queueid,
    },
    data: {
      status: QueueStatus.PROCESS,
      channel: queue.channel,
    },
  });
  //   console.log(res);
}

export async function getCountqueuebefore(queue: { queueid: number }) {
  console.log(queue.queueid);
  try {
    const result = await prisma.queue.count({
      where: {
        status: {
          notIn: ["FINISH", "SKIP"], // Assuming 'FINISH' means completed
        },
        queueid: {
          lte: queue.queueid,
        },
      },
    });
    console.log(`Queue items up to position ${queue.queueid}:`, result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteQueue(queue: { queueid: number }) {
  const res = await prisma.queue.delete({
    where: {
      queueid: queue.queueid,
    },
  });
}
