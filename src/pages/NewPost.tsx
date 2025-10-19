import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button } from '@mui/material';
import '../styles.css';
import { getToken } from '../utils/auth';
import { validateForm } from '../utils/validation';

export function NewPost() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title')?.toString() || '';
    const body = formData.get('body')?.toString() || '';
    const imageURL = formData.get('photo')?.toString().trim();

    const validationError = validateForm(title, body);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);

    const imageLink =
      imageURL ||
      'https://m.media-amazon.com/images/M/MV5BZDk4OWIxYzYtNzdmNC00MjA0LTkzNjAtNGNlNDE5ZWI3YWYzXkEyXkFqcGdeQXVyMzYwOTgxNTY@._V1_FMjpg_UX1000_.jpg';

    const token = getToken();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/articles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body, imageURL: imageLink }),
      });

      if (!response.ok) {
        setErrorMessage('Failed to create post. Please try again.');
        return;
      }

      const article = await response.json();
      navigate(`/read/${article.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    <Container>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Container>
          <TextField
            sx={{
              width: '50vw',
              marginTop: '3vh',
              left: '20vw',
              padding: 1,
              filter: 'box-shadow(2px 3px 20px black, 0 0 60px #8a4d0f inset)',
              background: '#fffef0',
              border: 1,
              borderStyle: 'dashed',
            }}
            variant="standard"
            required
            fullWidth
            id="title"
            name="title"
            placeholder="Give your post a title!"
            InputProps={{
              disableUnderline: true,
              style: {
                textAlign: 'center',
                fontFamily: 'Righteous',
                color: 'black',
              },
            }}
          />
        </Container>

        {errorMessage && (
          <Container
            sx={{
              marginTop: 2,
              backgroundColor: '#ffdddd',
              border: '1px solid #ff8888',
              borderRadius: 1,
              padding: 1,
              textAlign: 'center',
              color: '#a00000',
              fontFamily: 'Righteous',
            }}
          >
            {errorMessage}
          </Container>
        )}

        <Container sx={{ display: 'flex', marginTop: '5vh', gap: '50px' }}>
          <Container
            sx={{
              background: 'white',
              border: '2px solid #cecece',
              borderRadius: 3,
              width: '60vw',
              height: '68vh',
            }}
          >
            <Container maxWidth="md" sx={{ display: 'flex', margin: 'auto' }}>
              <div
                style={{
                  width: '1px',
                  float: 'left',
                  height: '67.6vh',
                  marginLeft: '35px',
                  borderLeft: '1px solid green',
                  borderRight: '1px solid green',
                }}
              />
              <TextField
                id="body"
                name="body"
                variant="standard"
                size="medium"
                multiline
                fullWidth
                rows={22}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    fontFamily: 'Righteous',
                    textDecoration: 'underline',
                    textDecorationColor: '#cecece',
                    color: 'grey',
                  },
                }}
              />
            </Container>
          </Container>

          <Container
            sx={{
              background: '#ccffcc',
              width: '20vw',
              height: '35vh',
              marginTop: '5vh',
              transform: 'rotate(5deg)',
              filter: 'drop-shadow(2px 2px 2px grey)',
              display: 'inline-flex',
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
              placeholder="Wanna add an image? Add an URL!"
              InputProps={{
                disableUnderline: true,
                style: {
                  textAlign: 'center',
                  fontFamily: 'Cabin Sketch',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textDecorationStyle: 'dashed',
                  textDecorationColor: 'grey',
                  height: '45vh',
                  padding: 10,
                },
              }}
            />
          </Container>

          <Button
            sx={{
              alignSelf: 'flex-end',
              maxHeight: '50px',
              padding: 4,
              fontFamily: 'Righteous',
              right: '15vw',
              bottom: '4vh',
              borderRadius: 20,
              border: 1,
              borderColor: 'black',
              borderStyle: 'dashed',
              backgroundColor: '#A97637',
              filter: 'drop-shadow(3px 3px 3px grey)',
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
