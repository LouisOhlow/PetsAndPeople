const express = require('express');
const app = require('./app');
// const bodyParser = require('body-parser');



// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


const port = 5000;
// app.post('/api/world', (req, res) => {
//   console.log(req.body);
//   res.send(
//     `I received your POST request. This is what you sent me: ${req.body.post}`,
//   );
// });

app.listen(port, () => console.log(`Listening on port ${port}`));
