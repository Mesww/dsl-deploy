<template lang="">
  <div class="app">
    <main>
      <div class="flex">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          class=" "
          style="color: white"
          variant="underlined"
          color="white"
          hide-details
          single-line
        ></v-text-field>
      </div>
      <div class="abutton text-white">
        <!-- <button class="btn" @click="getAllhistory">
          รายการผู้รับบริการทั้งหมด
        </button> -->
        <!-- <button class="btn" @click="getHistoryMonth">
          รายการผู้รับบริการ (เดือนนี้)
        </button>
        <button class="btn" @click="getHistoryToday">
          รายการผู้รับบริการ (วันนี้)
        </button> -->

        <v-date-input
          v-model="date"
          label="เลือกวันที่"
          max-width="368"
          multiple="range"
          @input="filterByDateRange"
        ></v-date-input>
      </div>
      <!-- ตารางข้อมูล -->

      <v-data-table
        :headers="column"
        :items="filteredHistory"
        :search="search"
        class="custom-table mr-52"
      ></v-data-table>
      <v-btn color="red" @click="exportToCSV">Download</v-btn>
    </main>
  </div>
</template>
<script lang="ts" setup>
import axios, { all } from "axios";
import { ref, computed,shallowRef } from "vue";
let history = ref([]);
let search = ref("");
let menu = ref(false);
let selectedDate = ref(null);
let date = shallowRef<string | string[]>();

const column = ref([
  {
    key: "datetime",
    title: "วันเวลา",
    align: "center",
  },
  {
    key: "studentid",
    title: "รหัสนักศึกษา",
    align: "center",
  },
  {
    key: "type",
    title: "งานบริการ",
    align: "center",
  },
  { key: "status", title: "สถานะ", align: "center" },
  {
    key: "channel",
    title: "ช่องบริการ",
    align: "center",
  },
  {
    key: "rate",
    title: "คะแนน",
    align: "center",
  },
]);
get_History();

let allhistory = ref([]);

async function get_History() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/history/getHistory`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    // console.log(res.data);
    history.value = res.data;
    history.value.forEach((value) => {
      value.type = convertType(value.type);
      value.datetime = `${new Date(value.datetime).toDateString()} ${
        new Date(value.datetime).toTimeString().split(" ")[0]
      }  `;
    });
    // ! backup history
    allhistory.value = history.value;
  } catch (error) {
    console.error(error);
  }
}

import { format } from "date-fns";

async function getHistoryToday() {
  const today = new Date();
  const todayString = format(today, "yyyy-MM-dd");

  // Filter the existing history array to get entries for today
  const todayHistory = history.value.filter((entry) => {
    const entryDate = new Date(entry.datetime);
    const entryDateString = format(entryDate, "yyyy-MM-dd");
    return entryDateString === todayString;
  });
  // console.log(todayHistory);
  // Update the history array with today's entries
  history.value = todayHistory;
}
function convertType(type: string): string {
  switch (type) {
    case "ONE":
      return "แบบคำขอกู้ยืมเงิน";
    case "TWO":
      return "สัญญากู้ยืมเงิน หรือ แบบยืนยันการเบิกเงินกู้ยืม";
    default:
      return "ประเภทอื่น ๆ";
  }
}

function exportToCSV() {
  const csvContent = convertToCSV(filteredHistory.value);
  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "data.csv";
  link.click();
}

async function getAllhistory() {
  history.value = allhistory.value;

  // console.log(history.value);
}



const filterByDateRange = () => {
  const [startDate, endDate] = date.value;
  if (startDate && endDate) {
    const filtered = history.value.filter((entry) => {
      const entryDate = new Date(entry.datetime);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });
    history.value = filtered;
  } else {
    getAllhistory();
  }
};

let filteredHistory = computed(() => {
  if (!date.value) return history.value;
  return history.value.filter((entry) => {
    const entryDate = new Date(entry.datetime);
    // console.log("entryDate ",entryDate);
    const date_ = date.value;
    // console.log("date ",date.value);
    if (date_?.length > 1 ) {
      return entryDate >= new Date(date_[0]) && entryDate <= new Date(date_[date_?.length-1]);
    }else{
      // console.log(entryDate === new Date(date_[0]));
      return entryDate.toString().split(" ")[0] === new Date(date_[0]).toString().split(" ")[0];
    }
  });
});

// async function getHistoryMonth() {
//   const today = new Date();
//   const currentMonth = today.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month index
//   const currentYear = today.getFullYear();
//   const currentMonthString = `${currentYear}-${currentMonth
//     .toString()
//     .padStart(2, "0")}`; // Format: "YYYY-MM"

//   // Filter the existing history array to get entries for the current month
//   const currentMonthHistory = allhistory.value.filter((entry) => {
//     const entryDate = new Date(entry.datetime);
//     const entryMonth = entryDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month index
//     const entryYear = entryDate.getFullYear();
//     const entryMonthString = `${entryYear}-${entryMonth
//       .toString()
//       .padStart(2, "0")}`;
//     return entryMonthString === currentMonthString;
//   });

//   // Update the history array with entries for the current month
//   history.value = currentMonthHistory;
//   // console.log(history.value);
// }

function convertToCSV(rows: any[]) {
  const selectedFields = rows.map(row => ({
      'วันเวลา': row.datetime,
      'รหัสนักศึกษา': row.studentid,
      'งานบริการ': row.type,
      'ช่องบริการ':row.channel,
      'คะแนน': row.rate,
    }));

  const header = Object.keys(selectedFields[0]).join(",");
  const content = rows.map(row => {
    return [ row.datetime,`"${row.studentid}"`, `"${row.type}"`,`"${row.channel}"`,row.rate].join(",");
  }).join("\n");
  return `${header}\n${content}`;
}
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Fira sans", sans-serif;
}

body {
  background: #f1f5f9;
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.dp__input_wrap {
  width: 5rem;
}
.app {
  width: 100vw;
  padding: 1rem 15vw 1rem 15vw;
}

.custom-table {
  box-shadow: 0 4px 8px #4175df; /* Add box shadow */
  border-collapse: collapse;
  height: 29.5rem;
  overflow-y: scroll;
  thead {
    background-color: #f1f5f9;
    th {
      color: #191771;
    }
  }
  th,
  td {
    text-align: center;
  }
  tbody {
    background-color: #f1f5f9;
    td {
      color: #191771;
    }
  }
  tbody :hover {
    background-color: #4175df;
    td {
      color: #f1f5f9;
    }
  }
}

.search {
  margin-bottom: 0.5rem;
  background-color: #f1f5f9;
  color: #191771;
}

.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.abutton {
  // margin-bottom: 0.5rem;
  padding: 5px;
  display: flex;
  justify-content: end;
}

.btn {
  background-color: #191771;
  color: #f1f5f9;
  border-radius: 2rem;
  padding: 10px 10px;
  margin-right: 2rem;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background-color: red;
  color: #f1f5f9;
}

.last-row {
  background-color: #333;
  color: #fff;
}

.result-info {
  margin-right: auto;
}

.pagination {
  margin-left: auto;
}

.page {
  margin: 0 0.5rem;
  cursor: pointer;
}

.page:hover {
  text-decoration: underline;
}
</style>
