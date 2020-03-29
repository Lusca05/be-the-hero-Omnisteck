const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connections');

describe('ONG', () => {
beforeEach(async() => {
    await connection.migrate.rollback();

    await connection.migrate.latest();
});
afterAll(async ()=> {
    await connection.destroy();
})

    it('should be able to create a new ONG', async () => {
        const response = await request(app)
        .post('/ongs')
        //.set('Authorization', 'sadf')
        .send({
            name: "ONG2",
            email: "treste@ong.com",
            whatsapp: "41000000000",
            city: "Curitiba",
            uf: "PR"

        });

        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
    });
});