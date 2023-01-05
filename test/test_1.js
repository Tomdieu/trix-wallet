const { expect } = require('chai')
const { it } = require('mocha')
process.env.NODE_ENV = 'TESTING'
// console.log(process.env.NODE_ENV)

describe('Test 1',async ()=>{
    const {User,Token}=require('../models')

    describe('Addition', async () => {
        it('Should add 1+1',()=>{
            const result = 1+1;

            expect(result).to.be.equal(2)
        })
    })
    
    describe('Multiplication', () => {
        it('Should add 1*1',()=>{
            const result = 1*1;
            expect(result).to.be.equal(1)
        })
    })

    describe('List of users',async ()=>{
        it('Should Return a list of users',async ()=>{
            var users = await User.findAll()

            users =  users.map(d=>d.toJSON())
            expect(users.length).to.be.above(2)
        })
    })
})