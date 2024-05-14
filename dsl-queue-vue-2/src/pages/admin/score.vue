<template lang="">
  <div class="app">
    <main>
      <div class="flex justify-center">
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
        <button class="btn" @click="filterByType('ALL')">
          ทั้งหมด
        </button>
        <button class="btn" @click="filterByType('แบบคำขอกู้ยืมเงิน')">
          แบบคำขอกู้ยืมเงิน
        </button>
        <button class="btn" @click="filterByType('สัญญากู้ยืมเงิน หรือ แบบยืนยันการเบิกเงินกู้ยืม')">
          สัญญากู้ยืมเงิน
        </button>
        <button class="btn" @click="filterByType('ประเภทอื่น ๆ')">
          ประเภทอื่น ๆ
        </button>
      </div>
      <div class="flex justify-end text-white">
        <v-date-input
          v-model="date"
          label="เลือกวันที่"
          max-width="368"
          multiple="range"
          @input="filterByDateRange"
          style="color: white"
        ></v-date-input>
      </div>
      <!-- ตารางข้อมูล -->
      <v-data-table
        :headers="column"
        :items="filteredHistory"
        :search="search"
        class="custom-table"
      ></v-data-table>
      <v-btn color="red" @click="exportToCSV">Download</v-btn>
    </main>
  </div>
</template>
<script lang="ts" setup>
import axios, { all } from "axios";
import { ref, computed, shallowRef } from "vue";
let history = ref([]);
let search = ref("");
let date = shallowRef<string | string[]>();

const column = ref([
  {
    key: "datetime",
    title: "วันเวลา",
    align: "center",
  },
  {
    key: "type",
    title: "งานบริการ",
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
    console.log(res.data);
    history.value = res.data;
    history.value.forEach((value) => {
      value.type = convertType(value.type);
      value.datetime = `${new Date(value.datetime).toDateString()} ${
        new Date(value.datetime).toTimeString().split(" ")[0]
      }  `;
    });
    history.value = history.value.filter((value) => {
      return value.status === "FINISH";
    });
    // ! backup history
    allhistory.value = history.value; 
  } catch (error) {
    console.error(error);
  }
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
  const csvContent = convertToCSV(history.value);
  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "data.csv";
  link.click();
}



function convertToCSV(rows: any[]) {
  const selectedFields = rows.map((row) => ({
    วันเวลา: row.datetime,
    งานบริการ: row.type,
    คะแนน: row.rate,
  }));

  const header = Object.keys(selectedFields[0]).join(",");
  // const content = rows.map((row) => Object.values(row).join(",")).join("\n");
  const content = rows
    .map((row) => {
      return [row.datetime, `"${row.type}"`, row.rate].join(",");
    })
    .join("\n");
  return `${header}\n${content}`;
}
let filteredHistory = computed(() => {
  if (!date.value) return history.value;

  let filtered = history.value;

  // Filter by date range
  if (date.value) {
    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.datetime);
      const date_ = date.value;

      if (date_?.length > 1) {
        return (
          entryDate >= new Date(date_[0]) &&
          entryDate <= new Date(date_[date_?.length - 1])
        );
      } else {
        return (
          entryDate.toString().split(" ")[0] ===
          new Date(date_[0]).toString().split(" ")[0]
        );
      }
    });
  }


  return filtered;
});


function filterByType(type: string) {
  switch (type) {
    case 'ALL':
      history.value = allhistory.value; // Restore all history
      break;
    default:
      history.value = allhistory.value.filter(entry => entry.type === type);
  }
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
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-around;
}

.btn {
  background-color: #191771;
  color: #f1f5f9;
  border-radius: 2rem;
  padding: 10px 20px;
  margin-right: 1rem;
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
