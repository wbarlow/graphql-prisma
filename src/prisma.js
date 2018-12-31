import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists

// prisma.query.users(null, '{ id name posts { id title } }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.query.comments(null, '{ id text author { id name } }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

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



// prisma.mutation.updatePost({
//     data: {
//         body: "my updated text",
//         published: true
//     },
//     where: {
//         id: "cjqbekrxd002b0720ftsdfu1k"
//     }
// }, '{ id title body published }').then((data) => {
//     console.log(data)
//     return prisma.query.posts(null, '{ id title body published }')
// }).then((data) => {
//         console.log(JSON.stringify(data, undefined, 2))
// })
