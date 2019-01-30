import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDb, { userOne, userTwo, commentOne, commentTwo, postOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { deleteComment, subscribeToComments } from './utils/operations'

beforeEach(seedDb)

test('Should be able to delete own comment', async () => {
    const aclient = getClient(userOne.jwt)

    const variables = {id: commentTwo.comment.id}

    await aclient.mutate({ mutation: deleteComment, variables })
    const exists = await prisma.exists.Comment({ id: commentTwo.comment.id })

    expect(exists).toBe(false)
})

test('Should not be able to delete others comments', async () => {
    const aclient = getClient(userTwo.jwt)

    const variables = {id: commentTwo.comment.id}

    await expect(
        aclient.mutate({ mutation: deleteComment, variables })
    ).rejects.toThrow()

    const exists = await prisma.exists.Comment({ id: commentTwo.comment.id })

    expect(exists).toBe(true)
})

test('Should get updates on comments on a posts', async (done) => {
    const client = getClient()

    const variables = {
        postId: postOne.post.id
    }

    client.subscribe({ query: subscribeToComments, variables }).subscribe({
        next(response) {
            expect(response.data.comment.mutation).toBe('DELETED')
            done()
        }
    })
    
    // Delete a comment
    await prisma.mutation.deleteComment( { where: { id: commentOne.comment.id }} )

})
