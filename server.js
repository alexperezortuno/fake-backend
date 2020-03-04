const jsonServer = require('json-server');
const _ = require('lodash');
const server = jsonServer.create();
const path = require('path');
const middleWares = jsonServer.defaults();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const port = process.env.PORT || 3000;

db.defaults({users: []})
    .write();

server.use(jsonServer.bodyParser);
server.use(middleWares);

server.use(jsonServer.rewriter({
    '/api/users': '/users'
}));

server.get('/users', (req, res, next) => {
    if (req.method === 'GET') {
        const users = require('./users/index');
        const params = _.cloneDeep(req.query);

        if (!_.isEmpty(params)) {
            if (params.limit > 0) {
                res.status(200).jsonp(users.limit(params.limit));
            }
        } else {
            res.status(200).jsonp(users.get());
        }
    }
});

server.post('/users', (req, res, next) => {
    if (req.method === 'POST') {
        const users = require('./users/index');
        res.status(200).jsonp(users.set(req.body));
    }
});

const router = jsonServer.router(path.join(__dirname, 'db.json'));
server.use(router);

server.listen(port, () => {
    console.log('Server is running');
});
