import { Checkbox, Box } from "@mui/material";

export default function CategoryTree({
  categories,
  parent = null,
  level = 0,
}) {
  return (
    <>
      {categories
        .filter((cat) => {
          // Root categories
          if (parent === null) {
            return cat.parent_id === null;
          }

          // Child categories
          return Number(cat.parent_id) === Number(parent);
        })
        .map((cat) => (
          <Box
            key={cat.id}
            sx={{
              ml: level * 3,
              mt: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Checkbox size="small" />

            {cat.category_name}

            <CategoryTree
              categories={categories}
              parent={cat.id}
              level={level + 1}
            />
          </Box>
        ))}
    </>
  );
}