import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {}

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                },
                {
                    email_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info) 
    },
    async posts(parent, args, { prisma, request }, info) {
        // only return published posts
        const opArgs = {
            where: {
                published: true
            }
        }

        if (args.query) {
            opArgs.where.OR = [
                {
                    body_contains: args.query
                },
                {
                    title_contains: args.query
                }]
        } 
        return await prisma.query.posts(opArgs, info)
    },
    async myPosts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const opArgs = {
            where: {
                author: {
                    id: userId
                } 
            }
        }

        if (args.query) {
            opArgs.where.OR = [
                {
                    body_contains: args.query
                },
                {
                    title_contains: args.query
                }]
        } 
        return await prisma.query.posts(opArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        const opArgs = {}

        if (args.query) {
            opArgs.where = {
                text_contains: args.query
            }
        }
        return prisma.query.comments(opArgs, info)
    },
    async me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return await prisma.query.user({
            where: { 
                id: userId 
            }
        })
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)

        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                },
                {
                    author: {
                        id: userId
                    }
                }]
            }
        })

        if (posts.length === 0) {
            throw new Error('Post not found')
        }

        return posts[0]
    }
}

export { Query as default }
