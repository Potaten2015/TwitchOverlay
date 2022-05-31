const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get("/define/:word", async (req, res) => {
  const options = {
    method: "GET",
    url: "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
    qs: { term: req.params.word },
    headers: {
      "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
      "x-rapidapi-key": "5df22d3797msh5a75a3b2600258ap18ec1cjsnaf86a045d0da",
      useQueryString: true,
    },
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    res.json(body);
  });
});

app.get("/cors", (req, res) => {
  res.send("This has CORS enabled 🎈");
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
