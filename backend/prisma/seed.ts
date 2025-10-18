import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1️⃣ Create a user
  const user = await prisma.user.upsert({
    where: { email: 'test@resumemaker.com' },
    update: {},
    create: {
      email: 'test@resumemaker.com',
      name: 'John Doe',
    },
  });

  // 2️⃣ Create a resume for that user
  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: 'Sample Resume',
      data: {
        summary: 'Full-stack Developer passionate about React & Node.js',
        experience: [
          {
            company: 'Tech Co.',
            role: 'Frontend Developer',
            years: '2022-2024',
          },
        ],
        education: [
          {
            degree: 'B.E. in Computer Engineering',
            college: 'TCET',
            year: '2024',
          },
        ],
      },
      template: 'modern',
      theme: { color: '#4F46E5', font: 'Inter' },
    },
  });

  console.log('✅ User and Resume created:');
  console.log({ user, resume });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
