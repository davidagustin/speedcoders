const fs = require('fs');
const path = require('path');

class AgentManager {
  constructor() {
    this.agents = new Map();
    this.problemsPath = path.join(__dirname, '../data/all-leetcode-problems.json');
    this.agentDistPath = path.join(__dirname, '../data/agent-distribution.json');
    this.statusPath = path.join(__dirname, '../data/agent-status.json');
    
    this.initializeAgents();
  }

  initializeAgents() {
    // Load problems and distribution
    const problems = this.loadProblems();
    const distribution = this.loadDistribution();
    
    // Initialize 37 agents (each handles ~100 problems)
    for (let i = 1; i <= 37; i++) {
      this.agents.set(i, {
        id: i,
        status: 'idle',
        assignedProblems: distribution[i] || [],
        processedCount: 0,
        totalProblems: (distribution[i] || []).length,
        currentTask: null,
        startTime: null,
        lastUpdate: Date.now()
      });
    }

    console.log(`🤖 Initialized ${this.agents.size} agents`);
    this.saveStatus();
  }

  loadProblems() {
    try {
      return JSON.parse(fs.readFileSync(this.problemsPath, 'utf8'));
    } catch (error) {
      console.error('❌ Error loading problems:', error.message);
      return [];
    }
  }

  loadDistribution() {
    try {
      return JSON.parse(fs.readFileSync(this.agentDistPath, 'utf8'));
    } catch (error) {
      console.error('❌ Error loading distribution:', error.message);
      return {};
    }
  }

  saveStatus() {
    const status = {
      lastUpdated: new Date().toISOString(),
      totalAgents: this.agents.size,
      agents: Array.from(this.agents.values())
    };
    
    fs.writeFileSync(this.statusPath, JSON.stringify(status, null, 2));
  }

  startAgent(agentId, taskType = 'process_problems') {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    if (agent.status === 'working') {
      console.log(`⚠️ Agent ${agentId} is already working`);
      return;
    }

    agent.status = 'working';
    agent.currentTask = taskType;
    agent.startTime = Date.now();
    agent.lastUpdate = Date.now();

    console.log(`🚀 Started Agent ${agentId} on task: ${taskType}`);
    this.saveStatus();
    
    return agent;
  }

  stopAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    agent.status = 'idle';
    agent.currentTask = null;
    agent.startTime = null;
    agent.lastUpdate = Date.now();

    console.log(`⏹️ Stopped Agent ${agentId}`);
    this.saveStatus();
    
    return agent;
  }

  startAllAgents() {
    console.log('🚀 Starting all agents in parallel...');
    
    const startPromises = [];
    for (const [agentId] of this.agents) {
      startPromises.push(
        new Promise((resolve) => {
          setTimeout(() => {
            this.startAgent(agentId);
            resolve(agentId);
          }, agentId * 100) // Stagger starts by 100ms each
        })
      );
    }

    return Promise.all(startPromises);
  }

  updateAgentProgress(agentId, processedCount) {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    agent.processedCount = processedCount;
    agent.lastUpdate = Date.now();
    
    const progress = ((processedCount / agent.totalProblems) * 100).toFixed(1);
    console.log(`📊 Agent ${agentId}: ${processedCount}/${agent.totalProblems} (${progress}%)`);
    
    this.saveStatus();
  }

  getAgentStatus(agentId) {
    return this.agents.get(agentId);
  }

  getAllAgentsStatus() {
    const summary = {
      totalAgents: this.agents.size,
      working: 0,
      idle: 0,
      totalProblems: 0,
      totalProcessed: 0,
      agents: []
    };

    for (const agent of this.agents.values()) {
      if (agent.status === 'working') summary.working++;
      else summary.idle++;
      
      summary.totalProblems += agent.totalProblems;
      summary.totalProcessed += agent.processedCount;
      summary.agents.push({
        id: agent.id,
        status: agent.status,
        progress: `${agent.processedCount}/${agent.totalProblems}`,
        percentage: ((agent.processedCount / agent.totalProblems) * 100).toFixed(1) + '%'
      });
    }

    return summary;
  }

  simulateWork() {
    console.log('🎯 Simulating parallel agent work...');
    
    // Simulate each agent processing their problems
    for (const [agentId, agent] of this.agents) {
      if (agent.status === 'working') {
        // Simulate processing 5-10 problems per iteration
        const processed = Math.min(
          agent.processedCount + Math.floor(Math.random() * 6) + 5,
          agent.totalProblems
        );
        
        this.updateAgentProgress(agentId, processed);
        
        // If agent finished, mark as idle
        if (processed >= agent.totalProblems) {
          agent.status = 'completed';
          console.log(`✅ Agent ${agentId} completed all problems!`);
        }
      }
    }
    
    this.saveStatus();
  }
}

module.exports = AgentManager;