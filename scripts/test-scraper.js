const { LeetCodeGraphQLScraper } = require('./leetcode-graphql-scraper');

async function testScraper() {
    console.log('🧪 Testing LeetCode Scraper...');
    
    const scraper = new LeetCodeGraphQLScraper();
    
    try {
        await scraper.initialize();
        
        // Test getting problem list
        console.log('📋 Testing problem list fetch...');
        const problemList = await scraper.getProblemList();
        
        if (problemList.length > 0) {
            console.log(`✅ Successfully fetched ${problemList.length} problems`);
            
            // Test getting details for first problem
            console.log('🔍 Testing problem details fetch...');
            const firstProblem = problemList[0];
            const problemDetails = await scraper.getProblemDetails(firstProblem.titleSlug);
            
            if (problemDetails) {
                console.log(`✅ Successfully fetched details for: ${problemDetails.title}`);
                console.log(`   Difficulty: ${problemDetails.difficulty}`);
                console.log(`   Content length: ${problemDetails.content ? problemDetails.content.length : 0} characters`);
                
                // Save test problem
                const testProblem = {
                    ...firstProblem,
                    ...problemDetails,
                    scrapedAt: new Date().toISOString()
                };
                
                await scraper.saveProblem(testProblem);
                console.log('✅ Test problem saved successfully');
                
            } else {
                console.log('❌ Failed to fetch problem details');
            }
        } else {
            console.log('❌ Failed to fetch problem list');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run test
testScraper();
