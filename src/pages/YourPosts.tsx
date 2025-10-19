import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
} from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Swal from "sweetalert2";
import { getToken } from "../utils/auth";
import "../styles.css";

export function YourPosts() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetchUserPosts(userId);
  }, [userId]);

  const fetchUserPosts = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/articles/${id}/usersAllArticles`
      );
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const deletePost = async (postId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      iconColor: "red",
      showCancelButton: true,
      confirmButtonColor: "darkred",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/articles/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      setPosts((prev) => prev.filter((p: any) => p.id !== postId));

      Swal.fire("Deleted!", "Article has been deleted.", "success");
    } catch (error) {
      console.error("Failed to delete post:", error);
      Swal.fire("Error", "Could not delete the post.", "error");
    }
  };

  return (
    <Container maxWidth="md" sx={styles.root}>
      <h2 style={styles.header}>
        <DoneOutlineIcon sx={{ color: "black" }} />
        Your Posts
        <img
          src={require("../stickers/wtf.png")}
          alt="icon"
          style={styles.headerIcon}
        />
      </h2>

      <Grid container spacing={1} sx={{ transform: "translate(1.5vw, -3vw)" }}>
        {posts.map((post: any) => (
          <Grid item key={post.id} xs={12}>
            <CheckCircleOutlineIcon sx={styles.checkIcon} />

            <Card sx={styles.card}>
              <Container sx={styles.cardContainer}>
                <CardContent sx={styles.cardContent}>
                  <p style={styles.title}>{post.title}</p>
                </CardContent>

                <CardActions sx={styles.actions}>
                  <Button
                    component={Link}
                    to={`/editpost/${post.title.replace(/ /g, "-")}?id=${post.id}`}
                    size="small"
                    variant="contained"
                    sx={styles.editButton}
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => deletePost(post.id)}
                    size="small"
                    variant="contained"
                    sx={styles.deleteButton}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Container>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

const styles = {
  root: {
    py: 4,
  },
  header: {
    fontFamily: "Cabin Sketch",
    fontSize: 50,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  headerIcon: {
    height: 30,
    width: 30,
    transform: "rotate(3deg)",
  },
  checkIcon: {
    transform: "translate(-28px, 20px)",
    color: "darkred",
    filter: "drop-shadow(1px 1px 1px black)",
  },
  card: {
    height: "87%",
    width: "95%",
    display: "flex",
    flexDirection: "column",
    borderBottom: (theme: any) => `5px solid ${theme.palette.divider}`,
    borderColor: "#41424C",
    borderRadius: "20px",
    filter: "invert(15%)",
    p: 2,
    backgroundColor: "#2a2a2a",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContent: {
    flexGrow: 1,
    maxWidth: "40vw",
  },
  title: {
    fontFamily: "Righteous",
    fontSize: 35,
    color: "white",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    borderLeft: 5,
    borderLeftStyle: "double",
    pl: 2,
  },
  editButton: {
    fontFamily: "Righteous",
    fontSize: 20,
    color: "black",
    backgroundColor: "#C09372",
    "&:hover": { backgroundColor: "#b37e5c" },
  },
  deleteButton: {
    fontFamily: "Righteous",
    fontSize: 20,
    color: "black",
    backgroundColor: "#8B0000",
    "&:hover": { backgroundColor: "#a00000" },
  },
};
