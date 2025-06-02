import { CATEGORIES } from '../data/types.js';

/**
 * Utility functions for analyzing results and generating insights
 */

// Analyze personal profile based on final ranking
export const analyzePersonalProfile = (finalRanking) => {
  if (!finalRanking || finalRanking.length === 0) {
    return {
      primaryCategory: '',
      style: '',
      strengths: [],
      tensions: [],
      recommendations: []
    };
  }

  // Get top 5 principles for analysis
  const topFive = finalRanking.slice(0, 5);
  
  // Count categories in top 5
  const categoryCount = topFive.reduce((acc, principle) => {
    acc[principle.category] = (acc[principle.category] || 0) + 1;
    return acc;
  }, {});

  // Determine primary category
  const primaryCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

  // Determine decision-making style
  const style = determineDecisionMakingStyle(topFive, categoryCount);

  // Identify strengths based on top principles
  const strengths = identifyStrengths(topFive, primaryCategory);

  // Identify potential tensions
  const tensions = identifyTensions(topFive);

  // Generate recommendations
  const recommendations = generateRecommendations(topFive, primaryCategory, tensions);

  return {
    primaryCategory,
    style,
    strengths,
    tensions,
    recommendations
  };
};

// Determine decision-making style based on principle distribution
const determineDecisionMakingStyle = (topFive, categoryCount) => {
  const categoryEntries = Object.entries(categoryCount);
  const maxCount = Math.max(...categoryEntries.map(([,count]) => count));
  const dominantCategories = categoryEntries.filter(([,count]) => count === maxCount);

  if (dominantCategories.length === 1 && maxCount >= 3) {
    const category = dominantCategories[0][0];
    switch (category) {
      case CATEGORIES.ACHIEVEMENT:
        return 'Performance-Driven';
      case CATEGORIES.AUTONOMY:
        return 'Independence-Focused';
      case CATEGORIES.SECURITY:
        return 'Stability-Oriented';
      case CATEGORIES.SERVICE:
        return 'Mission-Driven';
      case CATEGORIES.RELATIONSHIPS:
        return 'Relationship-Centered';
      case CATEGORIES.HEALTH:
        return 'Vitality-Focused';
      default:
        return 'Balanced Approach';
    }
  }

  if (dominantCategories.length > 1) {
    return 'Multi-Dimensional';
  }

  return 'Balanced Approach';
};

// Identify strengths based on top principles
const identifyStrengths = (topFive, primaryCategory) => {
  const strengths = [];

  // Add primary category strength
  switch (primaryCategory) {
    case CATEGORIES.ACHIEVEMENT:
      strengths.push('Strong drive for excellence and continuous improvement');
      strengths.push('Natural ability to push beyond comfort zones');
      break;
    case CATEGORIES.AUTONOMY:
      strengths.push('Independent thinking and self-direction');
      strengths.push('Resistance to external pressure and groupthink');
      break;
    case CATEGORIES.SECURITY:
      strengths.push('Strategic planning and risk management');
      strengths.push('Building sustainable foundations for growth');
      break;
    case CATEGORIES.SERVICE:
      strengths.push('Purpose-driven decision making');
      strengths.push('Natural inclination to consider broader impact');
      break;
    case CATEGORIES.RELATIONSHIPS:
      strengths.push('Strong interpersonal connections and loyalty');
      strengths.push('Ability to build and maintain trust');
      break;
    case CATEGORIES.HEALTH:
      strengths.push('Focus on sustainable performance and wellbeing');
      strengths.push('Understanding of mind-body connection');
      break;
  }

  // Add specific principle-based strengths
  if (topFive.some(p => p.title.includes('deliberate practice'))) {
    strengths.push('Commitment to skill mastery over quick wins');
  }
  
  if (topFive.some(p => p.title.includes('independent thinking'))) {
    strengths.push('Intellectual courage and original perspective');
  }

  return strengths.slice(0, 4); // Limit to 4 key strengths
};

// Identify potential tensions between top principles
const identifyTensions = (topFive) => {
  const tensions = [];
  const categories = topFive.map(p => p.category);

  // Achievement vs. Relationships tension
  if (categories.includes(CATEGORIES.ACHIEVEMENT) && categories.includes(CATEGORIES.RELATIONSHIPS)) {
    tensions.push('Balancing drive for excellence with relationship commitments');
  }

  // Autonomy vs. Service tension
  if (categories.includes(CATEGORIES.AUTONOMY) && categories.includes(CATEGORIES.SERVICE)) {
    tensions.push('Reconciling independence with serving others or larger causes');
  }

  // Security vs. Achievement tension
  if (categories.includes(CATEGORIES.SECURITY) && categories.includes(CATEGORIES.ACHIEVEMENT)) {
    tensions.push('Managing risk tolerance while pursuing ambitious goals');
  }

  // Health vs. Achievement tension (if includes "at all costs" principle)
  if (categories.includes(CATEGORIES.HEALTH) && categories.includes(CATEGORIES.ACHIEVEMENT)) {
    const hasAtAllCosts = topFive.some(p => p.title.includes('at all costs'));
    if (hasAtAllCosts) {
      tensions.push('Potential conflict between appearance and sustainable performance');
    }
  }

  return tensions;
};

