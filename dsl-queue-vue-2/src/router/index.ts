import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import StudentView from "../pages/student/index.vue";
import LoginView from "../pages/login/index.vue";
import AdminView from "../pages/admin/index.vue";
import TeacherView from "../pages/teacher/index.vue";
import TeacherHome from "../pages/teacher/home.vue";
import TeacherDashboard from "../pages/teacher/dashboard.vue";
import StudentMain from "../pages/student/main.vue";
import StudentSatisfaction from "../pages/student/satisfaction.vue";
import AdminHome from "../pages/admin/home.vue";
import AdminHistory from "../pages/admin/history.vue";
import AdminConfig from "../pages/admin/config.vue";
import AdminScore from '../pages/admin/score.vue';

import axios from "axios";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "root", component: LoginView },
  { path: "/student", name: "student", component: StudentView },
  { path: "/student/main", name: "studentmain", component: StudentMain },
  {
    path: "/student/statisfaction",
    name: "studentstatisfaction",
    component: StudentSatisfaction,
  },

  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    children: [
      {
        path: "/admin/home",
        name: "adminhome",
        component: AdminHome,
      },
      {
        path: "/admin/history",
        name: "adminhistory",
        component: AdminHistory,
      },
      {
        path: "/admin/config",
        name: "adminconfig",
        component: AdminConfig,
      },
      {
        path: "/admin/score",
        name: "adminscore",
        component: AdminScore,
      },
    ],
  },
  {
    path: "/teacher",
    name: "teacher",
    component: TeacherView,
    children: [
      {
        path: "/teacher/home",
        name: "teacherhome",
        component: TeacherHome,
      },
      {
        path: "/teacher/dashboard",
        name: "teacherdashboard",
        component: TeacherDashboard,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

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
async function refeshToken(refresh: string) {
  try {
    const res = await axios.post(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/login/refresh`,
      null,
      {
        headers: {
          Authorization: `Bearer ${refresh}`,
        },
      }
    );
    if (res.status !== 200) {
      throw Error(res.statusText);
    }
    const token = res.data;
    cookies.remove("accesstoken");
    cookies.remove("refreshtoken");

    cookies.set("accesstoken", token.access_token);
    cookies.set("refreshtoken", token.refresh_token);
  } catch (error) {
    console.error(error);
  }
}

async function isAuthenticated() {
  // ! get token from cookies
  const accesstoken = cookies.get("accesstoken");
  const refreshtoken = cookies.get("refreshtoken");

  // console.log("accesstoken: ", accesstoken);
  // ! check if cookies haven't accesstoken
  if (
    accesstoken === undefined ||
    accesstoken === null ||
    refeshToken === undefined ||
    refeshToken === null
  ) {
    // console.log("test");
    return false;
  }
  // ! parseJwt from cookies
  const jwtPayload = parseJwt(accesstoken);
  // console.log(jwtPayload.exp, ` Time :  ${Date.now() / 1000}`);
  // ! check accesstoken is expired
  if (jwtPayload.exp < Date.now() / 1000) {
    // token expired
    console.log("expried");
    // console.log(refreshtoken);
    await refeshToken(refreshtoken);
    return false;
  }

  return true;
}

async function isReserve() {
  const accesstoken = cookies.get("accesstoken");
  const access_token_extract = parseJwt(accesstoken);
  const studentid = access_token_extract.email.split("@")[0];
  try {
    const userqueue = await axios.get(
      `http://localhost:${process.env.VUE_APP_BACK_PORT}/queue/getQueueSpecific?studentID=${studentid}`
    );
    if (userqueue.status !== 200) {
      throw Error(userqueue.statusText);
    }

    // console.log(userqueue.data);

    if (
      userqueue.data === null ||
      userqueue.data === undefined ||
      userqueue.data.length < 1
    ) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
  }
}

function isRole(role: string) {
  const accesstoken = cookies.get("accesstoken");
  const access_token_extract = parseJwt(accesstoken);
  // console.log(access_token_extract.role);
  if (access_token_extract.role === role) {
    return true;
  }
  return false;
}



router.beforeEach(async (to, from, next) => {

  console.log("isAuthen", await isAuthenticated());
  const isAuth = await isAuthenticated();
  // ! check if path isn't "/" and authenticated
  if (to.name !== "root" && isAuth === false) {
    console.log("unauthenticated");
    // ! redirect to "/"
    next({ name: "root" });
  } else if (isAuth) {
    console.log("authenticated");

    if (to.name === "admin" && isRole("ADMIN") === false) {
      console.log("you aren't admin");

      cookies.remove("accesstoken");
      cookies.remove("refreshtoken");

      console.log("GET OUT!");

      next({ name: "root" });
    } else if (to.name === "teacher" && isRole("TEACHER") === false) {
      console.log("you aren't teacher");
      next({ name: "root" });
    } else if (
      (await isReserve()) === true &&
      to.name !== "studentmain" &&
      to.name !== "studentstatisfaction"
    ) {
      console.log("you reserved");
      next({ name: "studentmain" });
    } else if (to.name === "studentmain" && (await isReserve()) === false) {
      console.log("you aren't reserve");
      next({ name: "student" });
    } else if (
      to.name === "studentstatisfaction" &&
      (await isReserve()) === false
    ) {
      console.log("you aren't reserve");
      next({ name: "student" });
    }
  }
  console.log("unauthenticated");
  next();
});

export default router;
