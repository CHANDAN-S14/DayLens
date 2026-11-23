from typing import List, Dict, Any
from app.schemas.analytics_schema import CorrelationPair

def generate_recommendations(
    baselines: Dict[str, Dict[str, float]],
    correlations: List[CorrelationPair],
    experiments: List[Dict[str, Any]]
) -> List[Dict[str, str]]:
    recommendations = []
    
    # 1. Sleep recommendation
    avg_sleep = baselines.get('sleepHours', {}).get('mean', 7.0)
    if avg_sleep < 7.2:
        recommendations.append({
            "category": "Sleep Optimization",
            "priority": "High",
            "recommendation": f"Your average sleep of {avg_sleep}h is below the 7.5h restorative threshold. Aim for an 8-hour sleep opportunity window.",
            "action": "Set bedtime alarm 45 minutes earlier tonight."
        })
        
    # 2. Screen time recommendation
    avg_screen = baselines.get('screenTimeHours', {}).get('mean', 4.0)
    screen_focus_corr = next((c for c in correlations if c.x_metric == 'screenTimeHours' and c.y_metric == 'focus'), None)
    if screen_focus_corr and screen_focus_corr.pearson_r < -0.3:
        recommendations.append({
            "category": "Digital Hygeine",
            "priority": "Medium",
            "recommendation": f"Strong inverse correlation (r = {screen_focus_corr.pearson_r}) detected between screen time and afternoon focus.",
            "action": "Implement a 30-minute screen-free wind-down buffer before bed."
        })
        
    # 3. Movement recommendation
    avg_steps = baselines.get('steps', {}).get('mean', 7000)
    if avg_steps < 8500:
        recommendations.append({
            "category": "Physical Movement",
            "priority": "Medium",
            "recommendation": f"Current movement averages {int(avg_steps)} steps. Days exceeding 8,500 steps show marked improvement in mood scores.",
            "action": "Schedule a 15-minute brisk walk after lunch."
        })
        
    # 4. Active experiment encouragement
    active_exp = next((e for e in experiments if e.get('status') == 'active'), None)
    if active_exp:
        recommendations.append({
            "category": "Active Experiment",
            "priority": "High",
            "recommendation": f"Active protocol: '{active_exp.get('title')}'. Consistency is key for statistically valid habit attribution.",
            "action": f"Complete Day {active_exp.get('currentDay', 1)} check-in."
        })
        
    return recommendations
