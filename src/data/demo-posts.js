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
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'Amazing shot! 📸',
                createdAt: now - 1800000,
                likedBy: ['user1'] // Sarah Johnson likes this comment
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
                by: { _id: 'user1', fullname: 'Sarah Johnson', username: 'sarah_photography', imgUrl: 'https://i.pravatar.cc/150?img=1' },
                txt: 'Looks incredible!',
                createdAt: now - 900000,
                likedBy: ['64f0a1c2b3d4e5f678901234', 'user2', 'user4'] // Liked by Amir, Mike, and Alex
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
                by: { _id: 'user5', fullname: 'Luna Martinez', username: 'luna_art', imgUrl: 'https://i.pravatar.cc/150?img=5' },
                txt: 'Great job! 🔥',
                createdAt: now - 300000,
                likedBy: ['user3', 'user2'] // Liked by Emma and Mike
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
    },
    // Posts for suggested users
    {
        _id: 'post8',
        txt: 'Late night studio session 🎧 New track dropping soon!',
        imgUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
        tags: ['music', 'studio', 'producer'],
        by: {
            _id: 'user7',
            fullname: 'David Rodriguez',
            username: 'david_music',
            imgUrl: 'https://i.pravatar.cc/150?img=7'
        },
        likedBy: ['user8', 'user9'],
        comments: [],
        createdAt: now - 2400000 // 40 minutes ago
    },
    {
        _id: 'post9',
        txt: 'Morning yoga flow by the ocean 🧘‍♀️ Find your inner peace',
        imgUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center',
        tags: ['yoga', 'meditation', 'wellness'],
        by: {
            _id: 'user8',
            fullname: 'Jessica Williams',
            username: 'jessica_yoga',
            imgUrl: 'https://i.pravatar.cc/150?img=8'
        },
        likedBy: ['user7', 'user9', 'user10'],
        comments: [],
        createdAt: now - 3600000 // 1 hour ago
    },
    {
        _id: 'post10',
        txt: 'Homemade fresh pasta with truffle oil 🍝 Italian tradition meets modern technique',
        imgUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop&crop=center',
        tags: ['food', 'italian', 'pasta', 'chef'],
        by: {
            _id: 'user9',
            fullname: 'Carlos Mendez',
            username: 'carlos_chef',
            imgUrl: 'https://i.pravatar.cc/150?img=9'
        },
        likedBy: ['user8', 'user10'],
        comments: [],
        createdAt: now - 4800000 // 80 minutes ago
    },
    {
        _id: 'post11',
        txt: 'Working on a new mobile app design 📱 Clean, minimal, beautiful',
        imgUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=400&fit=crop&crop=center',
        tags: ['design', 'ux', 'mobile', 'ui'],
        by: {
            _id: 'user10',
            fullname: 'Maya Patel',
            username: 'maya_design',
            imgUrl: 'https://i.pravatar.cc/150?img=10'
        },
        likedBy: ['user9', 'user11'],
        comments: [],
        createdAt: now - 5400000 // 90 minutes ago
    },
    {
        _id: 'post12',
        txt: 'Summit sunrise hike 🏔️ Nothing beats this view at 6000ft',
        imgUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=400&fit=crop&crop=center',
        tags: ['hiking', 'adventure', 'mountains', 'sunrise'],
        by: {
            _id: 'user11',
            fullname: 'Tom Anderson',
            username: 'tom_outdoor',
            imgUrl: 'https://i.pravatar.cc/150?img=11'
        },
        likedBy: ['user10', 'user12'],
        comments: [],
        createdAt: now - 7200000 // 2 hours ago
    },
    {
        _id: 'post13',
        txt: 'Currently reading "The Seven Husbands of Evelyn Hugo" 📖 Absolutely captivating!',
        imgUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
        tags: ['books', 'reading', 'literature'],
        by: {
            _id: 'user12',
            fullname: 'Sophie Turner',
            username: 'sophie_books',
            imgUrl: 'https://i.pravatar.cc/150?img=12'
        },
        likedBy: ['user11', 'user13'],
        comments: [],
        createdAt: now - 8640000 // 2.4 hours ago
    },
    {
        _id: 'post14',
        txt: 'New trick learned today! 🛹 Street skating never gets old',
        imgUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop&crop=center',
        tags: ['skateboard', 'street', 'tricks', 'urban'],
        by: {
            _id: 'user13',
            fullname: 'Jake Miller',
            username: 'jake_skate',
            imgUrl: 'https://i.pravatar.cc/150?img=13'
        },
        likedBy: ['user12', 'user14'],
        comments: [],
        createdAt: now - 10800000 // 3 hours ago
    },
    {
        _id: 'post15',
        txt: 'Perfect latte art this morning ☕ The key is in the milk texture',
        imgUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&crop=center',
        tags: ['coffee', 'latte', 'barista', 'art'],
        by: {
            _id: 'user14',
            fullname: 'Nina Garcia',
            username: 'nina_coffee',
            imgUrl: 'https://i.pravatar.cc/150?img=14'
        },
        likedBy: ['user13', 'user7'],
        comments: [],
        createdAt: now - 12600000 // 3.5 hours ago
    }
]
