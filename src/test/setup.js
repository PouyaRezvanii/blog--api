const mongoose = require('mongoose')

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://admin:NyUMADRXCZVKlijk@cluster0.chmto.mongodb.net/testing-blog?retryWrites=true&w=majority&appName=Cluster0')

})

afterEach(async () => {
    await mongoose.connection.db.dropDatabase({ dbName: 'testing-blog' })
})

afterAll(async () => {
    await mongoose.connection.close()
})














// it('returns 5', () => {
//     expect(2+3).toBe(5)
// })

// const adds = (a, b) => a+b;

// it('adds 1 + 2 and returns 3', () => {
//     expect(adds(1, 2)).toBe(3)
// })

// it('returns true', () => {
//     const cb = () => true

//     expect(cb()).toBeTruthy()
// })