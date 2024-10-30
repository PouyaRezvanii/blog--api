const request = require('supertest')

const app = require('../../../app')

jest.setTimeout(60000)

describe('testing the signup route...', () => {

    it('returns 200 on successfull signup', async () => {
        await request(app)
            .post('/auth/signup')
            .send({
                userName: 'test1',
                email: 'test1@test.com',
                password: 'password'
            })
            .expect(200)
    })
    
    it('sets the cookie after successfull signup', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                userName: 'test1',
                email: 'test1@test.com',
                password: 'password'
            })
            .expect(200)
        expect(res.get('Set-Cookie')).toBeDefined()
    })

})

