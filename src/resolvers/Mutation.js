import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer.')
        }

        const emailTaken = await prisma.exists.User({ email: args.data.email })
        
        if (emailTaken) {
            throw new Error('Email taken.')
        }

        const hashedPassword = await bcrypt.hash(args.data.password, 10)
        const user = await prisma.mutation.createUser({ 
            data: {
                ...args.data, 
                password: hashedPassword
            }
        })

        return  {
            user,
            token: jwt.sign({id: user.id}, 'thisisasecret')
        }
    },
    async loginUser(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        }) 

        if (!user) {
            throw new Error("Unable to login")
        }

        const match = await bcrypt.compare(args.data.password, user.password)

        if (!match) {
            throw new Error("Unable to login")
        } 

        return {
            user,
            token: jwt.sign({id: user.id}, 'thisisasecret')
        }
    },
    async deleteUser(parent, args, { prisma }, info) {
        const userExists = await prisma.exists.User({ id: args.id})

        if (!userExists) {
            throw new Error("User not found!")
        }

        return prisma.mutation.deleteUser({ 
            where: {
                id: args.id
            }
        }, info)
    },
    async updateUser(parent, args, { prisma }, info) {
        const userExists = await prisma.exists.User({ id: args.id})

        if (!userExists) {
            throw new Error("User not found!")
        }

        return prisma.mutation.updateUser({
            data: args.data,
            where: {
                id: args.id 
            }
        }, info)

    },
    async createPost(parent, args, { prisma }, info) {
        const isValidUser = await prisma.exists.User({ id: args.data.author})

        if (!isValidUser) {
            throw new Error('User not found!')
        }

        return prisma.mutation.createPost({ 
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: args.data.author
                    }
                }
        } }, info)
    },
    async updatePost(parent, args, { prisma }, info) {
        const postExists = await prisma.exists.Post({id: args.id})

        if (!postExists) {
            throw new Error('Post not found')
        }

        return prisma.mutation.updatePost({
            data: args.data,
            where: {
                id: args.id
            }
        }, info)
    },
    async deletePost(parent, args, { prisma }, info) {
        const postExists = await prisma.exists.Post({id: args.id})

        if (!postExists) {
            throw new Error('Post not found')
        }

        return prisma.mutation.deletePost({ where: { id: args.id }}, info)
    },
    async createComment(parent, args, { prisma }, info) {
        const isValidUser = await prisma.exists.User({id: args.data.author})
        const isValidPost = await prisma.exists.Post({id: args.data.post})
        
        console.warn(isValidPost)

        if (!isValidUser || !isValidPost) {
            throw new Error('User or Post not found.')
        }
        
        // TBD: need to check if published

        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            } 
        }, info)
    },
    async deleteComment(parent, args, { prisma }, info) {
        const commentExists = await prisma.exists.Comment({id: args.id})
        
        if (!commentExists) {
            throw new Error('Comment not found!')
        }

        return(prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info))
    },
    async updateComment(parent, args, { prisma }, info) {
        const commentExists = await prisma.exists.Comment({id: args.id})
        
        if (!commentExists) {
            throw new Error('Comment not found!')
        }

        return prisma.mutation.updateComment({
            data: args.data,
            where: {
                id: args.id
            }
        }, info)
    }
}

export { Mutation as default }