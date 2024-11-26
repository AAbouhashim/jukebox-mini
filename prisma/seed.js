const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
  try {
    // Seed Users
    const users = await prisma.user.createMany({
      data: [
        { username: 'Alice' },
        { username: 'Bob' },
        { username: 'Charlie' },
      ],
    });

    console.log(`Seeded ${users.count} users.`);

    // Fetch all users
    const allUsers = await prisma.user.findMany();

    // Seed Playlists for each user
    for (const user of allUsers) {
      await prisma.playlist.createMany({
        data: [
          { name: `Playlist 1 for ${user.username}`, description: 'A cool playlist', ownerId: user.id },
          { name: `Playlist 2 for ${user.username}`, description: 'Another cool playlist', ownerId: user.id },
          { name: `Playlist 3 for ${user.username}`, description: 'An awesome playlist', ownerId: user.id },
          { name: `Playlist 4 for ${user.username}`, description: 'A great playlist', ownerId: user.id },
          { name: `Playlist 5 for ${user.username}`, description: 'The best playlist', ownerId: user.id },
        ],
      });
    }

    console.log('Database seeded successfully with users and playlists!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();