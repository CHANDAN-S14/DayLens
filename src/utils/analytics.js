/**
 * Statistical & Analytical Utilities for DayLens
 * Computes authentic descriptive statistics and Pearson correlation coefficients
 * from real client-side LocalStorage records.
 */

export function calculateMean(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
}

export function calculateStdDev(numbers, mean) {
  if (!numbers || numbers.length <= 1) return 0;
  const avg = mean !== undefined ? mean : calculateMean(numbers);
  const squareDiffs = numbers.map(val => Math.pow(val - avg, 2));
  const avgSquareDiff = calculateMean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

/**
 * Computes Pearson correlation coefficient between two numeric arrays
 * Returns value between -1 and 1, or 0 if undefined/constant
 */
export function calculatePearson(xArr, yArr) {
  if (!xArr || !yArr || xArr.length !== yArr.length || xArr.length < 3) {
    return 0;
  }
  const n = xArr.length;
  const meanX = calculateMean(xArr);
  const meanY = calculateMean(yArr);

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = xArr[i] - meanX;
    const diffY = yArr[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;

  const r = numerator / denominator;
  // Snap within [-1, 1] bounds against floating point errors
  return Math.max(-1, Math.min(1, Number(r.toFixed(3))));
}

export function interpretCorrelation(r) {
  const abs = Math.abs(r);
  const direction = r >= 0 ? "positive" : "negative";

  if (abs >= 0.65) {
    return {
      strength: "Strong",
      direction,
      summary: `Strong ${direction} relationship observed (r = ${r > 0 ? '+' : ''}${r}).`
    };
  } else if (abs >= 0.35) {
    return {
      strength: "Moderate",
      direction,
      summary: `Moderate ${direction} relationship observed (r = ${r > 0 ? '+' : ''}${r}).`
    };
  } else if (abs >= 0.15) {
    return {
      strength: "Mild",
      direction,
      summary: `Mild ${direction} tendency observed (r = ${r > 0 ? '+' : ''}${r}).`
    };
  } else {
    return {
      strength: "Minimal",
      direction: "neutral",
      summary: `Little to no linear association detected (r = ${r}).`
    };
  }
}

/**
 * Filter records by date range ('7d', '30d', 'all')
 */
export function filterRecordsByRange(records, range = 'all') {
  if (!records || records.length === 0) return [];
  const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (range === '7d') {
    return sorted.slice(-7);
  } else if (range === '30d') {
    return sorted.slice(-30);
  }
  return sorted;
}

/**
 * Calculate multi-metric aggregates
 */
export function getMetricAggregates(records) {
  if (!records || records.length === 0) {
    return {
      avgSleep: 0,
      avgScreen: 0,
      avgSteps: 0,
      avgExercise: 0,
      avgMood: 0,
      avgFocus: 0,
      count: 0
    };
  }

  const count = records.length;
  return {
    avgSleep: Number(calculateMean(records.map(r => Number(r.sleepHours) || 0)).toFixed(1)),
    avgScreen: Number(calculateMean(records.map(r => Number(r.screenTimeHours) || 0)).toFixed(1)),
    avgSteps: Math.round(calculateMean(records.map(r => Number(r.steps) || 0))),
    avgExercise: Math.round(calculateMean(records.map(r => Number(r.exerciseDuration) || 0))),
    avgMood: Number(calculateMean(records.map(r => Number(r.mood) || 0)).toFixed(1)),
    avgFocus: Number(calculateMean(records.map(r => Number(r.focus) || 0)).toFixed(1)),
    count
  };
}

/**
 * Discovers statistical patterns from given records
 */
export function discoverPatterns(records) {
  if (!records || records.length < 4) {
    return [];
  }

  const validRecords = records.filter(r => 
    typeof r.sleepHours === 'number' && 
    typeof r.focus === 'number' && 
    typeof r.screenTimeHours === 'number' &&
    typeof r.mood === 'number'
  );

  const sleepList = validRecords.map(r => r.sleepHours);
  const focusList = validRecords.map(r => r.focus);
  const screenList = validRecords.map(r => r.screenTimeHours);
  const stepsList = validRecords.map(r => r.steps);
  const moodList = validRecords.map(r => r.mood);

  // 1. Sleep & Focus
  const rSleepFocus = calculatePearson(sleepList, focusList);
  // 2. Screen Time & Focus
  const rScreenFocus = calculatePearson(screenList, focusList);
  // 3. Activity (Steps) & Mood
  const rStepsMood = calculatePearson(stepsList, moodList);
  // 4. Sleep & Mood
  const rSleepMood = calculatePearson(sleepList, moodList);

  const patterns = [
    {
      id: "pat-sleep-focus",
      title: "Sleep duration and daytime focus",
      category: "Cognitive Performance",
      r: rSleepFocus,
      interpretation: interpretCorrelation(rSleepFocus),
      explanation: rSleepFocus > 0.3 
        ? "Days following 7.5+ hours of sleep coincide with measurably higher self-rated focus and clarity."
        : "Current data indicates balanced focus levels across varied sleep durations.",
      supportingData: `Sample: ${validRecords.length} days. Average focus is ${(calculateMean(validRecords.filter(r => r.sleepHours >= 7.5).map(r => r.focus)) || 0).toFixed(1)} on high sleep days vs ${(calculateMean(validRecords.filter(r => r.sleepHours < 7.5).map(r => r.focus)) || 0).toFixed(1)} on shorter sleep days.`,
      confidence: validRecords.length >= 20 ? "High evidence" : "Moderate evidence",
      confidenceLevel: validRecords.length >= 20 ? "high" : "medium",
      action: "Protect an 8-hour sleep opportunity window before demanding analytical workdays.",
      disclaimer: "Observed statistical pattern across local demo records. This is an observed correlation, not conclusive proof of causation."
    },
    {
      id: "pat-screen-focus",
      title: "Screen time and focus stability",
      category: "Digital Well-being",
      r: rScreenFocus,
      interpretation: interpretCorrelation(rScreenFocus),
      explanation: rScreenFocus < -0.3
        ? "Days with extended screen time (above 5.5 hours) show an inverse relationship with sustained afternoon focus."
        : "Screen time variations currently have a minor association with your recorded focus ratings.",
      supportingData: `Sample: ${validRecords.length} days. Screen time above 5.0h averaged ${(calculateMean(validRecords.filter(r => r.screenTimeHours > 5).map(r => r.focus)) || 0).toFixed(1)} focus score vs ${(calculateMean(validRecords.filter(r => r.screenTimeHours <= 5).map(r => r.focus)) || 0).toFixed(1)} on lower screen days.`,
      confidence: validRecords.length >= 20 ? "High evidence" : "Moderate evidence",
      confidenceLevel: validRecords.length >= 20 ? "high" : "medium",
      action: "Test scheduling screen-free 20-minute breaks between deep working blocks.",
      disclaimer: "Observed statistical pattern across local demo records. Causality can be bidirectional (e.g., fatigue leading to more passive screen browsing)."
    },
    {
      id: "pat-steps-mood",
      title: "Daily movement and emotional tone",
      category: "Physical Vitality",
      r: rStepsMood,
      interpretation: interpretCorrelation(rStepsMood),
      explanation: rStepsMood > 0.3
        ? "Reaching 8,500+ daily steps is consistently paired with higher subjective mood ratings and lower reported lethargy."
        : "Movement volume has a calm, stable baseline across your recorded moods.",
      supportingData: `Sample: ${validRecords.length} days. Mood averages ${(calculateMean(validRecords.filter(r => r.steps >= 8500).map(r => r.mood)) || 0).toFixed(1)}/10 on active days compared to ${(calculateMean(validRecords.filter(r => r.steps < 8500).map(r => r.mood)) || 0).toFixed(1)}/10 on sedentary days.`,
      confidence: validRecords.length >= 15 ? "High evidence" : "Moderate evidence",
      confidenceLevel: validRecords.length >= 15 ? "high" : "medium",
      action: "Incorporate a brief 10 to 15 minute outdoor stroll before lunch.",
      disclaimer: "Observed statistical pattern across local demo records. Reflects personal correlation without implying medical or clinical diagnosis."
    },
    {
      id: "pat-sleep-mood",
      title: "Restorative sleep and daily mood",
      category: "Emotional Well-being",
      r: rSleepMood,
      interpretation: interpretCorrelation(rSleepMood),
      explanation: rSleepMood > 0.3
        ? "Consistent sleep duration aligns with more positive self-reported mood resilience across the week."
        : "Mood ratings remain moderately consistent independent of minor night-to-night sleep variances.",
      supportingData: `Sample: ${validRecords.length} days. Mood rating averaged ${(calculateMean(validRecords.filter(r => r.sleepHours >= 7.5).map(r => r.mood)) || 0).toFixed(1)}/10 when sleeping 7.5h or more.`,
      confidence: validRecords.length >= 15 ? "Moderate evidence" : "Emerging evidence",
      confidenceLevel: "medium",
      action: "Maintain a steady sleep schedule on weekends to minimize circadian disruption.",
      disclaimer: "Observed statistical pattern across local demo records. Individual days may be influenced by external life circumstances."
    }
  ];

  return patterns;
}
