const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const blogPosts = [];

app.get('/', (req, res) => {
  res.render('layout', { content: 'home', blogPosts });
});

app.get('/newpost', (req, res) => {
  res.render('layout', { content: 'newpost' });
});

app.post('/addpost', (req, res) => {
  const { title, content } = req.body;
  const shortContent = content.substring(0, 100);
  const remainingContent = content.length > 100 ? content.substring(100) : '';
  blogPosts.push({ title, shortContent, remainingContent });
  res.redirect('/');
});

app.get('/blogpost/:id', (req, res) => {
  const id = req.params.id;
  const post = blogPosts[id];
  res.render('layout', { content: 'blogpost', post });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
