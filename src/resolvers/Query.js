const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }
        
        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        }
        
        return db.posts.filter((post) => {
            return post.title.toLowerCase().includes(args.query.toLowerCase()) ||
                    post.body.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    comments(parent, args, { db }, info) {
        if (!args.query) {
            return db.comments;
        }
        
        return db.comments.filter((comment) => {
            return comment.text.toLowerCase().includes(args.query.toLowerCase())
        })
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
