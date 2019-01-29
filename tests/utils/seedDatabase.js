import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

const userOne = {
    input: {
        name: 'Jen',
        email: 'jen@example.com',
        password: bcrypt.hashSync('Red12345!')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'Rajiv',
        email: 'rajiv@example.com',
        password: bcrypt.hashSync('Blue12345!')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: 'Published Test Post Title',
        body: "Some post body...",
        published: true,
    },
    post: undefined
}

const postTwo = {
    input: {
        title: 'Draft Test Post Title',
        body: "Some other post body...",
        published: false
    },
    post: undefined
}

const commentOne = {
    input: {
        text: "this is the first comment"
    },
    comment: undefined
}

const commentTwo = {
    input: {
        text: "this is the second comment"
    },
    comment: undefined
}

const seedDb = async () => {
    // delete everything from db
    await prisma.mutation.deleteManyComments()
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()

    // Create test user
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    // Create test user 2
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

    // Create Post One
    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // Create Post Two
    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // Create First Comment
    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }

        }
    })

    // Create Second Comment
    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }

        }
    })
}

export { seedDb as default, userOne, postOne, postTwo, userTwo, commentOne, commentTwo }