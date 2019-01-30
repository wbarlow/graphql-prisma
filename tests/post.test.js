import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import prisma from '../src/prisma'
import seedDb, { userOne, postOne, postTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { extractFragmentReplacements } from 'prisma-binding';
import { getPosts, myPosts, updatePost, createPost, deletePost, subscribeToPosts } from './utils/operations'

const client = getClient()

beforeEach(seedDb)

test('Should expose public posts', async () => {

    const response = await client.query({ query: getPosts })

    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
    expect(response.data.posts[0].title).toBe('Published Test Post Title')
})

test('Should get all posts for test user', async () => {
    const aclient = getClient(userOne.jwt)


    const { data } = await aclient.query({ query: myPosts })

    expect(data.myPosts.length).toBe(2)

})

test('Should be able to update own post', async () => {
    const aclient = getClient(userOne.jwt)

    const variables = {
        id: postOne.post.id,
        data: {
            published: false
        }
    }

    const { data } = await aclient.mutate({mutation: updatePost, variables})
    const exists = await prisma.exists.Post({ id: postOne.post.id, published: false })

    expect(data.updatePost.published).toBe(false)
    expect(exists).toBe(true)
})

test('Should be able to create a post', async () => {
    const aclient = getClient(userOne.jwt)

    const variables = {
        data: {
            title: "Post Three Title",
            body: "This is some text...",
            published: false
        }
    }

    const { data } = await aclient.mutate({mutation: createPost, variables})
    const exists = await prisma.exists.Post({ id: data.createPost.id })

    expect(data.createPost.title).toBe(variables.data.title)
    expect(data.createPost.body).toBe(variables.data.body)
    expect(data.createPost.published).toBe(variables.data.published)
    expect(exists).toBe(true)
})

test('Should be able to delete a post', async () => {
    const aclient = getClient(userOne.jwt)

    const variables = {id: postTwo.post.id}

    await aclient.mutate({ mutation: deletePost, variables })
    const exists = await prisma.exists.Post({ id: postTwo.post.id })

    expect(exists).toBe(false)
})

test('Should get updates on posts', async (done) => {
    const client = getClient()

    client.subscribe({ query: subscribeToPosts }).subscribe({
        next(response) {
            expect(response.data.post.mutation).toBe('DELETED')
            done()
        }
    })
    
    // Delete a post
    await prisma.mutation.deletePost( { where: { id: postOne.post.id }} )

})