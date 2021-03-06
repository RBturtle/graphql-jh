const { ApolloServer } = require('apollo-server');
const { PORT = 3030 } = process.env;
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { getDataLoaders } = require('./loaders');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
        loaders: getDataLoaders(),
    }),

    cors: true
});

server
    .listen(PORT)
    .then(({ url }) => console.log(`🚀 Server running at ${url}`));