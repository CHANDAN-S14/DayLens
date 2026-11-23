export function generateCsvRecords(records) {
  const headers = ['date', 'sleepHours', 'screenTimeHours', 'steps', 'exerciseDuration', 'mood', 'focus', 'notes'];
  const rows = records.map(r => [
    r.date,
    r.sleepHours ?? 0,
    r.screenTimeHours ?? 0,
    r.steps ?? 0,
    r.exerciseDuration ?? 0,
    r.mood ?? 7,
    r.focus ?? 7,
    `"${(r.notes || '').replace(/"/g, '""')}"`
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

export function generateTakeoutJson({ user, records, experiments, chats, consent }) {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    platform: 'DayLens (wHACKiest 2026 Track 3)',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      targetSleep: user.targetSleep,
      targetSteps: user.targetSteps,
      targetScreenLimit: user.targetScreenLimit,
      units: user.units,
      timeFormat: user.timeFormat,
      theme: user.theme,
      createdAt: user.createdAt
    },
    consent,
    records,
    experiments,
    chats
  }, null, 2);
}
