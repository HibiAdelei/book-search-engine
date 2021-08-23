// dependencies 
const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

server.applyMiddleware({app});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});


db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // test our graphql api
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);

  });
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});