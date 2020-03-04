const faker = require('faker');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(path.join(__dirname, '../db.json'));
const db = low(adapter);

module.exports = () => {
    faker.locale = 'es';

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

    return {
        "codeError": 0,
        "descError": "OK",
        "dto": db.get('users').value()
    };
};
