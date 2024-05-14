<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
<template>
  <div class="w-screen main-wrapper">
    <div class ="textadmin" >จัดการเจ้าหน้าที่ดูแลระบบ</div>
    <div class="wrapper">
      <div class="Listofnames">รายชื่อ</div>
      <v-btn color="red" @click="addAlert">เพิ่มผู้ดูแล</v-btn>
    </div>
        <div class="Search"> 
            <h1 class="Listofnames mr-5">ค้นหา</h1>
            <v-text-field type="text" v-model="searchText" label="ค้นหา.." prepend-inner-icon="mdi-account-search-outline"></v-text-field>
        </div>
        <!-- ตาราง -->
   <div class="table" style=" height: 1rem;">
    <table class="admin-table">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>ชื่อผู้ใช้</th>
            <th>อีเมล</th>
            <th>ช่องบริการ</th>
            <th>การเปลี่ยนแปลง</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(admin, index) in filteredAdmins" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ admin.name }}</td>
            <td>{{ admin.email }}</td>
            <td>{{ admin.channel }}</td>
            <td>
              <v-btn  color="main" @click="editalert(admin)">แก้ไข</v-btn>
              <v-btn color="red" @click="alertDelete(admin)">ลบ</v-btn>
            </td>
          </tr>
        </tbody>
      </table>
       <!-- ป๊อปอัพเพิ่มผู้ดูแล -->
    <div v-if="showAddAdminPopup" class="popup">
      <form @submit.prevent="addAdmin">
        <input type="email" v-model="newAdmin.email" placeholder="อีเมล" required>
        <button class="btn-green" type="submit">เพิ่ม</button>
        <button class="btn-red" @click="closeAddAdminPopup">ยกเลิก</button>
      </form>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Swal from 'sweetalert2';
import axios from "axios";


const showAddAdminPopup = ref(false);
const newAdmin = ref({
  username: "",
  firstName: "",
  lastName: "",
  email: "",
});

let admins = ref([]);

async function getAdmin() {
    try {
        const res = await axios.get(`http://localhost:${process.env.VUE_APP_BACK_PORT}/users/getAlluser`);
        if (res.status !==200) {
            throw Error(res.statusText);
        }
        const admin = ref([]);
        console.log(res.data);
        res.data.forEach((value:any)=>{
          if(value.role === "TEACHER"){
            admin.value.push(value);
          }
        })
        admins.value = admin.value;
        console.log(admins.value);

    } catch (error) {
        console.error(error);
    }
}

const searchText =ref("");

// const addAdmin = () => {
//   admins.value.push({ ...newAdmin.value });
//   closeAddAdminPopup();
// };

const filteredAdmins = computed(() => {
  return admins.value.filter(admin => {
    // Filter logic based on search text
    const search = searchText.value.toLowerCase();
    return admin.name.toLowerCase().includes(search) ||
           admin.email.toLowerCase().includes(search) ||
           `${admin.channel}`.includes(search)
  });
});

// Alert add teacher
async function addAlert(row?:any) {
  const { value: formValues } = await Swal.fire({
  title: "Multiple inputs",
  html: `
    <h1>อีเมล</h1>  
    <input type="email" id="swal-input1" class="swal2-input">
    <h1>ช่องบริการ</h1>
    <input type="number" id="swal-input2" class="swal2-input">
  `,
  focusConfirm: false,
  preConfirm: async () => {
    let resultObject = [
      document.getElementById("swal-input1").value,
      document.getElementById("swal-input2").value
  ]
    if (!resultObject[0]|| !resultObject[1]) {
						Swal.fire({
							title: 'คุณต้องกรอกข้อมูลทั้งหมด',
							icon: 'error'
						})
						return null
					}
    const ischannelcontain =  checkChannel(parseInt(resultObject[1])); 
    const isemailcontain = checkEmail(resultObject[0]);

    if(ischannelcontain === true){
      // console.log(ischannelcontain);
      Swal.fire({
							title: 'ช่องบริการนี้มีอยู่แล้ว',
							icon: 'error'
						})
						return null
    }
   
    

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(resultObject[0])) {
      if (isemailcontain === true) {
        Swal.fire({
							title: 'อีเมลนี้มีอยู่แล้ว',
							icon: 'error'
						})
						return null
      }
      return resultObject;
    }else if(isNaN(parseInt(resultObject[1]))){
      Swal.fire({
							title: 'คุณกรอกช่องบริการไม่ถูกต้อง',
							icon: 'error'
						})
						return null
    } else {
      Swal.fire({
							title: 'คุณกรอกอีเมลไม่ถูกต้อง',
							icon: 'error'
						})
						return null
    }
  },
});
if (formValues) {
    const teacher = await addTeacher({email:formValues[0],channel: parseInt(formValues[1])});
    await getAdmin();
}
}

