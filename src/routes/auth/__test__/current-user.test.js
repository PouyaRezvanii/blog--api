const request = require('supertest')

const app = require('../../../app')

describe('testing the current-user route', () => {
    it('returns a user object', async () => {
        const signupRes = await request(app).post('/auth/signup')
            .send({
                userName: 'test',
                email: 'test@test.com',
                password: 'password'
            }).expect(200)

        const cookie = signupRes.get('Set-Cookie')

        const res = await request(app)
            .get('/auth/current-user')
            .set('Cookie', cookie)
            .send()
            .expect(200)

        expect(res.body.user.email).toEqual('test@test.com')
    })
})