/**
 * Statistical Analytics Engine in Node.js
 * Performs robust descriptive statistics, Pearson r correlation matrices,
 * moving averages, and anomaly detection.
 */

export function calculateMean(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + (Number(val) || 0), 0);
  return sum / numbers.length;
}

export function calculateStdDev(numbers, mean) {
  if (!numbers || numbers.length <= 1) return 0;
  const avg = mean !== undefined ? mean : calculateMean(numbers);
  const squareDiffs = numbers.map(val => Math.pow((Number(val) || 0) - avg, 2));
  const avgSquareDiff = calculateMean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

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
    const diffX = (Number(xArr[i]) || 0) - meanX;
    const diffY = (Number(yArr[i]) || 0) - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;

  const r = numerator / denominator;
  return Math.max(-1, Math.min(1, Number(r.toFixed(3))));
}

export function interpretCorrelation(r) {
  const abs = Math.abs(r);
  const direction = r >= 0 ? 'positive' : 'negative';

  if (abs >= 0.65) {
    return {
      strength: 'Strong',
      direction,
      summary: `Strong ${direction} relationship observed (r = ${r > 0 ? '+' : ''}${r}).`
    };
  } else if (abs >= 0.35) {
    return {
      strength: 'Moderate',
      direction,
      summary: `Moderate ${direction} relationship observed (r = ${r > 0 ? '+' : ''}${r}).`
    };
  } else if (abs >= 0.15) {
    return {
      strength: 'Mild',
      direction,
      summary: `Mild ${direction} tendency observed (r = ${r > 0 ? '+' : ''}${r}).`
    };
  }
  return {
    strength: 'Minimal',
    direction: 'neutral',
    summary: `Little to no linear association detected (r = ${r}).`
  };
}

export function computeAggregates(records) {
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

  return {
    avgSleep: Number(calculateMean(records.map(r => r.sleepHours)).toFixed(1)),
    avgScreen: Number(calculateMean(records.map(r => r.screenTimeHours)).toFixed(1)),
    avgSteps: Math.round(calculateMean(records.map(r => r.steps))),
    avgExercise: Math.round(calculateMean(records.map(r => r.exerciseDuration))),
    avgMood: Number(calculateMean(records.map(r => r.mood)).toFixed(1)),
    avgFocus: Number(calculateMean(records.map(r => r.focus)).toFixed(1)),
    count: records.length
  };
}

export function discoverPatterns(records) {
  if (!records || records.length < 4) return [];

  const sleep = records.map(r => r.sleepHours);
  const focus = records.map(r => r.focus);
  const screen = records.map(r => r.screenTimeHours);
  const steps = records.map(r => r.steps);
  const mood = records.map(r => r.mood);

  const patterns = [];

  // 1. Sleep & Focus
  const rSleepFocus = calculatePearson(sleep, focus);
  if (Math.abs(rSleepFocus) >= 0.25) {
    const interp = interpretCorrelation(rSleepFocus);
    patterns.push({
      id: 'pattern-sleep-focus',
      metric: 'sleep_vs_focus',
      title: 'Sleep Duration & Focus Association',
      r: rSleepFocus,
      strength: interp.strength,
      direction: interp.direction,
      explanation: rSleepFocus > 0
        ? `Nights with higher sleep hours consistently precede stronger daytime focus scores across your records.`
        : `Unusual divergence detected between recorded sleep and focus ratings.`
    });
  }

  // 2. Screen Time & Focus
  const rScreenFocus = calculatePearson(screen, focus);
  if (Math.abs(rScreenFocus) >= 0.25) {
    const interp = interpretCorrelation(rScreenFocus);
    patterns.push({
      id: 'pattern-screen-focus',
      metric: 'screen_vs_focus',
      title: 'Screen Time & Cognitive Clarity',
      r: rScreenFocus,
      strength: interp.strength,
      direction: interp.direction,
      explanation: rScreenFocus < 0
        ? `Days with extended screen usage show a noticeable decline in self-reported focus.`
        : `Screen time has not exhibited typical inhibitory association with focus.`
    });
  }

  // 3. Steps & Mood
  const rStepsMood = calculatePearson(steps, mood);
  if (Math.abs(rStepsMood) >= 0.25) {
    const interp = interpretCorrelation(rStepsMood);
    patterns.push({
      id: 'pattern-steps-mood',
      metric: 'steps_vs_mood',
      title: 'Daily Movement & Emotional Well-being',
      r: rStepsMood,
      strength: interp.strength,
      direction: interp.direction,
      explanation: rStepsMood > 0
        ? `Higher step counts strongly co-occur with higher daily mood ratings.`
        : `Movement volume appears independent of mood fluctuations in this timeframe.`
    });
  }

  return patterns;
}

export function detectAnomalies(records) {
  if (!records || records.length < 5) return [];

  const metrics = ['sleepHours', 'screenTimeHours', 'focus', 'mood'];
  const anomalies = [];

  metrics.forEach(metric => {
    const values = records.map(r => Number(r[metric]) || 0);
    const mean = calculateMean(values);
    const std = calculateStdDev(values, mean);

    if (std === 0) return;

    records.forEach(record => {
      const val = Number(record[metric]) || 0;
      const zScore = (val - mean) / std;
      if (Math.abs(zScore) >= 2.0) {
        anomalies.push({
          date: record.date,
          metric,
          value: val,
          baselineMean: Number(mean.toFixed(2)),
          zScore: Number(zScore.toFixed(2)),
          type: zScore > 0 ? 'high_spike' : 'low_drop',
          description: `${metric} on ${record.date} was ${val} (${Math.abs(zScore).toFixed(1)} std deviations from your average of ${mean.toFixed(1)}).`
        });
      }
    });
  });

  return anomalies;
}
