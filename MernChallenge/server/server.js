const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { ApolloServer, gql } = require('apollo-server-express');
const {authMiddleware} = require('./utils/auth');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas')


const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware

});



// integrate the Apollo server with Express app as middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//app.use(routes);


server.start().then(function(){
  server.applyMiddleware({ app });
  db.once('open', () => {
    app.listen(PORT, () => console.log(` Now listening on localhost:${server.graphqlPath}`));
  });
});
