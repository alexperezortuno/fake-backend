const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const middlewares = jsonServer.defaults();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const port = process.env.PORT || 3000;

db.defaults({users: []})
    .write();

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.use(jsonServer.rewriter({
    '/api/users': '/users'
}));

server.get('/users', (request, response) => {
    if (request.method === 'GET') {
        const users = require('./users/index');
        response.status(200).jsonp(users());
    }
});

const router = jsonServer.router(path.join(__dirname, 'db.json'));
server.use(router);
server.listen(port, () => {
    console.log('Server is running');
});
