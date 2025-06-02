import { createPrinciple, CATEGORIES } from './types.js';

/**
 * 30 predefined principles across 6 categories
 * Based on the discussion document and BTE materials
 */

export const PREDEFINED_PRINCIPLES = [
  // Achievement/Mastery (5)
  createPrinciple(
    'achievement-1',
    CATEGORIES.ACHIEVEMENT,
    'Continuous improvement',
    'Always getting better at what matters most'
  ),
  createPrinciple(
    'achievement-2',
    CATEGORIES.ACHIEVEMENT,
    'Excellence in execution',
    'Doing things properly, not just done'
  ),
  createPrinciple(
    'achievement-3',
    CATEGORIES.ACHIEVEMENT,
    'Mastery through deliberate practice',
    'Deep skill development over quick wins'
  ),
  createPrinciple(
    'achievement-4',
    CATEGORIES.ACHIEVEMENT,
    'Push beyond comfort zones',
    'Growth happens at the edge of ability'
  ),
  createPrinciple(
    'achievement-5',
    CATEGORIES.ACHIEVEMENT,
    'Measure what matters',
    'Track progress on meaningful metrics'
  ),

  // Autonomy (5)
  createPrinciple(
    'autonomy-1',
    CATEGORIES.AUTONOMY,
    'Personal freedom',
    'Making your own choices without external control'
  ),
  createPrinciple(
    'autonomy-2',
    CATEGORIES.AUTONOMY,
    'Self-determination',
    'Being the author of your own life'
  ),
  createPrinciple(
    'autonomy-3',
    CATEGORIES.AUTONOMY,
    'Independent thinking',
    'Form your own views rather than follow the crowd'
  ),
  createPrinciple(
    'autonomy-4',
    CATEGORIES.AUTONOMY,
    'Control your own destiny',
    'Take responsibility for outcomes'
  ),
  createPrinciple(
    'autonomy-5',
    CATEGORIES.AUTONOMY,
    'Freedom from others\' expectations',
    'Live by your standards, not theirs'
  ),

  // Security (5)
  createPrinciple(
    'security-1',
    CATEGORIES.SECURITY,
    'Stability and predictability',
    'Reliable foundations for everything else'
  ),
  createPrinciple(
    'security-2',
    CATEGORIES.SECURITY,
    'Financial security',
    'Money worries don\'t drive decisions'
  ),
  createPrinciple(
    'security-3',
    CATEGORIES.SECURITY,
    'Physical safety',
    'Protecting yourself and your capabilities'
  ),
  createPrinciple(
    'security-4',
    CATEGORIES.SECURITY,
    'Prepared for uncertainty',
    'Ready for what life throws at you'
  ),
  createPrinciple(
    'security-5',
    CATEGORIES.SECURITY,
    'Long-term sustainability',
    'Decisions that work over decades'
  ),

  // Service/Contribution (5)
  createPrinciple(
    'service-1',
    CATEGORIES.SERVICE,
    'Serve something greater',
    'Contributing to causes beyond personal gain'
  ),
  createPrinciple(
    'service-2',
    CATEGORIES.SERVICE,
    'Make a meaningful impact',
    'Work that matters to others, not just yourself'
  ),
  createPrinciple(
    'service-3',
    CATEGORIES.SERVICE,
    'Protect those who can\'t protect themselves',
    'Use your capabilities for others\' benefit'
  ),
  createPrinciple(
    'service-4',
    CATEGORIES.SERVICE,
    'Leave things better than you found them',
    'Improve systems/situations for those who follow'
  ),
  createPrinciple(
    'service-5',
    CATEGORIES.SERVICE,
    'Duty before self',
    'Put obligations to others ahead of personal comfort'
  ),

  // Relationships/Connection (5)
  createPrinciple(
    'relationships-1',
    CATEGORIES.RELATIONSHIPS,
    'Family comes first',
    'Closest relationships take priority over other pursuits'
  ),
  createPrinciple(
    'relationships-2',
    CATEGORIES.RELATIONSHIPS,
    'Build deep, lasting bonds',
    'Quality connections over quantity of contacts'
  ),
  createPrinciple(
    'relationships-3',
    CATEGORIES.RELATIONSHIPS,
    'Be there when it matters',
    'Show up for people during critical moments'
  ),
  createPrinciple(
    'relationships-4',
    CATEGORIES.RELATIONSHIPS,
    'Loyalty and trust',
    'Honor commitments to those who count on you'
  ),
  createPrinciple(
    'relationships-5',
    CATEGORIES.RELATIONSHIPS,
    'Strong community ties',
    'Invest in the groups and places you belong to'
  ),

  // Health/Vitality (5)
  createPrinciple(
    'health-1',
    CATEGORIES.HEALTH,
    'Physical capability',
    'Body that performs when you need it'
  ),
  createPrinciple(
    'health-2',
    CATEGORIES.HEALTH,
    'Looking good at all costs',
    'Appearance matters more than performance, health, or other concerns'
  ),
  createPrinciple(
    'health-3',
    CATEGORIES.HEALTH,
    'Peak physical performance',
    'Optimize what your body can do'
  ),
  createPrinciple(
    'health-4',
    CATEGORIES.HEALTH,
    'Long-term health and longevity',
    'Decisions that serve you for decades'
  ),
  createPrinciple(
    'health-5',
    CATEGORIES.HEALTH,
    'Energy and vitality',
    'Feel strong and capable daily'
  )
];

// Group principles by category for easier access
export const PRINCIPLES_BY_CATEGORY = PREDEFINED_PRINCIPLES.reduce((acc, principle) => {
  if (!acc[principle.category]) {
    acc[principle.category] = [];
  }
  acc[principle.category].push(principle);
  return acc;
}, {});

// Get all category names
export const CATEGORY_NAMES = Object.keys(CATEGORIES).map(key => CATEGORIES[key]);