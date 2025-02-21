// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Read comments from file
function readComments() {
  try {
    const data = fs.readFileSync('comments.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading comments file:', err);
    return [];
  }
}

// Write comments to file
function writeComments(comments) {
  try {
    fs.writeFileSync('comments.json', JSON.stringify(comments, null, 2));
  } catch (err) {
    console.error('Error writing comments file:', err);
  }
}

// Get all comments
app.get('/comments', (req, res) => {
  const comments = readComments();
  res.json(comments);
});

// Add a new comment
app.post('/comments', (req, res) => {
  const newComment = req.body;
  const comments = readComments();
  comments.push(newComment);
  writeComments(comments);
  res.status(201).json(newComment);
});

// Delete a comment
app.delete('/comments/:id', (req, res) => {
  const commentId = parseInt(req.params.id, 10);
  let comments = readComments();
  comments = comments.filter(comment => comment.id !== commentId);
  writeComments(comments);
  res.status(204).send();
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});