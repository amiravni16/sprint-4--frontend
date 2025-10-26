// Using a base timestamp to ensure stable, realistic post times
const now = Date.now()

export const demoPosts = [
    {
        _id: 'post1',
        txt: 'Beautiful sunset at the beach! 🌅',
        imgUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
        tags: ['sunset', 'beach', 'nature'],
        by: {
            _id: 'user1',
            fullname: 'Sarah Johnson',
            username: 'sarah_photography',
            imgUrl: 'https://i.pravatar.cc/150?img=1'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user2'],
        comments: [
            {
                id: 'comment1',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni' },
                txt: 'Amazing shot! 📸',
                createdAt: now - 1800000
            }
        ],
        createdAt: now - 3600000 // 1 hour ago
    },
    {
        _id: 'post2',
        txt: 'Coffee and coding ☕️💻',
        imgUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop&crop=center',
        tags: ['coffee', 'coding', 'work'],
        by: {
            _id: '64f0a1c2b3d4e5f678901234',
            fullname: 'Amir Avni',
            username: 'amir.avni',
            imgUrl: '/img/amir-avni.jpg.jpg'
        },
        likedBy: ['user1', 'user3'],
        comments: [],
        createdAt: now - 7200000 // 2 hours ago
    },
    {
        _id: 'post3',
        txt: 'Exploring the mountains today! 🏔️',
        imgUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=400&fit=crop&crop=center',
        tags: ['mountains', 'hiking', 'adventure'],
        by: {
            _id: 'user2',
            fullname: 'Mike Chen',
            username: 'mike_travels',
            imgUrl: 'https://i.pravatar.cc/150?img=2'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user1', 'user4'],
        comments: [
            {
                id: 'comment2',
                by: { _id: 'user1', fullname: 'Sarah Johnson', username: 'sarah_photography' },
                txt: 'Looks incredible!',
                createdAt: now - 900000
            }
        ],
        createdAt: now - 10800000 // 3 hours ago
    },
    {
        _id: 'post4',
        txt: 'Homemade pasta for dinner 🍝',
        imgUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop&crop=center',
        tags: ['food', 'cooking', 'pasta'],
        by: {
            _id: 'user3',
            fullname: 'Emma Rodriguez',
            username: 'emma_foodie',
            imgUrl: 'https://i.pravatar.cc/150?img=3'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user2'],
        comments: [],
        createdAt: now - 14400000 // 4 hours ago
    },
    {
        _id: 'post5',
        txt: 'Morning workout complete! 💪',
        imgUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
        tags: ['fitness', 'workout', 'morning'],
        by: {
            _id: 'user4',
            fullname: 'Alex Thompson',
            username: 'alex_fitness',
            imgUrl: 'https://i.pravatar.cc/150?img=4'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user1', 'user3', 'user5'],
        comments: [
            {
                id: 'comment3',
                by: { _id: 'user5', fullname: 'Luna Martinez', username: 'luna_art' },
                txt: 'Great job! 🔥',
                createdAt: now - 300000
            }
        ],
        createdAt: now - 18000000 // 5 hours ago
    },
    {
        _id: 'post6',
        txt: 'Working on my latest painting 🎨',
        imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
        tags: ['art', 'painting', 'creative'],
        by: {
            _id: 'user5',
            fullname: 'Luna Martinez',
            username: 'luna_art',
            imgUrl: 'https://i.pravatar.cc/150?img=5'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user1', 'user2'],
        comments: [],
        createdAt: now - 21600000 // 6 hours ago
    },
    {
        _id: 'post7',
        txt: 'Testing the follow functionality! This user follows you but you don\'t follow them back 👀',
        imgUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=400&fit=crop&crop=center',
        tags: ['test', 'follow', 'demo'],
        by: {
            _id: 'user6',
            fullname: 'Test Follower',
            username: 'test_follower',
            imgUrl: 'https://i.pravatar.cc/150?img=6'
        },
        likedBy: ['user1', 'user2'],
        comments: [],
        createdAt: now - 1800000 // 30 minutes ago
    }
]
