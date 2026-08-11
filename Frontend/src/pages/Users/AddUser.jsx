import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MainLayout from "../../layouts/MainLayout";

import {

Paper,
Typography,
Grid,
TextField,
Button,
MenuItem

} from "@mui/material";

export default function AddUser(){

const navigate=useNavigate();

const [form,setForm]=useState({

user_login:"",
user_email:"",
password:"",
first_name:"",
last_name:"",
phone:"",
role_id:1

});

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};

const submit=async()=>{

try{

await api.post("/users",form);

alert("User Added Successfully");

navigate("/users");

}catch(err){

alert(err.response.data.message);

}

};

return(

<MainLayout>

<Paper sx={{p:4}}>

<Typography variant="h5" mb={3}>

Add New User

</Typography>

<Grid container spacing={2}>

<Grid item xs={6}>

<TextField

fullWidth

label="Username"

name="user_login"

onChange={handleChange}

/>

</Grid>

<Grid item xs={6}>

<TextField

fullWidth

label="Email"

name="user_email"

onChange={handleChange}

/>

</Grid>

<Grid item xs={6}>

<TextField

fullWidth

label="First Name"

name="first_name"

onChange={handleChange}

/>

</Grid>

<Grid item xs={6}>

<TextField

fullWidth

label="Last Name"

name="last_name"

onChange={handleChange}

/>

</Grid>

<Grid item xs={6}>

<TextField

type="password"

fullWidth

label="Password"

name="password"

onChange={handleChange}

/>

</Grid>

<Grid item xs={6}>

<TextField

fullWidth

label="Phone"

name="phone"

onChange={handleChange}

/>

</Grid>

<Grid item xs={6}>

<TextField

select

fullWidth

label="Role"

name="role_id"

value={form.role_id}

onChange={handleChange}

>

<MenuItem value={1}>Administrator</MenuItem>

<MenuItem value={2}>Editor</MenuItem>

<MenuItem value={3}>Author</MenuItem>

<MenuItem value={4}>Contributor</MenuItem>

<MenuItem value={5}>Subscriber</MenuItem>

</TextField>

</Grid>

<Grid item xs={12}>

<Button

variant="contained"

onClick={submit}

>

Add User

</Button>

</Grid>

</Grid>

</Paper>

</MainLayout>

);

}