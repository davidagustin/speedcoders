const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const path = require('path');

const prisma = new PrismaClient();

async function seedAll() {
  console.log('🚀 Starting comprehensive database seeding...\n');
  
  try {
    // Step 1: Seed Problems
    console.log('📝 Step 1: Seeding Problems...');
    try {
      execSync('node seed-questions.js', { 
        cwd: __dirname, 
        stdio: 'inherit' 
      });
      console.log('✅ Problems seeded successfully!\n');
    } catch (error) {
      console.log('⚠️  Problems seeding had issues, continuing...\n');
    }

    // Step 2: Seed Algorithms
    console.log('🧮 Step 2: Seeding Algorithms...');
    try {
      execSync('node seed-algorithms.js', { 
        cwd: __dirname, 
        stdio: 'inherit' 
      });
      console.log('✅ Algorithms seeded successfully!\n');
    } catch (error) {
      console.log('⚠️  Algorithms seeding had issues, continuing...\n');
    }

    // Step 3: Seed Quizzes
    console.log('📋 Step 3: Seeding Quizzes...');
    try {
      execSync('node seed-quizzes.js', { 
        cwd: __dirname, 
        stdio: 'inherit' 
      });
      console.log('✅ Quizzes seeded successfully!\n');
    } catch (error) {
      console.log('⚠️  Quizzes seeding had issues, continuing...\n');
    }

    // Final Summary
    console.log('🎉 All seeding operations completed!');
    
    const totalProblems = await prisma.problem.count();
    const totalAlgorithms = await prisma.algorithm.count();
    const totalQuizzes = await prisma.quiz.count();
    const totalUsers = await prisma.user.count();

    console.log('\n📊 Final Database Summary:');
    console.log(`👥 Users: ${totalUsers}`);
    console.log(`📝 Problems: ${totalProblems}`);
    console.log(`🧮 Algorithms: ${totalAlgorithms}`);
    console.log(`📋 Quizzes: ${totalQuizzes}`);
    
    if (totalUsers === 0) {
      console.log('\n⚠️  Note: No users found. Please create a user account to start using the platform.');
    }

    console.log('\n🎯 Next Steps:');
    console.log('1. Create a user account through the registration page');
    console.log('2. Start practicing with the available quizzes');
    console.log('3. Explore different problem categories and difficulties');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the comprehensive seeding
seedAll();
