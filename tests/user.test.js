import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import prisma from '../src/prisma'
import seedDb, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDb)

test('Should create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser(
                data: {
                    name: "Andrew",
                    email: "andrew@example.com",
                    password: "MyPass123"
                }
            ) {
                token,
                user {
                    id
                }
            }
        }
    `

    const response = await client.mutate({
        mutation: createUser
    })

    const userExists = await prisma.exists.User({ id: response.data.createUser.user.id })
    expect(userExists).toBe(true)

})

test('Should expose public author profiles', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `
    const response = await client.query({
        query: getUsers
    })

    expect(response.data.users.length).toBe(1)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Jen')
})

test('Should not login with bad creds', async () => {
    const badLogin = gql`
        mutation {
            loginUser(
                data: {
                    email: "bad@example.com",
                    password: "abc12345"
                }
            ) {
                token
            }
        }
    `

    await expect(
        client.mutate({ mutation: badLogin })
    ).rejects.toThrow()

})

test('Should not be able to create account with short password', async() => {
    const badCreate = gql`
        mutation {
            createUser(
                data: {
                    name: "Sandra"
                    email: "sabsab@example.com",
                    password: "abc1234"
                }
            ) {
                token
            }
        }
    `

    await expect(
        client.mutate({ mutation: badCreate })
    ).rejects.toThrow()

})

test('Should fetch user profile', async () => {
    const aclient = getClient(userOne.jwt)

    const getProfile = gql`
    query {
        me {
            id
            name
            email
        }
    }
    `

    const { data } = await aclient.query({
        query: getProfile
    })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.email).toBe(userOne.user.email)
    expect(data.me.name).toBe(userOne.user.name)
})