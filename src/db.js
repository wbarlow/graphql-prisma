// Demo user data
const users = [ 
    {
        id: '123',
        name: 'Wayne',
        email: 'wbarlow@gmail.com',
        age: 47,

    },
    {
        id: '124',
        name: 'Andrew',
        email: 'andrew@example.com',
        age: 27
    },
    {
        id: '125',
        name: 'Sarah',
        email: 'sarah@example.com'
    }
]

// Demo post data
const posts = [
    {
        id: '789',
        title: 'My Title',
        body: 'a really cool story',
        published: false,
        author: '123'
    },
    {
        id: '790',
        title: 'Your Title',
        body: 'a really bad story',
        published: false,
        author: '124'
    },
    {
        id: '791',
        title: 'Lorem Ipsum',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed \
do eiusmod tempor incididunt ut  labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco \
laboris nisi ut aliquip ex ea commodo consequat. Duis aute \
irure dolor in reprehenderit in voluptate velit esse cillum \
dolore eu fugiat nulla pariatur. Excepteur sint occaecat \
cupidatat non proident, sunt in culpa qui officia deserunt mollit \
anim id est laborum.',
        published: true,
        author: "125"
    }
]

const comments = [
    {
        id: 'abc',
        text: 'this is awesome',
        author: '125',
        post: '789'
    },
    {
        id: 'abd',
        text: 'so cool!!!',
        author: '123',
        post: '790'
    },
    {
        id: 'abe',
        text: 'not sure I completely agree, but interesting topic',
        author: '124',
        post: '791'
    },
    {
        id: 'abf',
        text: 'keep up the good work!',
        author: '123',
        post: '791'
    }
]

const db  = {
    users,
    posts,
    comments
}

export { db as default }

