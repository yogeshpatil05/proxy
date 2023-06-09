  const express = require('express');
  const { createProxyMiddleware } = require('http-proxy-middleware');
  const fs = require('fs');

  const proxy = createProxyMiddleware({
    target: 'http://localhost:8080',  // Replace with your target URL
    changeOrigin: false,
  });

  const https = require('https');
  const path = require('path');
  const api = require('./routes/index.js');

  const PORT =  4000;
  const app = express();
  app.use('/anime',proxy)
  const axios = require('axios');
  // const options = {
  //   key: fs.readFileSync('./_wildcard.jikan.moe-key.pem'),
  //   cert: fs.readFileSync('./_wildcard.jikan.moe.pem'),
  // };
  axios.defaults.proxy = {
    host: 'localhost',
    port: 8080,
    rejectUnauthorized: false,
  };

  // middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));   // true-more accurate but slower, false-faster but less accurate
  app.use('/api', api);
  app.use(express.static('public'));    // 'public' folder


  // GET route for landing page                             
  app.get('/', (req, res) => {
    console.log(`Get request for url: ${req.url} `)
    res.sendFile(path.join(__dirname, './public/index.html'))
  }
  );

  // GET route for notes page                               
  app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
  );

app.get('/test/:id', (req, res) => {
  //  data should be fetch from http request
  const id = req.params.id;
  data = {};
  res.json(data);
});

  // get route for anime by id
  app.get('/anime/:id', (req, res) => {
    //  data should be fetch from http request
    const id = req.params.id;
    axios.get(`https://api.jikan.moe/v4/anime/${id}`)
      .then((response) => {
        res.json(response.data);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });
  });

  // wildcard route for 404 page. should ALWAYS be below ALL other routes.
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/404.html'))
  );

  app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
  );


  // https.createServer(options, app).listen(443, () => {
  //   console.log('Server running on port 443');
  // });