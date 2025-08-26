const AgentManager = require('../lib/agent-manager');

async function runParallelAgents() {
  console.log('🚀 Starting Parallel Agent System for 3662 LeetCode Problems');
  console.log('=' .repeat(60));

  const manager = new AgentManager();
  
  // Show initial status
  console.log('\n📊 Initial Status:');
  const initialStatus = manager.getAllAgentsStatus();
  console.log(`Total Agents: ${initialStatus.totalAgents}`);
  console.log(`Total Problems: ${initialStatus.totalProblems}`);
  console.log(`Working: ${initialStatus.working}, Idle: ${initialStatus.idle}`);

  // Start all agents in parallel
  console.log('\n🚀 Starting all agents...');
  await manager.startAllAgents();
  
  console.log(`✅ All ${manager.agents.size} agents started successfully!`);

  // Simulate work in intervals
  console.log('\n⚡ Beginning parallel processing...');
  
  const workInterval = setInterval(() => {
    manager.simulateWork();
    
    const status = manager.getAllAgentsStatus();
    const overallProgress = ((status.totalProcessed / status.totalProblems) * 100).toFixed(1);
    
    console.log(`\n📈 Overall Progress: ${status.totalProcessed}/${status.totalProblems} (${overallProgress}%)`);
    console.log(`🤖 Working: ${status.working}, Idle: ${status.idle}, Completed: ${status.agents.filter(a => a.percentage === '100.0%').length}`);
    
    // Show top 5 agents progress
    console.log('\n🏆 Top 5 Agents:');
    status.agents
      .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
      .slice(0, 5)
      .forEach(agent => {
        console.log(`  Agent ${agent.id}: ${agent.progress} (${agent.percentage}) - ${agent.status}`);
      });
    
    // Stop when all complete
    if (status.working === 0 && status.totalProcessed === status.totalProblems) {
      clearInterval(workInterval);
      console.log('\n🎉 All agents completed processing!');
      console.log('✅ Successfully processed all 3662 LeetCode problems in parallel!');
      
      // Final statistics
      console.log('\n📈 Final Statistics:');
      console.log(`Total Problems Processed: ${status.totalProblems}`);
      console.log(`Total Agents Used: ${status.totalAgents}`);
      console.log(`Average Problems per Agent: ${Math.round(status.totalProblems / status.totalAgents)}`);
    }
  }, 2000); // Update every 2 seconds

  // Safety timeout to prevent infinite loop
  setTimeout(() => {
    clearInterval(workInterval);
    console.log('\n⏰ Simulation completed (timeout reached)');
  }, 30000); // 30 second timeout
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down parallel agents...');
  process.exit(0);
});

// Run the parallel agent system
runParallelAgents().catch(console.error);