// Generate personalized recommendations
const generateRecommendations = (topFive, primaryCategory, tensions) => {
  const recommendations = [];

  // Primary category recommendations
  switch (primaryCategory) {
    case CATEGORIES.ACHIEVEMENT:
      recommendations.push('Consider how to maintain high standards while avoiding burnout');
      recommendations.push('Explore ways to celebrate progress, not just final outcomes');
      break;
    case CATEGORIES.AUTONOMY:
      recommendations.push('Look for environments that value independent thinking');
      recommendations.push('Practice articulating your perspective to influence others');
      break;
    case CATEGORIES.SECURITY:
      recommendations.push('Balance planning with openness to new opportunities');
      recommendations.push('Consider how security enables rather than limits growth');
      break;
    case CATEGORIES.SERVICE:
      recommendations.push('Ensure your service aligns with your other core values');
      recommendations.push('Set boundaries to avoid overcommitment to others');
      break;
    case CATEGORIES.RELATIONSHIPS:
      recommendations.push('Communicate your values clearly to strengthen connections');
      recommendations.push('Consider how relationships can support your other goals');
      break;
    case CATEGORIES.HEALTH:
      recommendations.push('Integrate vitality practices into your daily routine');
      recommendations.push('Examine whether appearance or performance truly serves you');
      break;
  }

  // Tension-based recommendations
  tensions.forEach(tension => {
    if (tension.includes('excellence with relationship')) {
      recommendations.push('Schedule dedicated time for both achievement and relationships');
    }
    if (tension.includes('independence with serving')) {
      recommendations.push('Seek leadership roles where you can serve while maintaining autonomy');
    }
  });

  return recommendations.slice(0, 4); // Limit to 4 key recommendations
};

// Analyze organizational alignment
export const analyzeOrganizationalAlignment = (personalRanking, orgPrinciples, orgContext) => {
  if (!orgPrinciples || orgPrinciples.length === 0) {
    return null;
  }

  const topPersonalPrinciples = personalRanking.slice(0, 8); // Top half for comparison
  
  // Find direct matches
  const matches = [];
  const conflicts = [];

  topPersonalPrinciples.forEach(principle => {
    const isMatch = orgPrinciples.some(orgPrinciple => 
      principle.title.toLowerCase().includes(orgPrinciple.toLowerCase()) ||
      orgPrinciple.toLowerCase().includes(principle.title.toLowerCase()) ||
      getSimilarConcepts(principle.title).some(concept => 
        orgPrinciple.toLowerCase().includes(concept)
      )
    );

    if (isMatch) {
      matches.push(`${principle.title} aligns with organizational values`);
    } else if (topPersonalPrinciples.indexOf(principle) < 3) {
      // Top 3 principles that don't match could be friction points
      conflicts.push(`${principle.title} may not be emphasized organizationally`);
    }
  });

  // Calculate alignment score
  const alignmentScore = Math.round((matches.length / Math.min(topPersonalPrinciples.length, 8)) * 100);

  // Generate strategies
  const strategies = generateAlignmentStrategies(matches, conflicts, orgContext);

  // Generate discussion points
  const discussionPoints = generateDiscussionPoints(personalRanking, orgPrinciples);

  return {
    matches,
    conflicts,
    strategies,
    alignmentScore,
    discussionPoints
  };
};

// Get similar concepts for principle matching
const getSimilarConcepts = (principleTitle) => {
  const conceptMap = {
    'continuous improvement': ['growth', 'development', 'learning'],
    'excellence': ['quality', 'standards', 'best'],
    'independent thinking': ['innovation', 'creativity', 'autonomy'],
    'family': ['relationships', 'people', 'connections'],
    'security': ['stability', 'safety', 'reliability'],
    'service': ['mission', 'purpose', 'impact', 'contribution']
  };

  const title = principleTitle.toLowerCase();
  for (const [key, concepts] of Object.entries(conceptMap)) {
    if (title.includes(key)) {
      return concepts;
    }
  }
  return [];
};

// Generate strategies for organizational alignment
const generateAlignmentStrategies = (matches, conflicts, orgContext) => {
  const strategies = [];

  if (matches.length > conflicts.length) {
    strategies.push('Leverage your natural alignment to contribute authentically');
    strategies.push('Share examples of how your values drive your best work');
  } else {
    strategies.push('Identify ways to honor your values within organizational context');
    strategies.push('Seek projects or roles that better align with your priorities');
  }

  if (conflicts.length > 0) {
    strategies.push('Discuss value differences openly to find common ground');
    strategies.push('Consider how your unique perspective can benefit the team');
  }

  return strategies;
};

// Generate discussion points for team conversations
const generateDiscussionPoints = (personalRanking, orgPrinciples) => {
  const topThree = personalRanking.slice(0, 3);
  
  return [
    `How do your top 3 values (${topThree.map(p => p.title).join(', ')}) show up in your work?`,
    'Where do you see the strongest alignment between personal and organizational values?',
    'What organizational values would you like to better understand?',
    'How can the team leverage different value orientations for better outcomes?'
  ];
};