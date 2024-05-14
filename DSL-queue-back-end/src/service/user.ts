import prisma from "../prisma/client";
import { Role, User } from "@prisma/client";
export async function getUser() {
  return await prisma.user.findMany();
}
export async function addUser(user: {
  studentid: string;
  email: string;
  name: string;
  role: Role;
  channel: number;
  emailVerified?: boolean;
}) {
  const res = await prisma.user.create({ data: user });
  return res;
}
export async function getSpecificuser(user: {
  email: string;
  studentid?: string;
}) {
  console.log(user.studentid);
  const res = await prisma.user.findUnique({
    where: {
      email: user.email,
      studentid: user.studentid,
    },
  });
  return res;
}

export async function editSpecificuser(user: {
  email: string;
  data: {
    email?: string;
    name?: string;
    studentid?: string;
    role?: Role;
    channel?: number;
    refresh?: string;
  };
}) {
  const update_user = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: user.data,
  });
  return update_user;
}
