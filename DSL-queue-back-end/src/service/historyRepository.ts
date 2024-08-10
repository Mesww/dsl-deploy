import { Prisma } from "@prisma/client/extension";
import prisma from "../prisma/client";
import { Role, QueueType, QueueStatus } from "@prisma/client";
export async function getHistory() {
  // const allQueues = await prisma.queue.findMany();
  // console.log(allQueues);
  return await prisma.history.findMany();
}

export async function getHistoryCurrentMonth() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

  const currentMonthData = await prisma.history.findMany({
    where: {
      datetime: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return currentMonthData;
}

export async function getAllHistoryByType() {
  const types = Object.values(QueueType);
  
  const historyByType = await Promise.all(types.map(async (type) => {
    const entries = await prisma.history.findMany({
      where: {
        type: type
      }
    });
    
    return {
      type: type,
      entries: entries
    };
  }));

  return historyByType;
}

export async function getHistoryStatsByType() {
  const historyStats = await prisma.history.groupBy({
    by: ['type'],
    _count: {
      _all: true
    },
    _sum: {
      rate: true
    },
    _avg: {
      rate: true
    },
    orderBy: {
      type: 'asc'
    }
  });

  return historyStats.map(stat => ({
    type: stat.type,
    count: stat._count._all,
    totalRate: stat._sum.rate,
    averageRate: stat._avg.rate
  }));
}


export async function getHistorytoday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of the day
  today.setDate(today.getDate())
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Start of the next day
  return await prisma.history.findMany({
    where: {
      datetime: {
        gte: today,
        lt: tomorrow,
      },
      NOT: {
        status: {
          in:[
            "RESET"
          ]
        }
        
      },
    },
  });
}

export async function countTodayHistoryQueues() {
  const today = new Date();
  today.setDate(today.getDate());
  today.setHours(0, 0, 0, 0);

  const allQueuesCount = await prisma.history.count({
    where:{
      datetime:{
        gte: today,
      }
    }
  });

  const finishedCount = await prisma.history.count({
    where: {
      datetime: {
        gte: today,
      },
      status: { in:[
        QueueStatus.FINISH,
        QueueStatus.RESET
      ],}
    },
  });

  const notFinishedCount = await prisma.history.count({
    where: {
      datetime: {
        gte: today,
      },
      status: {
        not: {
          in:[
            QueueStatus.FINISH,
            QueueStatus.RESET
          ]
        },
      },
    },
  });

  return {allQueuesCount, finishedCount, notFinishedCount };
}

export async function countHistoryQueuesByHour() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate());
  yesterday.setHours(0, 0, 0, 0);

  const results = [];

  for (let hour = 8; hour <= 16; hour++) {
    const startTime = new Date(yesterday);
    startTime.setHours(hour, 0, 0, 0);

    const endTime = new Date(yesterday);
    endTime.setHours(hour + 1, 0, 0, 0);

    const count = await prisma.history.count({
      where: {
        datetime: {
          gte: startTime,
          lt: endTime,
        },
      },
    });

    results.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      count,
    });
  }

  return results;
}

export async function countFinishedQueuesByChannelForTeachersToday() {
  const today = new Date()
  today.setDate(today.getDate());
  today.setHours(0, 0, 0, 0)

  const result = await prisma.history.groupBy({
    by: ['channel'],
    where: {
      datetime: {
        gte: today,
      },
      status:{ in:[ QueueStatus.FINISH,QueueStatus.RESET]} ,
    },
    _count: {
      historyid: true
    }
  })
  // console.log(result);

  return result.map(item => ({
    channel: item.channel,
    count: item._count.historyid
  }))
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
      channel: history.channel,
    },
  });
  return res;
}