async function addTeacher(teacher:{email:string,channel:number}) {
  try {
    const res = await axios.post(`http://localhost:${process.env.VUE_APP_BACK_PORT}/users/addTeacher`,
      {email:teacher.email,channel:teacher.channel}
    );
    if (res.status !== 200) {
      throw Error(res.statusText)
    }
    await Swal.fire({
  position: "bottom-end",
  icon: "success",
  title: "คุณเพิ่มเจ้าหน้าที่สำเร็จ",
  showConfirmButton: false,
  timer: 1500
});

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

const closeAddAdminPopup = () => {
  newAdmin.value = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  };
  showAddAdminPopup.value = false;
};

const editalert = async (index:any) => {
  // Implement edit functionality here
  console.log(index);
  const { value: formValues } = await Swal.fire({
  title: "เปลี่ยนช่องบริการ",
  html: `
    <h1>อีเมล</h1>  
    <input type="email" placeholder="${index.email}" id="swal-input1" class="swal2-input" disabled>
    <h1>ช่องบริการ</h1>
    <input type="number" placeholder="ช่องบริการ ${index.channel}" id="swal-input2" class="swal2-input">
  `,
  focusConfirm: false,
  preConfirm: async () => {
    let resultObject = [
      document.getElementById("swal-input1").value,
      document.getElementById("swal-input2").value
  ]
    if (!resultObject[1]) {
						Swal.fire({
							title: 'คุณต้องกรอกข้อมูลทั้งหมด',
							icon: 'error'
						})
						return null
		}
    const ischannelcontain =  checkChannel(parseInt(resultObject[1])); 
    const isemailcontain = checkEmail(resultObject[0]);

     if(isNaN(parseInt(resultObject[1]))){
      Swal.fire({
							title: 'คุณกรอกช่องบริการไม่ถูกต้อง',
							icon: 'error'
						})
						return null
    }
    return resultObject;
  },
});
if (formValues) {

  //  update selected teacher
  const teacher = await editTeacher({email:index.email,channel: parseInt(formValues[1])});
   
    // check if selected have exiting channel.
    const iscontain = checkChannel(teacher.channel);

    if (iscontain === true) {
      // find the exitingteacher  
      const exitingteacher = admins.value.find((value)=>{
        return value.channel === parseInt(formValues[1]);
      })

      if (exitingteacher !== undefined) {
        //update exiting teacher 
        await editTeacher({email:exitingteacher.email,channel:index.channel});
      }

      await Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "คุณแก้ไขเจ้าหน้าที่สำเร็จ",
        showConfirmButton: false,
        timer: 1500
      });
    }
    await getAdmin();
}
};

 const alertDelete = async (index:any) => {
  const result = await Swal.fire({
    title: "คุณแน่ใจใช่ไหม?",
    text: "คุณกำลังจะนำเจ้าหน้าที่ออก!",
    icon: "warning",
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonColor: "#191771",
    cancelButtonColor: "#ED1C24",
    confirmButtonText: "ยืนยัน!",
    cancelButtonText: "ยกเลิก",
    iconColor: "#ED1C24",
    color: "#191771",
  });
  if (result.isConfirmed) {
    await deleteTeacher(index.email);
    await getAdmin();
  }
};

async function deleteTeacher(email:string) {
  console.log(email);
  try {
    const res = await axios.put(`http://localhost:${process.env.VUE_APP_BACK_PORT}/users/getusereditSpecificuser`,{
      email:email,
      data:{
        channel:0,
        role:"STUDENT"
      }
    })
    if (res.status !== 200) {
      throw Error(res.statusText)
    }

    await Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "คุณแก้ไขเจ้าหน้าที่สำเร็จ",
        showConfirmButton: false,
        timer: 1500
      });

    return res.data;
    
  } catch (error) {
    console.error(error);
  }
}

 function checkEmail(email:string) {
  const iscontain = admins.value.find((value)=>{
      return value.email === email;
  })

  return iscontain !== undefined ? true : false; 
}

 function checkChannel(channel:number) {
  // console.log(channel);
  const iscontain = admins.value.find((value)=>{
  return value.channel === channel;
  })

  // console.log(iscontain);

  return iscontain !== undefined  ? true : false; 
}

async function editTeacher(teacher:{email:string,channel:number}) {
  try {
    const res = await axios.put(`http://localhost:${process.env.VUE_APP_BACK_PORT}/users/getusereditSpecificuser`,{
      email:teacher.email,
      data:{
        channel:teacher.channel
      }
    })
    if (res.status !== 200) {
      throw Error(res.statusText)
    }
    
   
    
    return res.data;

    
  } catch (error) {
    console.error(error);
  }
}

onMounted(getAdmin);

</script>

<style lang="scss" scoped>
.main-wrapper {
  padding: 2rem;
  overflow: scroll;
}
.Search input[type="text"] {
    border: 1px solid  white;
    border-radius: 20px; /* ปรับค่าตามต้องการ */
}

.textadmin{
      font-family: "Inter-Bold", Helvetica;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      
}
.wrapper {
    align-items: center;
    display: flex;
    justify-content: space-between;
}

.Listofnames {
  font-family: "Inter-Bold", Helvetica;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
}

.Search{
        display: flex;
    align-items: center;
      font-family: "Inter-Bold", Helvetica;
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      
}
.admin-table {
  background-color: white;
  text-align: center;
  border-collapse: collapse;
  width: 90vw;
  overflow: scroll;
  height: 1rem;
  th,
  td {
    border: 1px solid #ddd;
    padding: 10px 0 10px 0;
}

  th {
    background-color: #f2f2f2;
    
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 80px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #333;

  input {
    display: block;
    margin-bottom: 50px;
    padding: 10px;
  border: 1px solid #ccc; /* สีและขนาดของกรอบ */
  border-radius: 5px; /* ทำให้มีมุมโค้ง */

  }

  button {
    margin-right: 20px;
  }
}

.btn-green{
  background-color: #14ab78;
  border-radius: 10px;
  width: 100px;
  height: 50px;
  color: white;
}
.btn-red{
  background-color: #921501;
  border-radius: 10px;
  width: 100px;
  height: 50px;
  color: white;
}
.btn-yellow{
  background-color: #1737eb;
  border-radius: 10px;
  width: 100px;
  height: 50px;
  color: white;
}
</style>