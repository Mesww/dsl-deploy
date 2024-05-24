// ! used for catch error
const asynchandler = require("express-async-handler");

import { isAwaitKeyword } from "typescript";
import { auth } from "../service/auth";
import { genToken } from "../service/token";

import { addUser, getSpecificuser, editSpecificuser } from "../service/user";

//! rand num
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

export const testrandomstudenid = asynchandler(async (req: any, res: any) => {
  const studentid = await randomstudentid("0", "khumnoiw@gmail.com");

  res.status(200).json({ message: studentid });
});

// ! autheication function
export const googleauth = asynchandler(
  async (req: { headers: { authorization: any } }, res: any) => {
   
    const code = req.headers.authorization;
    // console.log(typeof code);
    console.log("Authorization Code:", code);
    // ! authen
    const userDetails = await auth(code);

    // ! ------------------------- login or register -------------------------

    // ! find user in database
    const user = await getSpecificuser({ email: userDetails.email });

    // ! if database has current user
    if (user !== null) {
      // ! gen token
      const token = await genToken({ email: user.email, role: user.role });
      if (user.role === "TEACHER") {
        if (user.name === "") {
          const editTeacher = await editSpecificuser({
            email: user.email,
            data: {
              name: user.name,
              refresh: token.refresh_token,
            },
          });
        }
      } else {
        // ! send refresh token to database
        const refresh_token_user = await editSpecificuser({
          email: user.email,
          data: { refresh: token.refresh_token },
        });

        if (refresh_token_user === null) {
          return res.status(500).json({ message: "Database error" });
        }
        res.cookie("accesstoken", token.access_token, { HttpOnly: true });
        res.cookie("refeshtoken", token.refresh_token, { HttpOnly: true });
      }
      // ! send accesstoken && refreshtoken to client
      return res.status(200).json(token);
    }

    // ! if database hasn't current user
    // ? --------------------------------- test login admin ---------------------------------

    if (userDetails.email === "6431501102@lamduan.mfu.ac.th" || userDetails.email === "boosaya.cha@mfu.ac.th" ) {
      // !random studentid for admin
      const studentid = await randomstudentid("0", userDetails.email);
      console.log(studentid);

      // ! create user
      const { email, role } = await addUser({
        studentid: studentid,
        email: userDetails.email,
        name: userDetails.name,
        role: "ADMIN",
        channel: 0,
      });

      // ! gen token
      const token = await genToken({ email: email, role: role });

      // ! send refresh token to database
      const refresh_token_user = await editSpecificuser({
        email: email,
        data: { refresh: token.refresh_token },
      });

      if (refresh_token_user === null) {
        return res.status(500).json({ message: "Database error" });
      }

      res.cookie("accesstoken", token.access_token, { HttpOnly: true });
      res.cookie("refeshtoken", token.refresh_token, { HttpOnly: true });

      // ! send accesstoken && refreshtoken to client
      return res.status(200).json(token);

      // ? --------------------------------- end test login admin ---------------------------------
    } else {

      // ! create user
      const { email, role } = await addUser({
        studentid: isNaN(userDetails.email.split("@")[0])? randomstudentid('0',userDetails.email):userDetails.email.split("@")[0],
        email: userDetails.email,
        name: userDetails.name,
        role: "STUDENT",
        channel: 0,
      });

      // ! gen token
      const token = await genToken({ email: email, role: role });

      // ! send refresh token to database
      const refresh_token_user = await editSpecificuser({
        email: email,
        data: { refresh: token.refresh_token },
      });

      if (refresh_token_user === null) {
        return res.status(500).json({ message: "Database error" });
      }

      res.cookie("accesstoken", token.access_token, { HttpOnly: true });
      res.cookie("refeshtoken", token.refresh_token, { HttpOnly: true });

      // ! send accesstoken && refreshtoken to client
      return res.status(200).json(token);
    }
  }
);

export const refresh_token = asynchandler(async (req: any, res: any) => {
  console.log(req.user.email);
  const user = await getSpecificuser({ email: req.user.email });
  console.log(user);
  if (!user) {
    return res.sendStatus(401);
  }
  // !gen token
  const token = await genToken({ email: user.email, role: user.role });
  // ! send refresh token to database
  const refresh_token_user = await editSpecificuser({
    email: req.user.email,
    data: { refresh: token.refresh_token },
  });

  if (refresh_token_user === null) {
    return res.status(500).json({ message: "Database error" });
  }

  return res.status(200).json(token);
});
