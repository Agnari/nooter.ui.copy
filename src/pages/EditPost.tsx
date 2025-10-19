import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/system";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getToken } from "../utils/auth";

export function EditPost() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userStr = localStorage.getItem("USER");
  const user = userStr ? JSON.parse(userStr) : null;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageURL, setImageURL] = useState("");

  const articleId = searchParams.get("id");

  // --- Load article data on mount ---
  useEffect(() => {
    if (!articleId) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/articles/${articleId}`)
      .then((res) => res.json())
      .then((result) => {
        setTitle(result.title || "");
        setBody(result.body || "");
        setImageURL(result.imageURL || "");
      })
      .catch(() => {
        Swal.fire({
          title: "Error!",
          text: "Failed to load article data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  }, [articleId]);

  // --- Handle form submit ---
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Title is missing",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!body.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Text is missing",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const token = getToken();
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        body: body.trim(),
        imageURL: imageURL.trim(),
        authorId: user?.userId,
      }),
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/articles/${articleId}`, requestOptions)
      .then(() => {
        Swal.fire({
          title: "Good job!",
          text: "Article was changed!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate(`/yourposts/user?id=${user?.userId}`);
      })
      .catch(() => {
        Swal.fire({
          title: "Error!",
          text: "Failed to update article.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <Container>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Container>
          <TextField
            sx={{
              width: "50vw",
              marginTop: "3vh",
              left: "20vw",
              padding: 1,
              filter: "box-shadow(2px 3px 20px black, 0 0 60px #8a4d0f inset)",
              background: "#fffef0",
              border: 1,
              borderStyle: "dashed",
            }}
            margin="normal"
            variant="standard"
            required
            fullWidth
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a title!"
            InputProps={{
              disableUnderline: true,
              style: {
                textAlign: "center",
                fontFamily: "Righteous",
                color: "black",
              },
            }}
          />
        </Container>

        <Container sx={{ display: "flex", marginTop: "5vh", gap: "50px" }}>
          {/* Post Body */}
          <Container
            sx={{
              width: "60vw",
              height: "68vh",
              background: "white",
              border: "2px solid #cecece",
              borderRadius: 3,
            }}
          >
            <Container maxWidth="md" sx={{ display: "flex", margin: "auto" }}>
              <div
                style={{
                  width: "1px",
                  float: "left",
                  height: "67.6vh",
                  marginLeft: "35px",
                  borderLeft: "1px solid green",
                  borderRight: "1px solid green",
                }}
              />
              <TextField
                id="body"
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                variant="standard"
                size="medium"
                multiline
                fullWidth
                rows={22}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    fontFamily: "Righteous",
                    textDecoration: "underline",
                    textDecorationColor: "#cecece",
                    color: "grey",
                  },
                }}
              />
            </Container>
          </Container>

          {/* Image URL */}
          <Container
            sx={{
              background: "#ccffcc",
              width: "20vw",
              height: "35vh",
              marginTop: "5vh",
              transform: "rotate(5deg)",
              filter: "drop-shadow(2px 2px 2px grey)",
              display: "inline-flex",
            }}
          >
            <TextField
              margin="normal"
              required
              multiline
              rows={10}
              fullWidth
              variant="standard"
              id="photo"
              name="photo"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="Wanna add an image? Add an URL!"
              InputProps={{
                disableUnderline: true,
                style: {
                  textAlign: "center",
                  fontFamily: "Cabin Sketch",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  textDecorationStyle: "dashed",
                  textDecorationColor: "grey",
                  height: "45vh",
                  padding: 10,
                },
              }}
            />
          </Container>

          {/* Submit Button */}
          <Button
            sx={{
              alignSelf: "flex-end",
              maxHeight: "50px",
              padding: 4,
              fontFamily: "Righteous",
              right: "15vw",
              bottom: "4vh",
              borderRadius: 20,
              border: 1,
              borderColor: "black",
              borderStyle: "dashed",
              backgroundColor: "#A97637",
              filter: "drop-shadow(3px 3px 3px grey)",
            }}
            type="submit"
            variant="contained"
            size="large"
          >
            Done!
          </Button>
        </Container>
      </Box>
    </Container>
  );
}
