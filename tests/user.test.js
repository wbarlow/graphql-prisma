import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import prisma from '../src/prisma'
import seedDb, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, getUsers, login, getProfile } from './utils/operations'

const client = getClient()

beforeEach(seedDb)


test('Should create a new user', async () => {
    const variables = {
        data: {
            name: 'Andrew',
            email: 'andrew@example.com',
            password: "MyPass123"
        }
    }

    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const userExists = await prisma.exists.User({ id: response.data.createUser.user.id })
    expect(userExists).toBe(true)

})

test('Should expose public author profiles', async () => {

    const response = await client.query({
        query: getUsers
    })

    expect(response.data.users.length).toBe(1)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Jen')
})

test('Should not login with bad creds', async () => {
    const variables = {
        data: {
            email: "jen@example.com",
            password: "adfadsfsdfas"
        }
    }

    await expect(
        client.mutate({ mutation: login, variables })
    ).rejects.toThrow()

})

test('Should not be able to create account with short password', async() => {
    const variables = {
        data: {
            name: "Sandra",
            email: "sabsab@example.com",
            password: "abc1234"
        }
    }

    await expect(
        client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow()

})

test('Should fetch user profile', async () => {
    const aclient = getClient(userOne.jwt)

    const { data } = await aclient.query({
        query: getProfile
    })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.email).toBe(userOne.user.email)
    expect(data.me.name).toBe(userOne.user.name)
})