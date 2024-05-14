<template>
  <v-card  v-if="props.data.type === Charttype.Bar " height="500"   width="500">
    <template v-slot:title>
      <span class="font-weight-black">{{props.data.title}}</span>
    </template>
    <template v-slot:text>
      <Bar
      :id="$props.data.title"
      :options="$props.data.chartOption === undefined? chartOptions : $props.data.chartOption "
      :data="props.data"
    />  
    </template>
  </v-card>
  <v-card  v-if="props.data.type === Charttype.Doughnut"  height="500"  width="500">
    <template v-slot:title>
      <span class="font-weight-black">{{props.data.title}}</span>
    </template>
    <template v-slot:text>
      <Doughnut
      :id="$props.data.title"
      :options="$props.data.chartOption === undefined? chartOptions : $props.data.chartOption "
      :data="props.data"
    />  
    </template>
  </v-card>
  <v-card  v-if="props.data.type === Charttype.Line" height="500"   width="500">
    <template v-slot:title>
      <span class="font-weight-black">{{props.data.title}}</span>
    </template>
    <template v-slot:text>
      <Line
      :id="$props.data.title"
      :options="$props.data.chartOption === undefined? chartOptions : $props.data.chartOption "
      :data="props.data"
    />  
    </template>
  </v-card>
  <v-card  v-if="props.data.type === Charttype.Pie"  height="500"  width="500">
    <template v-slot:title>
      <span class="font-weight-black">{{props.data.title}}</span>
    </template>
    <template v-slot:text>
      <Pie
      :id="$props.data.title"
      :options="$props.data.chartOption === undefined? chartOptions : $props.data.chartOption "
      :data="props.data"
    />  
    </template>
  </v-card>


</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Bar,
  Bubble,
  Doughnut,
  Line,
  Pie,
  PolarArea,
  Radar,
  Scatter,
} from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
  
} from "chart.js";
import { ChartData,Charttype } from '../../models/Chart';
ChartJS.register(Title, Tooltip, Legend, BarElement,ArcElement, CategoryScale,TimeScale, LinearScale,PointElement,LineElement);
const props = defineProps({
  data: { type: Object as () => ChartData, required: true },
  cardColor: {type:String},
  chartOptions:{type:Object}
});



const chartOptions = {
  responsive: true,
};
</script>

<style scoped></style>
