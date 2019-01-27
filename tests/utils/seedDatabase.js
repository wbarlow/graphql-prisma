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

const seedDb = async () => {
    // delete everything from db
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()

    // Create test user
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    await prisma.mutation.createPost({
        data: {
            title: 'Published Test Post Title',
            body: "Some post body...",
            published: true,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    await prisma.mutation.createPost({
        data: {
            title: 'Draft Test Post Title',
            body: "Some other post body...",
            published: false,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
}

export { seedDb as default, userOne }