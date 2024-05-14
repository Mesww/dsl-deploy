<script lang="ts" setup>
import { onMounted, ref } from "vue";
import navbars from "../../components/student/satisfaction.navbar.vue";
import Swal from "sweetalert2";
import axios from "axios";

import { useCookies } from "vue3-cookies";
import router from "@/router";

const { cookies } = useCookies();

const accesstoken = cookies.get("accesstoken");
const access_token_extract = parseJwt(accesstoken);
const studentID = access_token_extract.email.split("@")[0];
let myqueues = ref([]);

let selectedValue = ref([
  { Question: "โปรดให้คะแนนความพึงพอใจการให้บริการ", value: 5 },
]);

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

async function getMyqueue() {
  try {
    const res = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getQueueSpecific?studentID=${studentID}`
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    myqueues.value = res.data[0];
    console.log(myqueues.value);
  } catch (error) {
    console.error(error);
  }
}

async function submit() {
  // console.log('test');
  console.log(selectedValue.value);
  await Swal.fire({
    icon: "success",
    title: "ขอบคุณที่มาใช้บริการ",
    showConfirmButton: false,
    timer: 1500,
  });
  await updateHistory(myqueues.value.queueid,selectedValue.value[0].value);
  try {
    const res = await axios.delete(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueuedeleteQueue?queueid=${myqueues.value.queueid}`
    );
    if (res.status !== 200) {
      // navigateTo("/student/", { replace: true });
      throw Error(res.statusText);
    }
    router.push({ name: "student", replace: true });
  } catch (error) {
    console.error(error);
  }
}

async function updateHistory(queueid:number,rate:number) {
  try {
    const res= await axios.put(`http://localhost:${process.env.VUE_APP_BACK_PORT}/history/getHistoryUpdate`,{
      queueid:queueid,
      rate:rate
    })
    if ( res.status !== 200) {
      throw Error(res.statusText)
    }
  } catch (error) {
    console.error(error);
  }
};
onMounted(getMyqueue);
</script>

<template>
  <div class="bg">
    <navbars />
    <div class="raiting flex flex-col justify-center items-center">
      <div
        class="flex justify-center"
        v-for="(question, index) in selectedValue"
        :key="index"
      >
        <div class="rounded-md bg-white box mt-5 p-5 d-flex">
          <div>
            <p> {{ question.Question }}</p>
            <div class="flex justify-between">
              <div>
                <v-icon v-for="n in 5" :key="n" @click="question.value = n" :color="n <= question.value ? 'yellow' : 'main'">mdi-star</v-icon>
              </div>
              <p>{{ selectedValue[index].value }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center my-5">
        <v-btn
          rounded="xl"
          class="submitButton"
          icon="i-heroicons-arrow-right-circle-16-solid"
          @click="submit"
          >Submit</v-btn
        >
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.bg {
  background-color: #191771;
  height: 100vh;
  overflow: scroll;
}
.submitButton {
  background-color: #f1f5f9;
  color: #191771;
  display: flex;
  justify-content: center;
  width: 80vw;
}
.submitButton:hover {
  background-color: #ed1c24;
  color: #f1f5f9;
  overflow: hidden;
}

.box {
  width: 80vw;
  color: #191771;
  border-radius: 1.5rem;
  .range {
    margin-top: auto;
    margin-bottom: auto;
    width: 60vw;
  }
}
</style>
