<template>
  <div class="flex justify-center w-screen main-wrapper">
    <main
      class="grid grid-cols-2 gap-4 "
    >
    <cards v-if="loading === false" card-color="white" :data="chartData[0]" />
    <cards v-if="loading === false" card-color="white" :data="chartData[1]" />
    <cards v-if="loading === false" card-color="white" :data="chartData[2]" />
    <cards v-if="loading === false" card-color="white" :data="chartData[3]" />
    </main>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import cards from "../../components/admin/home.content.vue";
import { ChartData, Charttype } from "../../models/Chart";
// import { Queue } from '../../models/Queue';
import { History } from "../../models/History";
import { User } from "../../models/User";
import { onMounted, Ref, ref } from "vue";
let queueToday: Ref<History[]> = ref([]);
let today = new Date(Date.now());
let history : Ref<History[]> = ref([]);
let loading = ref(true);
let chartData: Ref<ChartData[]> = ref([]);
let teacher : Ref<User[]> = ref([])
  let timer = 10000;

  async function getqueue(){
    try {
      const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/history/getHistory`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    return res;  
    } catch (error) {
      console.error(error);
      
    }
  }

  async function getAllQueue() {
  try {
    const res = await getqueue();
    // console.log(res.data);
    history.value = res.data;
    let qt: History[] = [];
    res.data.forEach((value: History) => {
      value.datetime = new Date(value.datetime);
      // ! Queue today
    if (value.datetime.getDate() === today.getDate()) {
        qt.push(value);
      }
    });

    queueToday.value = qt;
    // console.log("Queue today", queueToday.value);


    let hourCounts: number[] = [];
    let hc:number[] = [];
    for (let i = 8; i <= 16; i++) {
      const count = filterDataByHour(i, queueToday.value);
      hc.push(count);
    }
    hourCounts = hc;

    const finish = queueToday.value.filter((value) => {
      return value.status === "FINISH";
    });

    const notFinish = queueToday.value.filter((value) => {
      return (
        value.status !== "FINISH" &&
        value.status !== "SKIP" &&
        value.status !== "CANCEL"
      );
    });

    const one = history.value.filter((value)=>{
      return value.type === "ONE"
    })
    const two = history.value.filter((value)=>{
      return value.type === "TWO"
    })
    const three = history.value.filter((value)=>{
      return value.type === "THREE"
    })

    let rateone =0;
    let ratetwo =0;
    let ratethree =0;
    // console.log(one.length);
    for (let index = 0; index < history.value.length; index++) {
      if (history.value[index].type === "ONE") {
        rateone = (history.value[index].rate + rateone)/ history.value.filter((value)=>{
          return value.type === "ONE" && value.status === "FINISH";
        }).length;
      }else if (history.value[index].type === "TWO"){
        ratetwo = history.value[index].rate + ratetwo/history.value.filter((value)=>{
          return value.type === "TWO" && value.status === "FINISH";
        }).length;
      }else if (history.value[index].type ==="THREE"){
        ratethree = history.value[index].rate + ratethree/history.value.filter((value)=>{
          return value.type === "THREE" && value.status === "FINISH";
        }).length;
      }
    }
    
    // console.log(teacher.value);
    let channelteacher:any[] =[];
    let finishqueueTeacher:any[] = [];

    let ct:any[] = [];
    teacher.value.forEach((value)=>{
      if (ct.includes(value.channel) ===  undefined || ct.includes(value.channel) === false ) {
        ct.push(`ช่องบริการที่ ${value.channel}`);
        // console.log(ct);
      }
    });

    channelteacher = ct;
    
    // console.log('finish : ',finish);

    finish.forEach((value)=>{
      finishqueueTeacher[value.channel-1] = finish.filter((values)=>{
        return values.channel === value.channel; 
      }).length;
    })

    // console.log(finishqueueTeacher);

    chartData.value = [
      {
        type: Charttype.Bar,
        title: "คะแนน เฉลี่ย ",
        labels: [
          "แบบคำขอกู้ยืมเงิน",
          "สัญญากู้ยืมเงิน",
          "ประเภทอื่น ๆ",
        ],
        datasets: [
          {
            data: [rateone, ratetwo, ratethree],
            label: "",
            backgroundColor: ["#191770","red","black"],
          },
        ],
      },
      {
        type: Charttype.Doughnut,
        title: `คิวของวันนี้ ${queueToday.value.length} คิว`,
        labels: ["Finish", "Not Finish"],
        datasets: [
          {
            data: [finish.length, notFinish.length],
            label: "",
            backgroundColor: ["#191770", "red"],
          },
        ],
      },
      {
        type: Charttype.Line,
        title: `คิวของวันนี้ ${queueToday.value.length} คิว`,
        labels: [
          ` 08:00`,
          ` 09:00`,
          ` 10:00`,
          ` 11:00`,
          ` 12:00`,
          ` 13:00`,
          ` 14:00`,
          ` 15:00`,
          ` 16:00`,
        ],
        datasets: [
          {
            data: hourCounts,
            label: `${today.toDateString()}`,
            backgroundColor: ["#191770"],
          },
        ],
        chartOption: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "เวลา",
              },
            },
            y: {
              title: {
                display: true,
                text: "ความยาวของคิว",
              },
              beginAtZero: true,
            },
          },
        },
      },
      {
        type: Charttype.Pie,
        title: "คิวที่เสร็จสิ้น",
        labels: channelteacher,
        datasets: [
          {
            data: finishqueueTeacher,
            label: "คิวที่สำเร็จ",
            backgroundColor: ["#191770","red","#4175DF"],
          },
        ],
      },
    ];

    loading.value = false;
    // console.log(loading.value);
  } catch (error) {
    console.error(error);
  }
}

async function getAllteacher() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/users/getAlluser`
    );
    if (res.status !== 200) {
      throw Error(res.statusText)
    }
    teacher.value = res.data.filter((value:User)=>{
      return value.role === "TEACHER";
    });

  } catch (error) {
    console.error(error);
  }
}

// Function to filter data by hour and count its length
function filterDataByHour(hour: number, data: History[]): number {
  const filteredData = data.filter((entry) => {
    const entryDate = new Date(entry.datetime);
    return entryDate.getHours() === hour;
  });
  return filteredData.length;
}

let inter = setInterval(() => {
  getAllQueue();
  getAllteacher();
}, timer);

onMounted(getAllteacher);
onMounted(getAllQueue);
</script>

<style lang="scss" scoped>
.main-wrapper {
  height: calc(100vh - 11.5rem);
  main {
    overflow: scroll;
    padding: 1rem;
    margin: 1rem 0 0rem 0;
    
  }
}
</style>
