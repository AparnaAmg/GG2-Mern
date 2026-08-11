import { useEffect, useState } from "react";
import api from "../../services/api";

import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Chip,
  Button,
   Box,
} from "@mui/material";

export default function AllUsers() {

  const [users, setUsers] = useState([]);
const navigate = useNavigate();
  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers = async () => {

    try {

      const res = await api.get("/users");

      setUsers(res.data.users);

    } catch (err) {

      console.log(err);

    }

  };
const deleteUser = async (id) => {

  if (!window.confirm("Delete this user?")) return;

  await api.delete(`/users/${id}`);

  fetchUsers();

};

  const columns = [

    {
      field: "id",
      headerName: "ID",
      width: 70,
    },

    {
      field: "user_login",
      headerName: "Username",
      width: 180,
    },

    {
      field: "display_name",
      headerName: "Name",
      width: 180,
    },

    {
      field: "user_email",
      headerName: "Email",
      width: 250,
    },

    {
      field: "role",
      headerName: "Role",
      width: 180,
    },

    {
      field: "is_active",
      headerName: "Status",
      width: 130,

      renderCell: (params) => (

        <Chip

          label={params.value ? "Active" : "Inactive"}

          color={params.value ? "success" : "error"}

        />

      ),

    },
    {
  field: "actions",
  headerName: "Actions",
  width: 220,
  renderCell: (params) => (
    <>
      <Button
        size="small"
        onClick={() => navigate(`/users/edit/${params.row.id}`)}
      >
        Edit
      </Button>

      <Button
        color="error"
        size="small"
        onClick={() => deleteUser(params.row.id)}
      >
        Delete
      </Button>
    </>
  )
},

    {
      field: "user_registered",
      headerName: "Registered",
      width: 200,
    }

  ];

  return (

    <Paper sx={{ p:3 }}>
      <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  mb={2}
>
  <Typography variant="h5">
    Users
  </Typography>

  <Button
    variant="contained"
    onClick={() => navigate("/users/add")}
  >
    Add New User
  </Button>
</Box>

      <Typography
        variant="h5"
        mb={2}
      >

        All Users

      </Typography>

     <DataGrid
  rows={users}
  columns={columns}
  pageSizeOptions={[5, 10, 25, 50, 100]}
  initialState={{
    pagination: {
      paginationModel: {
        pageSize: 100,
        page: 0,
      },
    },
  }}
/>

    </Paper>

  );

}