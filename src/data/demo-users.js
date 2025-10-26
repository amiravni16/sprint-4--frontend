export const demoUsers = [
    {
        _id: '64f0a1c2b3d4e5f678901234',
        username: 'amir.avni',
        fullname: 'Amir Avni',
        imgUrl: '/img/amir-avni.jpg.jpg',
        password: 'admin',
        isAdmin: true,
        followers: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'],
        following: ['user1', 'user2', 'user3', 'user4', 'user5'], // You don't follow user6
        savedPosts: []
    },
    {
        _id: 'user1',
        username: 'sarah_photography',
        fullname: 'Sarah Johnson',
        imgUrl: 'https://i.pravatar.cc/150?img=1',
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
        imgUrl: 'https://i.pravatar.cc/150?img=2',
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
        imgUrl: 'https://i.pravatar.cc/150?img=3',
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
        imgUrl: 'https://i.pravatar.cc/150?img=4',
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
        imgUrl: 'https://i.pravatar.cc/150?img=5',
        password: 'demo123',
        isAdmin: false,
        followers: ['64f0a1c2b3d4e5f678901234', 'user3', 'user4'],
        following: ['64f0a1c2b3d4e5f678901234', 'user3', 'user4'],
        savedPosts: []
    },
    {
        _id: 'user6',
        username: 'test_follower',
        fullname: 'Test Follower',
        imgUrl: 'https://i.pravatar.cc/150?img=6',
        password: 'demo123',
        isAdmin: false,
        followers: ['user1', 'user2'], // This user has followers but not you
        following: ['64f0a1c2b3d4e5f678901234'], // This user follows you
        savedPosts: []
    },
    // Additional users for suggestions (not followed by amir.avni)
    {
        _id: 'user7',
        username: 'david_music',
        fullname: 'David Rodriguez',
        imgUrl: 'https://i.pravatar.cc/150?img=7',
        bio: '🎵 Music Producer | LA Studio Sessions',
        password: 'demo123',
        isAdmin: false,
        followers: ['user1', 'user3', 'user8'],
        following: ['user1', 'user2', 'user9'],
        savedPosts: []
    },
    {
        _id: 'user8',
        username: 'jessica_yoga',
        fullname: 'Jessica Williams',
        imgUrl: 'https://i.pravatar.cc/150?img=8',
        bio: '🧘‍♀️ Yoga Instructor | Mind • Body • Soul',
        password: 'demo123',
        isAdmin: false,
        followers: ['user2', 'user7', 'user9'],
        following: ['user3', 'user7', 'user10'],
        savedPosts: []
    },
    {
        _id: 'user9',
        username: 'carlos_chef',
        fullname: 'Carlos Mendez',
        imgUrl: 'https://i.pravatar.cc/150?img=9',
        bio: '👨‍🍳 Chef | Italian Cuisine Specialist',
        password: 'demo123',
        isAdmin: false,
        followers: ['user7', 'user8', 'user10'],
        following: ['user1', 'user8'],
        savedPosts: []
    },
    {
        _id: 'user10',
        username: 'maya_design',
        fullname: 'Maya Patel',
        imgUrl: 'https://i.pravatar.cc/150?img=10',
        bio: '🎨 UI/UX Designer | Creating beautiful experiences',
        password: 'demo123',
        isAdmin: false,
        followers: ['user8', 'user9'],
        following: ['user7', 'user9'],
        savedPosts: []
    },
    {
        _id: 'user11',
        username: 'tom_outdoor',
        fullname: 'Tom Anderson',
        imgUrl: 'https://i.pravatar.cc/150?img=11',
        bio: '🏔️ Adventure Guide | Capturing nature\'s beauty',
        password: 'demo123',
        isAdmin: false,
        followers: ['user9', 'user12'],
        following: ['user10', 'user12'],
        savedPosts: []
    },
    {
        _id: 'user12',
        username: 'sophie_books',
        fullname: 'Sophie Turner',
        imgUrl: 'https://i.pravatar.cc/150?img=12',
        bio: '📚 Book Reviewer | Literary enthusiast',
        password: 'demo123',
        isAdmin: false,
        followers: ['user10', 'user11'],
        following: ['user8', 'user11'],
        savedPosts: []
    },
    {
        _id: 'user13',
        username: 'jake_skate',
        fullname: 'Jake Miller',
        imgUrl: 'https://i.pravatar.cc/150?img=13',
        bio: '🛹 Pro Skateboarder | Street style vibes',
        password: 'demo123',
        isAdmin: false,
        followers: ['user11', 'user14'],
        following: ['user12', 'user14'],
        savedPosts: []
    },
    {
        _id: 'user14',
        username: 'nina_coffee',
        fullname: 'Nina Garcia',
        imgUrl: 'https://i.pravatar.cc/150?img=14',
        bio: '☕ Coffee Enthusiast | Brewing the perfect cup',
        password: 'demo123',
        isAdmin: false,
        followers: ['user12', 'user13'],
        following: ['user10', 'user13'],
        savedPosts: []
    }
]
