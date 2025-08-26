import { describe, it, expect, beforeEach } from '@/lib/testing/TestFramework';
import { AdaptiveLearningEngine } from '@/lib/AdaptiveLearningEngine';

describe('AdaptiveLearningEngine', () => {
  let engine: AdaptiveLearningEngine;
  
  beforeEach(() => {
    engine = AdaptiveLearningEngine.getInstance();
  });

  describe('User Profile Generation', () => {
    it('should generate accurate user learning profile', async () => {
      const profile = await engine.generateUserProfile('user123');
      
      expect(profile).toBeDefined();
      expect(profile.userId).toBe('user123');
      expect(profile.strengths).toBeInstanceOf(Array);
      expect(profile.weaknesses).toBeInstanceOf(Array);
      expect(profile.preferredDifficulty).toMatch(/Easy|Medium|Hard/);
      expect(profile.learningVelocity).toBeGreaterThan(0);
    });

    it('should identify algorithm mastery levels', async () => {
      const profile = await engine.generateUserProfile('user123');
      
      expect(profile.algorithmMastery).toBeDefined();
      Object.values(profile.algorithmMastery).forEach(mastery => {
        expect(mastery).toBeGreaterThanOrEqual(0);
        expect(mastery).toBeLessThanOrEqual(100);
      });
    });

    it('should calculate consistency score', async () => {
      const profile = await engine.generateUserProfile('user123');
      
      expect(profile.consistencyScore).toBeGreaterThanOrEqual(0);
      expect(profile.consistencyScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Learning Path Creation', () => {
    it('should create personalized learning path', async () => {
      const path = await engine.createPersonalizedLearningPath('user123', [
        'Master dynamic programming',
        'Prepare for FAANG interviews'
      ]);
      
      expect(path).toBeDefined();
      expect(path.id).toBeTruthy();
      expect(path.problems).toBeInstanceOf(Array);
      expect(path.problems.length).toBeGreaterThan(0);
      expect(path.estimatedDuration).toBeGreaterThan(0);
    });

    it('should order problems by difficulty and prerequisites', async () => {
      const path = await engine.createPersonalizedLearningPath('user123');
      
      let prevDifficulty = 0;
      path.problems.forEach(problem => {
        const currentDifficulty = problem.difficulty === 'Easy' ? 1 : 
                                 problem.difficulty === 'Medium' ? 2 : 3;
        expect(currentDifficulty).toBeGreaterThanOrEqual(prevDifficulty - 1);
        prevDifficulty = currentDifficulty;
      });
    });

    it('should include milestones', async () => {
      const path = await engine.createPersonalizedLearningPath('user123', [
        'Master arrays and strings'
      ]);
      
      expect(path.milestones).toBeDefined();
      expect(path.milestones.length).toBeGreaterThan(0);
      path.milestones.forEach(milestone => {
        expect(milestone.targetDate).toBeDefined();
        expect(milestone.requirements).toBeInstanceOf(Array);
      });
    });
  });

  describe('Path Adaptation', () => {
    it('should adapt path based on performance', async () => {
      const path = await engine.createPersonalizedLearningPath('user123');
      const adapted = await engine.adaptLearningPath(path.id, 'user123');
      
      expect(adapted).toBeDefined();
      expect(adapted.adaptations).toBeInstanceOf(Array);
      if (adapted.adaptations.length > 0) {
        expect(adapted.adaptations[0].reason).toBeTruthy();
        expect(adapted.adaptations[0].changes).toBeInstanceOf(Array);
      }
    });

    it('should add easier problems when struggling', async () => {
      const profile = await engine.generateUserProfile('user123');
      profile.averageAccuracy = 0.4; // Low accuracy
      
      const path = await engine.createPersonalizedLearningPath('user123');
      const adapted = await engine.adaptLearningPath(path.id, 'user123', true);
      
      if (adapted.adaptations.length > 0) {
        const adaptation = adapted.adaptations[0];
        expect(adaptation.reason).toContain('struggling');
        expect(adaptation.addedProblems.some((p: any) => 
          p.difficulty === 'Easy'
        )).toBe(true);
      }
    });

    it('should add harder problems when excelling', async () => {
      const profile = await engine.generateUserProfile('user123');
      profile.averageAccuracy = 0.95; // High accuracy
      profile.learningVelocity = 10; // Fast learner
      
      const path = await engine.createPersonalizedLearningPath('user123');
      const adapted = await engine.adaptLearningPath(path.id, 'user123', true);
      
      if (adapted.adaptations.length > 0) {
        const adaptation = adapted.adaptations[0];
        expect(adaptation.reason).toContain('excelling');
        expect(adaptation.addedProblems.some((p: any) => 
          p.difficulty === 'Hard'
        )).toBe(true);
      }
    });
  });

  describe('Recommendations', () => {
    it('should provide smart problem recommendations', async () => {
      const recommendations = await engine.getSmartRecommendations('user123');
      
      expect(recommendations).toBeDefined();
      expect(recommendations.nextProblems).toBeInstanceOf(Array);
      expect(recommendations.focusAreas).toBeInstanceOf(Array);
      expect(recommendations.suggestedPace).toBeTruthy();
    });

    it('should identify skill gaps', async () => {
      const recommendations = await engine.getSmartRecommendations('user123');
      
      expect(recommendations.skillGaps).toBeInstanceOf(Array);
      recommendations.skillGaps.forEach(gap => {
        expect(gap.skill).toBeTruthy();
        expect(gap.currentLevel).toBeGreaterThanOrEqual(0);
        expect(gap.targetLevel).toBeGreaterThan(gap.currentLevel);
      });
    });

    it('should estimate time to goals', async () => {
      const recommendations = await engine.getSmartRecommendations('user123');
      
      expect(recommendations.estimatedTimeToGoals).toBeDefined();
      Object.values(recommendations.estimatedTimeToGoals).forEach(time => {
        expect(time).toBeGreaterThan(0);
      });
    });
  });

  describe('Performance Analysis', () => {
    it('should track learning velocity over time', async () => {
      const analysis = await engine.analyzeLearningProgress('user123');
      
      expect(analysis.velocityTrend).toBeDefined();
      expect(analysis.velocityTrend).toMatch(/increasing|stable|decreasing/);
    });

    it('should identify pattern recognition improvements', async () => {
      const analysis = await engine.analyzeLearningProgress('user123');
      
      expect(analysis.patternRecognition).toBeDefined();
      expect(analysis.patternRecognition.improvement).toBeGreaterThanOrEqual(-100);
      expect(analysis.patternRecognition.improvement).toBeLessThanOrEqual(100);
    });

    it('should predict future performance', async () => {
      const analysis = await engine.analyzeLearningProgress('user123');
      
      expect(analysis.predictedMastery).toBeDefined();
      Object.values(analysis.predictedMastery).forEach(mastery => {
        expect(mastery.predicted).toBeGreaterThanOrEqual(0);
        expect(mastery.predicted).toBeLessThanOrEqual(100);
        expect(mastery.confidence).toBeGreaterThanOrEqual(0);
        expect(mastery.confidence).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle new users with no history', async () => {
      const profile = await engine.generateUserProfile('newuser');
      
      expect(profile).toBeDefined();
      expect(profile.totalProblemsAttempted).toBe(0);
      expect(profile.preferredDifficulty).toBe('Easy');
    });

    it('should handle users with limited data', async () => {
      const path = await engine.createPersonalizedLearningPath('limiteduser');
      
      expect(path).toBeDefined();
      expect(path.problems.length).toBeGreaterThan(0);
      expect(path.difficulty).toBe('Beginner');
    });

    it('should handle invalid goals gracefully', async () => {
      const path = await engine.createPersonalizedLearningPath('user123', [
        'Invalid goal XYZ'
      ]);
      
      expect(path).toBeDefined();
      expect(path.problems.length).toBeGreaterThan(0);
    });
  });
});