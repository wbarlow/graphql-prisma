import { Prisma } from "prisma-binding";

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
    posts(parent, args, { prisma }, info) {
        const opArgs = {}

        if (args.query) {
            opArgs.where = {
                OR: [{
                    body_contains: args.query
                },
                {
                    title_contains: args.query
                }]
            }
        }
        return prisma.query.posts(opArgs, info)
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
    me() {
        return {
            id: 'abc123',
            name: 'Wayne',
            email: 'wbarlow@gmail.com',
            age: 47
        }
    },
    post() {
        return {
            id: 'xyz789',
            title: 'My Title',
            body: 'foo',
            published: false
        }
    }
}

export { Query as default }
