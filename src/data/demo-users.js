export const demoUsers = [
    {
        _id: '64f0a1c2b3d4e5f678901234',
        username: 'amir.avni',
        fullname: 'Amir Avni',
        imgUrl: 'https://i.pravatar.cc/150?img=1',
        password: 'admin',
        isAdmin: true,
        followers: ['user1', 'user2', 'user3', 'user4', 'user5'],
        following: ['user1', 'user2', 'user3', 'user4', 'user5'],
        savedPosts: []
    },
    {
        _id: 'user1',
        username: 'sarah_photography',
        fullname: 'Sarah Johnson',
        imgUrl: 'https://i.pravatar.cc/150?img=2',
        password: 'demo123',
        isAdmin: false,
        followers: ['64f0a1c2b3d4e5f678901234', 'user2', 'user3'],
        following: ['64f0a1c2b3d4e5f678901234', 'user2', 'user3'],
        savedPosts: []
    },
    {
        _id: 'user2',
        username: 'mike_travels',
        fullname: 'Mike Chen',
        imgUrl: 'https://i.pravatar.cc/150?img=3',
        password: 'demo123',
        isAdmin: false,
        followers: ['64f0a1c2b3d4e5f678901234', 'user1', 'user4'],
        following: ['64f0a1c2b3d4e5f678901234', 'user1', 'user4'],
        savedPosts: []
    },
    {
        _id: 'user3',
        username: 'emma_foodie',
        fullname: 'Emma Rodriguez',
        imgUrl: 'https://i.pravatar.cc/150?img=4',
        password: 'demo123',
        isAdmin: false,
        followers: ['64f0a1c2b3d4e5f678901234', 'user1', 'user5'],
        following: ['64f0a1c2b3d4e5f678901234', 'user1', 'user5'],
        savedPosts: []
    },
    {
        _id: 'user4',
        username: 'alex_fitness',
        fullname: 'Alex Thompson',
        imgUrl: 'https://i.pravatar.cc/150?img=5',
        password: 'demo123',
        isAdmin: false,
        followers: ['64f0a1c2b3d4e5f678901234', 'user2', 'user5'],
        following: ['64f0a1c2b3d4e5f678901234', 'user2', 'user5'],
        savedPosts: []
    },
    {
        _id: 'user5',
        username: 'luna_art',
        fullname: 'Luna Martinez',
        imgUrl: 'https://i.pravatar.cc/150?img=6',
        password: 'demo123',
        isAdmin: false,
        followers: ['64f0a1c2b3d4e5f678901234', 'user3', 'user4'],
        following: ['64f0a1c2b3d4e5f678901234', 'user3', 'user4'],
        savedPosts: []
    }
]
