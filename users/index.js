const faker = require('faker');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(path.join(__dirname, '../db.json'));
const db = low(adapter);

module.exports = {
    get: () => {
        const users = db.get('users')
            .size()
            .value();

        if (users <= 0) {
            for (let i = 0; i < 100; i++) {
                const name = [
                    faker.name.firstName(),
                    faker.name.lastName()
                ];

                const data = {
                    fullName: `${name[0]} ${name[1]}`,
                    firstName: name[0],
                    lastName: name[1],
                    address: faker.address.streetAddress(),
                    phone: faker.phone.phoneNumber(),
                    email: faker.internet.email(),
                    postalCode: faker.address.zipCode(),
                    city: faker.address.city(),
                    id: faker.random.number(8000),
                    createdAt: faker.date.past(),
                    password: faker.internet.password(),
                    username: faker.internet.username,
                    profile: faker.lorem.paragraph(),
                };

                db
                    .get('users')
                    .push(data)
                    .write();
            }
        }

        return db.get('users').value();
    },
    set: (params) => {
        if (params) {
            try {
                params.id = faker.random.number(8000);

                db
                    .get('users')
                    .push(params)
                    .write();

                return {result: 'OK'};
            } catch (e) {
                console.log(e);
            }
        }
    },
    limit: (params) => {
        const users = db.get('users')
            .size()
            .value();

        if (users > 0) {
            return db
                .get('users')
                .sortBy('id')
                .take(params)
                .value();
        } else {
            return {result: 'error '};
        }
    }
};
