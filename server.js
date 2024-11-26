const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = 3000;

// Middleware setup
app.use(express.json()); // For parsing application/json

// Route: GET /users - Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        playlists: true, // Include playlists for each user
      },
    });
    res.status(200).json(users); // Send the users and their playlists
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Route: GET /users/:id - Get user by ID with their playlists
app.get('/users/:id', async (req, res) => {
  const { id } = req.params; // Extract the user ID from the URL

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        playlists: true, // Include the playlists for the user
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user); // Return the user and their playlists
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Route: POST /users/:id/playlists - Create a new playlist for a user
app.post('/users/:id/playlists', async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL
  const { name, description } = req.body; // Get playlist data from the request body

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create the playlist for the user
    const newPlaylist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId: user.id, // Set the owner to the user with the given ID
      },
    });

    res.status(201).json(newPlaylist); // Send back the created playlist
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// Error-handling middleware (for catching any unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});