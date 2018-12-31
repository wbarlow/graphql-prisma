import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists

const createPostForUser = async (authorId, data) => {
    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
    }, '{ id }')
    
    const user = await prisma.query.user({
        where: {
            id: authorId
        }
    }, '{ id name email posts { id title published } }')

    return user
}

// createPostForUser("cjqb1fzp0000c07206mqkp5ay", {
//     title: 'Some title for this post',
//     body: 'some really interesting I thought about today',
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// })

const updatePostForUser = async (postId, data) => {
    const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        },
        data
    }, '{ author { id } }')
    
    const user = await prisma.query.user({
        where: {
            id: post.author.id
        }
    }, '{ id name email posts { id title published } }')

    return user
}

// updatePostForUser("cjqbof4xf002o0720rb3pl9n3", { published: false}).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// })

