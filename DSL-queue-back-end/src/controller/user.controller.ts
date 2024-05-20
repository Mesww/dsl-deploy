// ! used for catch error
const asynchandler = require("express-async-handler");

import { $Enums } from "@prisma/client";
import {
  getUser,
  addUser,
  getSpecificuser,
  editSpecificuser,
} from "../service/user";

module.exports.userlist = asynchandler(async (req: any, res: any) => {
  const user = await getUser();
  res.send(user);
});

export const useraddUser = asynchandler(async (req: any, res: any) => {
  const { studentid, email, name, role, channel, emailVerified } = req.body;
  const getuseraddUser = await addUser({
    studentid: studentid,
    email: email,
    name: name,
    role: role,
    channel: channel,
    emailVerified: emailVerified,
  });
  res.status(200).send(getuseraddUser);
});

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// ! rand studentid
async function randomstudentid(studentid: string, email: string) {
  console.log(studentid);
  const is_include =
    (await getSpecificuser({ studentid: studentid, email: email })) !== null;
  let studentids = `${getRandomInt(100000000000)}`;
  console.log(`studentid : ${studentid}`);
  console.log(`studentids : ${studentids}`);
  console.log(`studentid is include in database : ` + is_include);
  if (is_include) {
    return await randomstudentid(studentids, email);
  } else {
    return studentids;
  }
}

export const addTeacher = asynchandler(async (req: any, res: any) => {
  const { email, channel } = req.body;
  const is_include = await getSpecificuser({ email: email });
  if (is_include !== null) {
    if (is_include.role === "ADMIN") {
      // !if teacher is admin self
      const edituser = await editSpecificuser({
        email: email,
        data: {
          channel: channel,
        },
      });
      return res.status(200).send(edituser);
    }
    const edituser = await editSpecificuser({
      email: email,
      data: {
        channel: channel,
        role: "TEACHER",
      },
    });
    res.status(200).send(edituser);
  } else {
    const studentid = await randomstudentid("0",email); 
    const adduser = await addUser({
      email: email,
      channel: channel,
      name: "",
      role: "TEACHER",
      studentid: studentid,
    });
    res.status(200).send(adduser)
  }
});

export const usergetSpecificuser = asynchandler(async (req: any, res: any) => {
  const { email, studentid } = req.query;
  const getusergetSpecificuser = await getSpecificuser({
    email: email,
    studentid: studentid,
  });
  res.status(200).send(getusergetSpecificuser);
});

export const usereditSpecificuser = asynchandler(async (req: any, res: any) => {
  const { email, data } = req.body;
  const getusereditSpecificuser = await editSpecificuser({
    email: email,
    data: data,
  });
  res.status(200).send(getusereditSpecificuser);
});
