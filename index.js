const express = require("express");
const { getTypesData } = require("./parser");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async function (request, response) {
  const result = await getTypesData();

  response.send(result);
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("This app listening on localhost:" + port);
  }
});
