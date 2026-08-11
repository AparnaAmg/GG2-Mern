import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Select,
  Checkbox,
  Box,
} from "@mui/material";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    category_name: "",
    slug: "",
    description: "",
    parent_id: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.categories);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_name") {
      setForm({
        ...form,
        category_name: value,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const addCategory = async () => {
    if (!form.category_name) {
      alert("Category Name Required");
      return;
    }

    await api.post("/categories", form);

    setForm({
      category_name: "",
      slug: "",
      description: "",
      parent_id: "",
    });

    fetchCategories();
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await api.delete(`/categories/${id}`);

    fetchCategories();
  };
const renderCategories = (parent = null, level = 0) => {

  return categories
    .filter(cat => cat.parent_id === parent)
    .map(cat => (
      <>
        <TableRow key={cat.id} hover>

          <TableCell>
            <Checkbox />
          </TableCell>

          <TableCell>
            <span
              style={{
                paddingLeft: level * 30,
                fontWeight: level === 0 ? "bold" : "normal"
              }}
            >
              {level > 0 && "└─ "}
              {cat.category_name}
            </span>
          </TableCell>

          <TableCell>{cat.description}</TableCell>

          <TableCell>{cat.slug}</TableCell>

          <TableCell>{cat.parent_category}</TableCell>

          <TableCell>{cat.post_count}</TableCell>

          <TableCell>
            <Button size="small">
              Edit
            </Button>

            <Button
              color="error"
              size="small"
              onClick={() => deleteCategory(cat.id)}
            >
              Delete
            </Button>
          </TableCell>

        </TableRow>

        {renderCategories(cat.id, level + 1)}

      </>
    ));

};
  return (
    <Grid container spacing={3}>

  <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" mb={3}>
            Add Category
          </Typography>

          <TextField
            fullWidth
            label="Name"
            margin="normal"
            name="category_name"
            value={form.category_name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Slug"
            margin="normal"
            name="slug"
            value={form.slug}
            onChange={handleChange}
          />

          <Select
            fullWidth
            displayEmpty
            margin="dense"
            name="parent_id"
            value={form.parent_id}
            onChange={handleChange}
            sx={{ mt: 2 }}
          >
            <MenuItem value="">None</MenuItem>

            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.category_name}
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            multiline
            rows={5}
            label="Description"
            margin="normal"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={addCategory}
          >
            Add Category
          </Button>
        </Paper>
      </Grid>

      {/* RIGHT PANEL */}

     <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" mb={3}>
            Categories
          </Typography>

          <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
  }}
>
            <Select defaultValue="">
              <MenuItem value="">Bulk Actions</MenuItem>
              <MenuItem value="delete">Delete</MenuItem>
            </Select>

            <TextField
              placeholder="Search Categories"
              size="small"
            />
          </Box>

          <TableContainer>
            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>
                    <Checkbox />
                  </TableCell>

                  <TableCell>Name</TableCell>

                  <TableCell>Description</TableCell>

                  <TableCell>Slug</TableCell>

                  <TableCell>Parent</TableCell>

                  <TableCell>Count</TableCell>

                  <TableCell>Actions</TableCell>

                </TableRow>

              </TableHead>

             <TableBody>

   {renderCategories()}

</TableBody>

            </Table>

          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}