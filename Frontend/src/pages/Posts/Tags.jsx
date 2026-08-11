import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Checkbox,
  Box,
  Select,
  MenuItem,
} from "@mui/material";

export default function Tags() {

  const [tags, setTags] = useState([]);

  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState([]);

  const [bulkAction, setBulkAction] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    tag_name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {

    const res = await api.get("/tags");

    setTags(res.data.tags);

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === "tag_name") {

      setForm({
        ...form,
        tag_name: value,
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

  const saveTag = async () => {

    if (!form.tag_name) {
      alert("Tag Name Required");
      return;
    }

    if (editingId) {

      await api.put(`/tags/${editingId}`, form);

    } else {

      await api.post("/tags", form);

    }

    setEditingId(null);

    setForm({
      tag_name: "",
      slug: "",
      description: "",
    });

    fetchTags();

  };

  const editTag = (tag) => {

    setEditingId(tag.id);

    setForm({
      tag_name: tag.tag_name,
      slug: tag.slug,
      description: tag.description || "",
    });

  };

  const deleteTag = async (id) => {

    if (!window.confirm("Delete Tag?")) return;

    await api.delete(`/tags/${id}`);

    fetchTags();

  };

  const handleCheckbox = (id) => {

    if (selected.includes(id)) {

      setSelected(selected.filter((x) => x !== id));

    } else {

      setSelected([...selected, id]);

    }

  };

  const handleBulkDelete = async () => {

    if (bulkAction !== "delete") return;

    for (const id of selected) {

      await api.delete(`/tags/${id}`);

    }

    setSelected([]);

    fetchTags();

  };

  const filteredTags = tags.filter((tag) =>
    tag.tag_name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <Grid container spacing={3}>

      {/* LEFT */}

      <Grid size={{ xs:12, md:4 }}>

        <Paper sx={{ p:3 }}>

          <Typography variant="h4" mb={3}>

            {editingId ? "Edit Tag" : "Add Tag"}

          </Typography>

          <TextField
            fullWidth
            label="Name"
            margin="normal"
            name="tag_name"
            value={form.tag_name}
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

          <TextField
            fullWidth
            multiline
            rows={6}
            label="Description"
            margin="normal"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            sx={{ mt:2 }}
            onClick={saveTag}
          >

            {editingId ? "Update Tag" : "Add Tag"}

          </Button>

        </Paper>

      </Grid>

      {/* RIGHT */}

      <Grid size={{ xs:12, md:8 }}>

        <Paper sx={{ p:3 }}>

          <Typography variant="h4" mb={3}>

            Tags

          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            mb={2}
          >

            <Box display="flex" gap={2}>

              <Select
                value={bulkAction}
                onChange={(e)=>setBulkAction(e.target.value)}
                size="small"
              >

                <MenuItem value="">
                  Bulk Actions
                </MenuItem>

                <MenuItem value="delete">
                  Delete
                </MenuItem>

              </Select>

              <Button
                variant="outlined"
                onClick={handleBulkDelete}
              >
                Apply
              </Button>

            </Box>

            <TextField
              placeholder="Search Tags"
              size="small"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
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

                  <TableCell>Count</TableCell>

                  <TableCell>Actions</TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {filteredTags.map((tag)=>(

                  <TableRow key={tag.id} hover>

                    <TableCell>

                      <Checkbox
                        checked={selected.includes(tag.id)}
                        onChange={()=>handleCheckbox(tag.id)}
                      />

                    </TableCell>

                    <TableCell>{tag.tag_name}</TableCell>

                    <TableCell>{tag.description}</TableCell>

                    <TableCell>{tag.slug}</TableCell>

                    <TableCell>{tag.post_count}</TableCell>

                    <TableCell>

                      <Button
                        size="small"
                        onClick={()=>editTag(tag)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        onClick={()=>deleteTag(tag.id)}
                      >
                        Delete
                      </Button>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </TableContainer>

        </Paper>

      </Grid>

    </Grid>

  );

}