import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import prisma from '../src/prisma'
import seedDb, { userOne, postOne, postTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { extractFragmentReplacements } from 'prisma-binding';

const client = getClient()

beforeEach(seedDb)

test('Should expose public posts', async () => {
    
    const getPosts = gql`
        query {
            posts {
                id
                title
                body
                published
            }
        }
    `
    const response = await client.query({ query: getPosts })

    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
    expect(response.data.posts[0].title).toBe('Published Test Post Title')
})

test('Should get all posts for test user', async () => {
    const aclient = getClient(userOne.jwt)

    const myPosts = gql`
        query {
            myPosts {
                id
                title
                body
                published
            }
        }
    `
    const { data } = await aclient.query({ query: myPosts })

    expect(data.myPosts.length).toBe(2)

})

test('Should be able to update own post', async () => {
    const aclient = getClient(userOne.jwt)

    const updatePost = gql`
        mutation {
            updatePost(
                id: "${postOne.post.id}",
                data: {
                    published: false
                }
            ){
                id
                title
                body
                published
            }

        }
    `
    const { data } = await aclient.mutate({mutation: updatePost})
    const exists = await prisma.exists.Post({ id: postOne.post.id, published: false })

    expect(data.updatePost.published).toBe(false)
    expect(exists).toBe(true)
})

test('Should be able to create a post', async () => {
    const aclient = getClient(userOne.jwt)

    const postThree = {
        input: {
            title: "Post Three Title",
            body: "This is some text...",
            published: false
        }
    }

    const createPost = gql`
        mutation {
            createPost(
                data: {
                    title: "${postThree.input.title}",
                    body: "${postThree.input.body}",
                    published: ${postThree.input.published}
                }
            ){
                id
                title
                body
                published
            }

        }
    `
    const { data } = await aclient.mutate({mutation: createPost})
    const exists = await prisma.exists.Post({ id: data.createPost.id })

    expect(data.createPost.title).toBe(postThree.input.title)
    expect(data.createPost.body).toBe(postThree.input.body)
    expect(data.createPost.published).toBe(postThree.input.published)
    expect(exists).toBe(true)
})

test('Should be able to delete a post', async () => {
    const aclient = getClient(userOne.jwt)

    const deletePost = gql`
        mutation {
            deletePost(
                id: "${postTwo.post.id}"
            ){
                id
            }

        }
    `
    await aclient.mutate({mutation: deletePost})
    const exists = await prisma.exists.Post({ id: postTwo.post.id })

    expect(exists).toBe(false)
})
