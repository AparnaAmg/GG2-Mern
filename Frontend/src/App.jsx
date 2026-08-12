import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllUsers from "./pages/Users/AllUsers";
import AddUser from "./pages/Users/AddUser";
import Profile from "./pages/Users/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import AllPosts from "./pages/Posts/AllPosts";
import AddPost from "./pages/Posts/AddPost";
import Categories from "./pages/Posts/Categories";
import Tags from "./pages/Posts/Tags";
import MediaLibrary from "./pages/media/MediaLibrary";
import UploadMedia from "./pages/media/UploadMedia";
import AddPage from "./pages/pages/AddPage";
import AllPage from "./pages/pages/AllPage";
import ViewPage from "./pages/pages/ViewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
<Route path="/posts" element={<AllPosts />} />
<Route path="/posts/add" element={<AddPost />} />
<Route path="/posts/categories" element={<Categories />} />
<Route path="/posts/tags" element={<Tags />} />
<Route path="/posts/edit/:id" element={<AddPost />} />
 <Route path="/media" element={<MediaLibrary />} />
 <Route
    path="/media/upload"
    element={<UploadMedia />}
/>

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AllUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/add"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />
<Route
    path="/pages/add"
    element={<AddPage />}
/>
<Route
    path="/pages/edit/:id"
    element={<AddPage />}
/>
<Route
  path="/pages/view/:id"
  element={<ViewPage />}
/>
<Route path="/pages" element={<AllPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
     
    </BrowserRouter>
  );
}

export default App;