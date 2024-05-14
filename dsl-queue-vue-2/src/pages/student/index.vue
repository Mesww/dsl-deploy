<template>
  <div class="h-screen w-screen screen">
    <navbar />
    <div class="flex justify-between">
      <v-img class="arrow" alt="Arrow" src="../../assets/Arrow1.png" />
      <div class="element-wrapper">
        <v-img
          id="popupTrigger"
          class="element"
          alt="Element"
          src="../../assets/DSL-01.png"
          @click="popUp"
        />
      </div>
      <v-img class="img" alt="Arrow" src="../../assets/Arrow2.png"></v-img>
    </div>
    <div class="text-wrapper-3 text-center">กดจองคิว</div>
    <div></div>
    <div class="flex justify-end">
      <logoutbutton />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
import logoutbutton from "../../components/student/index.logout.button.vue";
import navbar from "../../components/student/index.navbar.vue";
import Swal from "sweetalert2";
import axios from "axios";
import router from "@/router";
import { comment } from "postcss";
async function popUp() {
  const { value: selects } = await Swal.fire({
    title: "ยื่นยันคำขอ",
    reverseButtons: true,
    input: "select",
    inputOptions: {
      ONE: "แบบคำขอกู้ยืมเงิน",
      TWO: "สัญญากู้ยืมเงิน หรือ แบบยืนยันการเบิกเงินกู้ยืม",
      OTHER: "ประเภทอื่น ๆ",
    },
    color: "#191771",
    confirmButtonColor: "#191771",
    cancelButtonColor: "#ED1C24",
    confirmButtonText: "ยืนยัน!",
    cancelButtonText: "ยกเลิก",
    inputPlaceholder: "โปรดเลือกการบริการ",
    showCancelButton: true,
    inputValidator: (value: string) => {
      return new Promise((resolve) => {
        if (value.match("ONE") || value.match("TWO") || value.match("OTHER")) {
          resolve();
        } else {
          resolve("ได้โปรดเลือกการบริการ :)");
        }
      });
    },
  });

  if (selects) {
    console.log(selects);
    await createQueue(selects);
  }
}





async function createHistory(queue: {
  studentid: string;
  type: string;
  orders: number;
  queueid: number;
}) {
  try {
    const response = await axios.post(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/history/getHistoryCreate`,
      {
        studentid: queue.studentid,
        type: queue.type,
        rate: 0,
        channel: 0,
        orders: queue.orders,
        comment: "",
        status: "WAIT",
        queueid: queue.queueid,
      }
    );
    if (response.status !== 200) {
      throw Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}

async function createQueue(selects: string) {
  const accesstoken = cookies.get("accesstoken");
  const access_token_extract = parseJwt(accesstoken);
  const studentID = access_token_extract.email.split("@")[0];
  console.log(selects + studentID);
  try {
    const response = await axios.post(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getqueueaddQueue`,
      {
        type: selects,
        studentID: studentID,
      }
    );
    console.log(response);
    if (response.status === 200) {
      console.log(response.data);
      console.log("CREATED");
      await createHistory({
        studentid: studentID,
        type: selects,
        orders: response.data.orders,
        queueid:response.data.queueid
      });
      router.push({ name: "studentmain", replace: true });
    } else {
      throw Error("Connection error");
    }
  } catch (error) {
    console.error(error);
  }
}

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
</script>

<style lang="scss" scoped>
.screen {
  background-color: #191770;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  display: grid;
  align-content: space-between;
}

.screen .group {
  height: 161px;
  left: 50%;
  transform: translateX(-42%);
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 430px;
}

.screen .overlap {
  height: 161px;
  left: 50%;
  transform: translateX(-43%);
  position: relative;
  width: 100%;
  width: 430px;
}

.screen .overlap-group-wrapper {
  height: 161px;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  width: 430px;
}

.screen .overlap-group {
  height: 161px;
  position: relative;
}

.screen .rectangle {
  background-color: #ffffff;
  border-radius: 40px;
  height: 100px;
  left: 2;
  position: absolute;
  top: 90px;
  width: 100%;
  max-width: 430px;
}

.screen .rectangle-2 {
  background-color: #ffffff;
  height: 130px;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 430px;
}

.screen .text-wrapper {
  color: #191770;
  font-family: "Inter-Bold", Helvetica;
  font-size: 48px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
}

.screen .text-wrapper-2 {
  color: #ed1c24;
  font-family: "Inter-Bold", Helvetica;
  font-size: 20px;
  font-weight: 700;
  left: 30%;
  transform: translateX(-40%);
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  text-align: center;
  top: 100px;
}

.screen .element-wrapper {
  display: grid;
  align-content: center;
  align-items: center;
  align-self: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 100%;
  box-shadow: 0px 4px 4px #00000040, inset 0px 4px 4px #00000040;
  height: 196px;
  width: 196px;
}

.screen .element {
  height: 109px;
  object-fit: cover;
  width: 250px;
  height: 150px;
}

.screen .text-wrapper-3 {
  color: #ffffff;
  font-family: "Inter-Bold", Helvetica;
  font-size: 50px;
  font-weight: 700;
}

.screen .arrow {
  margin-top: auto;
  margin-bottom: auto;
  height: 29px;
  left: 0%;
  width: 84px;
}

.v-responsive {
  flex: none;
}

.screen .img {
  margin-top: auto;
  margin-bottom: auto;
  height: 29px;
  right: 0%;
  width: 96px;
}

@media screen and (min-width: 500px) {
  .screen .element-wrapper {
    width: 300px;
    height: 300px;
    border-radius: 100%;
    .element {
      width: 300px;
      height: 250px;
    }
  }
  .screen .text-wrapper-3 {
    font-size: 60px;
  }
}

@media screen and (max-width: 370px) {
  .screen .element-wrapper {
    width: 150px;
    height: 150px;
    border-radius: 100%;
    .element {
      width: 125px;
      height: 80px;
    }
  }
  .screen .text-wrapper-3 {
    font-size: 40px;
  }
}

.logoutbutton {
  background-color: #ed1c24;
  border-radius: 1.5rem;
  margin-bottom: 1.5rem;
  margin-right: 1.5rem;
}
</style>
