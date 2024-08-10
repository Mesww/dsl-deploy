<template>
  <div class="flex justify-center w-screen main-wrapper">
    <Loading :is-loading="loading"/>
    <main class="grid items-center justify-items-center grid-cols-2 gap-2" v-if="!loading">
      <cards v-if="loading === false" card-color="white" :data="rateChart" />
      <cards v-if="loading === false" card-color="white" :data="countChart" />
      <cards v-if="loading === false" card-color="white" :data="countChartbyHour" /> 
      <cards v-if="loading === false" card-color="white" :data="countChartByChannel" /> 
    </main>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import cards from "../../components/admin/home.content.vue";
import {
  ChartData,
  Charttype,
  Countdata,
  CountdatabyChannel,
  CountdatabyHour,
  Ratedata,
} from "../../models/Chart";
// import { Queue } from '../../models/Queue';
import { History } from "../../models/History";
import { User } from "../../models/User";
import { onMounted, Ref, ref } from "vue";
import Loading from '../../components/loading/loading.vue';
let loading = ref(true);
let rateData: Ref<Ratedata[]> = ref([]);
let rateChart: Ref<ChartData> = ref({
  type: Charttype.Bar,
  title: "คะแนนเฉลี่ย",
  labels: ["แบบคำขอกู้ยืมเงิน", "สัญญากู้ยืมเงิน", "ประเภทอื่น ๆ"],
  datasets: [
    {
      data: [],
      label: "คะแนนเฉลี่ย",
      backgroundColor: ["#191770", "red", "black"],
    },
  ],
});
let countData: Ref<Countdata> = ref({
  finishedCount: 0,
  notFinishedCount: 0,
  allQueuesCount: 0,
});
let countChart: Ref<ChartData> = ref({
  type: Charttype.Doughnut,
  title: `คิวของวันนี้ 0 คิว`,
  labels: ["Finish", "Not Finish"],
  datasets: [
    {
      data: [0, 0],
      label: "",
      backgroundColor: ["#191770", "red"],
    },
  ],
  chartOption: {
    responsive: true,
  },
});
let countDatabyHour: Ref<CountdatabyHour[]> = ref([
  {
    hour: "08:00",
    count: 0,
  },
  {
    hour: "09:00",
    count: 0,
  },
  {
    hour: "10:00",
    count: 0,
  },
  {
    hour: "11:00",
    count: 0,
  },
  {
    hour: "12:00",
    count: 0,
  },
  {
    hour: "13:00",
    count: 0,
  },
  {
    hour: "14:00",
    count: 0,
  },
  {
    hour: "15:00",
    count: 0,
  },
  {
    hour: "16:00",
    count: 0,
  },
]);
let countChartbyHour: Ref<ChartData> = ref({
  type: Charttype.Line,
  title: `คิวของวันนี้ 0 คิว`,
  labels: [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: "คิว",
      backgroundColor: ["#191770", "red", "black"],
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
});
let countDataByChannel: Ref<CountdatabyChannel[]> = ref([]);
let countChartByChannel: Ref<ChartData> = ref({
        type: Charttype.Pie,
        title: "คิวที่เสร็จสิ้น",
        labels: [],
        datasets: [
          {
            data: [],
            label: "คิวที่สำเร็จ",
            backgroundColor: ["#191770","red","#4175DF"],
          },
        ],
      },)
let timer = 10000;

async function getScore() {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_IP}/history/getHistoryStatsByType`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    rateData.value = res.data;
    rateChart.value.subtitle = `${rateData.value}`;
    rateChart.value.datasets[0].data = rateData.value.map((value: Ratedata) => {
      return value.averageRate;
    });
    // console.log(rateData.value);
  } catch (error) {
    console.error(error);
  }
}
async function getQueuecount() {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_IP}/history/getHistoryCounttoday`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    countData.value = res.data;
    // console.log(countData.value.finishedCount +" "+ countData.value.notFinishedCount);
    countChart.value.title = `คิวของวันนี้ ${countData.value.allQueuesCount} คิว`;
    countChart.value = {
      ...countChart.value,
      datasets: [
        {
          ...countChart.value.datasets[0],
          data: [
            Math.max(0, countData.value.finishedCount),
            Math.max(0, countData.value.notFinishedCount),
          ],
        },
      ],
    };

    console.log(countChart.value.datasets[0].data);
  } catch (error) {
    console.error(error);
  }
}
async function getQueuecountbyHour() {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_IP}/history/getHistoryCountbyHour`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    countDatabyHour.value = res.data;
    // console.log(countData.value.finishedCount +" "+ countData.value.notFinishedCount);
    countChartbyHour.value.title = `คิวของวันนี้ ${countData.value.allQueuesCount} คิว`;
    countChartbyHour.value = {
      ...countChartbyHour.value,
      datasets: [
        {
          ...countChartbyHour.value.datasets[0],
          data: countDatabyHour.value.map((value) => {
            return value.count;
          }),
        },
      ],
    };

    console.log(countChart.value.datasets[0].data);
  } catch (error) {
    console.error(error);
  }
}
async function getQueuecountbyChannel() {
  try {
    const res = await axios.get(
      `${process.env.VUE_APP_IP}/history/getHistoryCountbyChannel`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    console.log(res.data);
    countDataByChannel.value = res.data;
    // console.log(countData.value.finishedCount +" "+ countData.value.notFinishedCount);
    countChartByChannel.value.title = `คิวของวันนี้ที่สำเร็จ ${countData.value.finishedCount} คิว`;
    countChartByChannel.value = {
      ...countChartByChannel.value,
      labels: countDataByChannel.value.map((value) => {
        return `Channel : ${value.channel}`;
      }),
      datasets: [
        {
          ...countChartByChannel.value.datasets[0],
          data: countDataByChannel.value.map((value) => {
            return value.count;
          }),
        },
      ],
    };

    console.log(countChart.value.datasets[0].data);
  } catch (error) {
    console.error(error);
  }
}



let inter = setInterval(() => {
  fetchData();
}, timer);
// getAllQueue();
async function fetchData() {
  await Promise.all([getScore(), getQueuecount(), getQueuecountbyHour(),
  getQueuecountbyChannel()]);
  loading.value = false;
}

onMounted(fetchData);
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
