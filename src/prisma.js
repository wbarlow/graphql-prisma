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

// prisma.mutation.createPost({ 
//     data: { 
//         title: "A second post from node", 
//         body: "...",
//         published: false,
//         author: {
//             connect: {
//                 id: "cjqb6tfyi001c0720svt9anme"
//             }
//         }
//     }
// }, '{ id title body published }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
//     return prisma.query.users(null, '{ id name posts { id title } }')
// }).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })

prisma.mutation.updatePost({
    data: {
        body: "my updated text",
        published: true
    },
    where: {
        id: "cjqbekrxd002b0720ftsdfu1k"
    }
}, '{ id title body published }').then((data) => {
    console.log(data)
    return prisma.query.posts(null, '{ id title body published }')
}).then((data) => {
        console.log(JSON.stringify(data, undefined, 2))
})
