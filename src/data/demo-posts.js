// Using a base timestamp to ensure stable, realistic post times
const now = Date.now()

export const demoPosts = [
    {
        _id: 'post1',
        txt: 'Beautiful sunset at the beach! 🌅 Golden hour perfection.',
        imgUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
        tags: ['sunset', 'beach', 'nature', 'goldenhour'],
        by: {
            _id: 'user1',
            fullname: 'Sarah Johnson',
            username: 'sarah_photography',
            imgUrl: 'https://i.pravatar.cc/150?u=sarah'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user2', 'user3', 'user4', 'user11', 'user13', 'user20'],
        comments: [
            {
                id: 'comment1',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'Stunning capture! 📸',
                createdAt: now - 1800000,
                likedBy: ['user1']
            },
            {
                id: 'comment2',
                by: { _id: 'user2', fullname: 'Mike Chen', username: 'mike_travels', imgUrl: 'https://i.pravatar.cc/150?u=mike' },
                txt: 'This is absolutely gorgeous! Where was this?',
                createdAt: now - 1650000,
                likedBy: ['user1', 'user11']
            },
            {
                id: 'comment3',
                by: { _id: 'user3', fullname: 'Emma Rodriguez', username: 'emma_foodie', imgUrl: 'https://i.pravatar.cc/150?u=emma' },
                txt: 'Pure magic ✨',
                createdAt: now - 1500000,
                likedBy: ['user1', '64f0a1c2b3d4e5f678901234', 'user4']
            }
        ],
        createdAt: now - 3600000
    },
    {
        _id: 'post2',
        txt: 'Coffee and coding ☕️💻 Perfect way to start the day!',
        imgUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=800&fit=crop',
        tags: ['coffee', 'coding', 'work', 'morning'],
        by: {
            _id: '64f0a1c2b3d4e5f678901234',
            fullname: 'Amir Avni',
            username: 'amir.avni',
            imgUrl: '/img/amir-avni.jpg.jpg'
        },
        likedBy: ['user1', 'user3', 'user6', 'user18', 'user4'],
        comments: [
            {
                id: 'comment4',
                by: { _id: 'user6', fullname: 'James Wilson', username: 'james_tech', imgUrl: 'https://i.pravatar.cc/150?u=james' },
                txt: 'Looks familiar! 😄',
                createdAt: now - 7000000,
                likedBy: ['64f0a1c2b3d4e5f678901234', 'user1']
            },
            {
                id: 'comment5',
                by: { _id: 'user3', fullname: 'Emma Rodriguez', username: 'emma_foodie', imgUrl: 'https://i.pravatar.cc/150?u=emma' },
                txt: 'That coffee looks amazing!',
                createdAt: now - 6800000,
                likedBy: ['64f0a1c2b3d4e5f678901234']
            }
        ],
        createdAt: now - 7200000
    },
    {
        _id: 'post3',
        txt: 'Exploring the mountains today! 🏔️ The view is absolutely worth the climb.',
        imgUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=800&fit=crop',
        tags: ['mountains', 'hiking', 'adventure', 'nature'],
        by: {
            _id: 'user2',
            fullname: 'Mike Chen',
            username: 'mike_travels',
            imgUrl: 'https://i.pravatar.cc/150?u=mike'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user1', 'user4', 'user12', 'user14', 'user20'],
        comments: [
            {
                id: 'comment6',
                by: { _id: 'user1', fullname: 'Sarah Johnson', username: 'sarah_photography', imgUrl: 'https://i.pravatar.cc/150?u=sarah' },
                txt: 'Incredible! What trail is this?',
                createdAt: now - 10000000,
                likedBy: ['user2', '64f0a1c2b3d4e5f678901234', 'user4', 'user12']
            },
            {
                id: 'comment7',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'Looks amazing! Adding to my bucket list 📍',
                createdAt: now - 9800000,
                likedBy: ['user2', 'user4']
            },
            {
                id: 'comment8',
                by: { _id: 'user12', fullname: 'Tom Anderson', username: 'tom_outdoor', imgUrl: 'https://i.pravatar.cc/150?u=tom' },
                txt: 'Been there! Such an amazing hike! 🥾',
                createdAt: now - 9600000,
                likedBy: ['user2']
            }
        ],
        createdAt: now - 10800000
    },
    {
        _id: 'post4',
        txt: 'Homemade pasta for dinner 🍝 Fresh ingredients make all the difference!',
        imgUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=800&fit=crop',
        tags: ['food', 'cooking', 'pasta', 'dinner'],
        by: {
            _id: 'user3',
            fullname: 'Emma Rodriguez',
            username: 'emma_foodie',
            imgUrl: 'https://i.pravatar.cc/150?u=emma'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user2', 'user10', 'user14', 'user1'],
        comments: [
            {
                id: 'comment9',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'That looks delicious! Can I get the recipe? 😋',
                createdAt: now - 14000000,
                likedBy: ['user3', 'user10']
            },
            {
                id: 'comment10',
                by: { _id: 'user10', fullname: 'Carlos Mendez', username: 'carlos_chef', imgUrl: 'https://i.pravatar.cc/150?u=carlos' },
                txt: 'Beautiful presentation! Great work 👏',
                createdAt: now - 13800000,
                likedBy: ['user3']
            }
        ],
        createdAt: now - 14400000
    },
    {
        _id: 'post5',
        txt: 'Morning workout complete! 💪 Starting the day strong!',
        imgUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop',
        tags: ['fitness', 'workout', 'morning', 'gains'],
        by: {
            _id: 'user4',
            fullname: 'Alex Thompson',
            username: 'alex_fitness',
            imgUrl: 'https://i.pravatar.cc/150?u=alex'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user1', 'user3', 'user5', 'user16', 'user8'],
        comments: [
            {
                id: 'comment11',
                by: { _id: 'user5', fullname: 'Luna Martinez', username: 'luna_art', imgUrl: 'https://i.pravatar.cc/150?u=luna' },
                txt: 'Great job! 💪',
                createdAt: now - 18000000,
                likedBy: ['user4', 'user3']
            },
            {
                id: 'comment12',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'Motivation right here! Keep it up 🔥',
                createdAt: now - 17800000,
                likedBy: ['user4', 'user16']
            },
            {
                id: 'comment13',
                by: { _id: 'user16', fullname: 'Ryan Mitchell', username: 'ryan_sports', imgUrl: 'https://i.pravatar.cc/150?u=ryan' },
                txt: 'Love seeing this dedication! 💪',
                createdAt: now - 17600000,
                likedBy: ['user4']
            }
        ],
        createdAt: now - 18000000
    },
    {
        _id: 'post6',
        txt: 'Working on my latest painting 🎨 Art is my therapy',
        imgUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
        tags: ['art', 'painting', 'creative', 'therapy'],
        by: {
            _id: 'user5',
            fullname: 'Luna Martinez',
            username: 'luna_art',
            imgUrl: 'https://i.pravatar.cc/150?u=luna'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user1', 'user2', 'user11', 'user20'],
        comments: [
            {
                id: 'comment14',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'Absolutely stunning! The colors are mesmerizing ✨',
                createdAt: now - 21000000,
                likedBy: ['user5', 'user11']
            },
            {
                id: 'comment15',
                by: { _id: 'user11', fullname: 'Maya Patel', username: 'maya_design', imgUrl: 'https://i.pravatar.cc/150?u=maya' },
                txt: 'Love the composition and color palette! Beautiful work 🎨',
                createdAt: now - 20800000,
                likedBy: ['user5']
            }
        ],
        createdAt: now - 21600000
    },
    {
        _id: 'post7',
        txt: 'New camera lens arrived! 📷 Can\'t wait to test it out!',
        imgUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=800&fit=crop',
        tags: ['photography', 'gear', 'equipment'],
        by: {
            _id: 'user1',
            fullname: 'Sarah Johnson',
            username: 'sarah_photography',
            imgUrl: 'https://i.pravatar.cc/150?u=sarah'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user2', 'user20', 'user6'],
        comments: [
            {
                id: 'comment16',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'Exciting! Looking forward to seeing what you create with it!',
                createdAt: now - 8000000,
                likedBy: ['user1']
            }
        ],
        createdAt: now - 8400000
    },
    {
        _id: 'post8',
        txt: 'Late night studio session 🎧 New track dropping soon!',
        imgUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop',
        tags: ['music', 'studio', 'producer', 'newmusic'],
        by: {
            _id: 'user7',
            fullname: 'Olivia Brown',
            username: 'olivia_music',
            imgUrl: 'https://i.pravatar.cc/150?u=olivia'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user8', 'user9', 'user15'],
        comments: [
            {
                id: 'comment17',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'Can\'t wait to hear it! 👂',
                createdAt: now - 2400000,
                likedBy: ['user7', 'user8']
            },
            {
                id: 'comment18',
                by: { _id: 'user8', fullname: 'David Rodriguez', username: 'david_music', imgUrl: 'https://i.pravatar.cc/150?u=david' },
                txt: 'Sounds amazing! Let me know if you need any help mixing!',
                createdAt: now - 2200000,
                likedBy: ['user7']
            }
        ],
        createdAt: now - 3000000
    },
    {
        _id: 'post9',
        txt: 'Morning yoga flow by the ocean 🧘‍♀️ Find your inner peace',
        imgUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop',
        tags: ['yoga', 'meditation', 'wellness', 'peace'],
        by: {
            _id: 'user9',
            fullname: 'Jessica Williams',
            username: 'jessica_yoga',
            imgUrl: 'https://i.pravatar.cc/150?u=jessica'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user7', 'user8', 'user10', 'user14'],
        comments: [
            {
                id: 'comment19',
                by: { _id: 'user8', fullname: 'David Rodriguez', username: 'david_music', imgUrl: 'https://i.pravatar.cc/150?u=david' },
                txt: 'This is exactly what I needed to see this morning! 🙏',
                createdAt: now - 3400000,
                likedBy: ['user9']
            },
            {
                id: 'comment20',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'Perfect way to start the day! Namaste 🧘',
                createdAt: now - 3200000,
                likedBy: ['user9', 'user14']
            }
        ],
        createdAt: now - 3600000
    },
    {
        _id: 'post10',
        txt: 'Homemade fresh pasta with truffle oil 🍝 Italian tradition meets modern technique',
        imgUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=800&fit=crop',
        tags: ['food', 'italian', 'pasta', 'chef', 'gourmet'],
        by: {
            _id: 'user10',
            fullname: 'Carlos Mendez',
            username: 'carlos_chef',
            imgUrl: 'https://i.pravatar.cc/150?u=carlos'
        },
        likedBy: ['64f0a1c2b3d4e5f678901234', 'user3', 'user9', 'user14', 'user1'],
        comments: [
            {
                id: 'comment21',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'This looks like it belongs in a fine dining restaurant! 👨‍🍳',
                createdAt: now - 4600000,
                likedBy: ['user10', 'user3']
            },
            {
                id: 'comment22',
                by: { _id: 'user3', fullname: 'Emma Rodriguez', username: 'emma_foodie', imgUrl: 'https://i.pravatar.cc/150?u=emma' },
                txt: 'Recipe please! This is incredible!',
                createdAt: now - 4400000,
                likedBy: ['user10']
            }
        ],
        createdAt: now - 4800000
    },
    {
        _id: 'post11',
        txt: 'Working on a new mobile app design 📱 Clean, minimal, beautiful',
        imgUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=800&fit=crop',
        tags: ['design', 'ux', 'mobile', 'ui'],
        by: {
            _id: 'user11',
            fullname: 'Maya Patel',
            username: 'maya_design',
            imgUrl: 'https://i.pravatar.cc/150?u=maya'
        },
        likedBy: ['user5', 'user6', 'user12', 'user17'],
        comments: [
            {
                id: 'comment23',
                by: { _id: 'user6', fullname: 'James Wilson', username: 'james_tech', imgUrl: 'https://i.pravatar.cc/150?u=james' },
                txt: 'Love the aesthetic! Clean and modern 💯',
                createdAt: now - 5200000,
                likedBy: ['user11', 'user12']
            }
        ],
        createdAt: now - 5400000
    },
    {
        _id: 'post12',
        txt: 'Summit sunrise hike 🏔️ Nothing beats this view at 6000ft',
        imgUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=800&fit=crop',
        tags: ['hiking', 'adventure', 'mountains', 'sunrise'],
        by: {
            _id: 'user12',
            fullname: 'Tom Anderson',
            username: 'tom_outdoor',
            imgUrl: 'https://i.pravatar.cc/150?u=tom'
        },
        likedBy: ['user2', 'user11', 'user13', 'user14', '64f0a1c2b3d4e5f678901234'],
        comments: [
            {
                id: 'comment24',
                by: { _id: 'user2', fullname: 'Mike Chen', username: 'mike_travels', imgUrl: 'https://i.pravatar.cc/150?u=mike' },
                txt: 'Breathtaking! Which trail is this?',
                createdAt: now - 7000000,
                likedBy: ['user12']
            },
            {
                id: 'comment25',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'Absolutely stunning view! Worth the early morning wake up 🌅',
                createdAt: now - 6800000,
                likedBy: ['user12', 'user14']
            }
        ],
        createdAt: now - 7200000
    },
    {
        _id: 'post13',
        txt: 'Currently reading "The Seven Husbands of Evelyn Hugo" 📖 Absolutely captivating!',
        imgUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop',
        tags: ['books', 'reading', 'literature', 'novels'],
        by: {
            _id: 'user13',
            fullname: 'Sophie Turner',
            username: 'sophie_books',
            imgUrl: 'https://i.pravatar.cc/150?u=sophie'
        },
        likedBy: ['user11', 'user12', 'user14', 'user1'],
        comments: [
            {
                id: 'comment26',
                by: { _id: 'user14', fullname: 'Jake Miller', username: 'jake_skate', imgUrl: 'https://i.pravatar.cc/150?u=jake' },
                txt: 'Great book! What do you think so far?',
                createdAt: now - 8500000,
                likedBy: ['user13']
            }
        ],
        createdAt: now - 8640000
    },
    {
        _id: 'post14',
        txt: 'New trick learned today! 🛹 Street skating never gets old',
        imgUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=800&fit=crop',
        tags: ['skateboard', 'street', 'tricks', 'urban'],
        by: {
            _id: 'user14',
            fullname: 'Jake Miller',
            username: 'jake_skate',
            imgUrl: 'https://i.pravatar.cc/150?u=jake'
        },
        likedBy: ['user13', 'user15', 'user11', 'user9'],
        comments: [
            {
                id: 'comment27',
                by: { _id: 'user13', fullname: 'Sophie Turner', username: 'sophie_books', imgUrl: 'https://i.pravatar.cc/150?u=sophie' },
                txt: 'That\'s so cool! How long have you been skating?',
                createdAt: now - 10500000,
                likedBy: ['user14', 'user15']
            },
            {
                id: 'comment28',
                by: { _id: 'user15', fullname: 'Nina Garcia', username: 'nina_coffee', imgUrl: 'https://i.pravatar.cc/150?u=nina' },
                txt: 'Sick moves! 🔥',
                createdAt: now - 10300000,
                likedBy: ['user14']
            }
        ],
        createdAt: now - 10800000
    },
    {
        _id: 'post15',
        txt: 'Perfect latte art this morning ☕ The key is in the milk texture',
        imgUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop',
        tags: ['coffee', 'latte', 'barista', 'art'],
        by: {
            _id: 'user15',
            fullname: 'Nina Garcia',
            username: 'nina_coffee',
            imgUrl: 'https://i.pravatar.cc/150?u=nina'
        },
        likedBy: ['user14', 'user13', 'user10', 'user9', '64f0a1c2b3d4e5f678901234'],
        comments: [
            {
                id: 'comment29',
                by: { _id: '64f0a1c2b3d4e5f678901234', fullname: 'Amir Avni', username: 'amir.avni', imgUrl: '/img/amir-avni.jpg.jpg' },
                txt: 'Beautiful art! I wish I could make lattes like this',
                createdAt: now - 12500000,
                likedBy: ['user15']
            },
            {
                id: 'comment30',
                by: { _id: 'user10', fullname: 'Carlos Mendez', username: 'carlos_chef', imgUrl: 'https://i.pravatar.cc/150?u=carlos' },
                txt: 'Coffee and art combined! Love it ☕',
                createdAt: now - 12300000,
                likedBy: ['user15', 'user14']
            }
        ],
        createdAt: now - 12600000
    },
    {
        _id: 'post16',
        txt: 'Soccer game with the team ⚽ What a win!',
        imgUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=800&fit=crop',
        tags: ['soccer', 'sports', 'team', 'football'],
        by: {
            _id: 'user16',
            fullname: 'Ryan Mitchell',
            username: 'ryan_sports',
            imgUrl: 'https://i.pravatar.cc/150?u=ryan'
        },
        likedBy: ['user1', 'user4', 'user18'],
        comments: [
            {
                id: 'comment31',
                by: { _id: 'user4', fullname: 'Alex Thompson', username: 'alex_fitness', imgUrl: 'https://i.pravatar.cc/150?u=alex' },
                txt: 'Great game! Well played!',
                createdAt: now - 6000000,
                likedBy: ['user16']
            }
        ],
        createdAt: now - 6600000
    },
    {
        _id: 'post17',
        txt: 'Working on a new collection 👗 Fashion week prep!',
        imgUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop',
        tags: ['fashion', 'style', 'design', 'clothes'],
        by: {
            _id: 'user17',
            fullname: 'Samantha Lee',
            username: 'samantha_fashion',
            imgUrl: 'https://i.pravatar.cc/150?u=samantha'
        },
        likedBy: ['user5', 'user11'],
        comments: [],
        createdAt: now - 12000000
    },
    {
        _id: 'post18',
        txt: 'Esports tournament prep 🎮 Ready for tomorrow!',
        imgUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=800&fit=crop',
        tags: ['gaming', 'esports', 'tournament', 'competitive'],
        by: {
            _id: 'user18',
            fullname: 'Kevin Park',
            username: 'kevin_gaming',
            imgUrl: 'https://i.pravatar.cc/150?u=kevin'
        },
        likedBy: ['user6', 'user16'],
        comments: [],
        createdAt: now - 3000000
    },
    {
        _id: 'post19',
        txt: 'My thriving garden 🌱 Nothing beats fresh vegetables!',
        imgUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=800&fit=crop',
        tags: ['gardening', 'plants', 'vegetables', 'organic'],
        by: {
            _id: 'user19',
            fullname: 'Lisa Green',
            username: 'lisa_gardening',
            imgUrl: 'https://i.pravatar.cc/150?u=lisa'
        },
        likedBy: ['user3', 'user12', 'user15'],
        comments: [
            {
                id: 'comment32',
                by: { _id: 'user3', fullname: 'Emma Rodriguez', username: 'emma_foodie', imgUrl: 'https://i.pravatar.cc/150?u=emma' },
                txt: 'This is amazing! What vegetables are you growing?',
                createdAt: now - 13200000,
                likedBy: ['user19']
            }
        ],
        createdAt: now - 13800000
    },
    {
        _id: 'post20',
        txt: 'Behind the scenes of our latest short film 🎬 Pre-production is everything!',
        imgUrl: 'https://images.unsplash.com/photo-1489184060606-6de67545b8c9?w=800&h=800&fit=crop',
        tags: ['filmmaking', 'cinema', 'behindthescenes', 'production'],
        by: {
            _id: 'user20',
            fullname: 'Max Jackson',
            username: 'max_filmmaker',
            imgUrl: 'https://i.pravatar.cc/150?u=max'
        },
        likedBy: ['user1', 'user7', 'user11', '64f0a1c2b3d4e5f678901234'],
        comments: [
            {
                id: 'comment33',
                by: { _id: 'user1', fullname: 'Sarah Johnson', username: 'sarah_photography', imgUrl: 'https://i.pravatar.cc/150?u=sarah' },
                txt: 'Looking forward to seeing the final cut!',
                createdAt: now - 5400000,
                likedBy: ['user20']
            }
        ],
        createdAt: now - 6000000
    }
]
