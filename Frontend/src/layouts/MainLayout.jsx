
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
export default function MainLayout({children}){

    return(

       <Box sx={{ display: "flex", bgcolor: "#F4F7FE", minHeight: "100vh" }}>
      <Sidebar />

      <Box sx={{ flex: 1 }}>
        <Navbar />

        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}