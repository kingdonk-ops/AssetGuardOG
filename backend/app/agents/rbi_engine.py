from typing import List, Dict


def calculate_corrosion_rate(
    original_thickness: float, current_thickness: float, years_in_service: float
) -> float:
    if years_in_service <= 0:
        return 0.0
    loss = original_thickness - current_thickness
    if loss <= 0:
        return 0.0
    return round(loss / years_in_service, 4)


def calculate_remaining_life(
    current_thickness: float, min_thickness: float, corrosion_rate: float
) -> float:
    if corrosion_rate <= 0:
        return 99.9
    remaining = (current_thickness - min_thickness) / corrosion_rate
    return round(max(remaining, 0.0), 2)


def assess_risk_level(
    corrosion_rate: float, remaining_life: float, operating_pressure: float
) -> Dict:
    score = 0.0
    if corrosion_rate > 0.5:
        score += 40
    elif corrosion_rate > 0.2:
        score += 20
    elif corrosion_rate > 0.05:
        score += 10
    if remaining_life < 1:
        score += 40
    elif remaining_life < 3:
        score += 20
    elif remaining_life < 5:
        score += 10
    if operating_pressure > 50:
        score += 20
    elif operating_pressure > 20:
        score += 10

    if score >= 70:
        category = "critical"
    elif score >= 40:
        category = "high"
    elif score >= 20:
        category = "medium"
    else:
        category = "low"

    return {"category": category, "score": round(score, 1)}


def prioritize_inspections(assets: List[Dict]) -> List[Dict]:
    scored = []
    for a in assets:
        years = a.get("years_in_service", 1)
        cr = calculate_corrosion_rate(
            a.get("original_thickness", 0), a.get("current_thickness", 0), years
        )
        rl = calculate_remaining_life(
            a.get("current_thickness", 0), a.get("min_thickness", 0), cr
        )
        risk = assess_risk_level(cr, rl, a.get("pressure", 0))
        scored.append({**a, "risk_score": risk["score"], "risk_level": risk["category"]})
    scored.sort(key=lambda x: x["risk_score"], reverse=True)
    return scored


def generate_rbi_report(asset_name: str, risk_level: str, findings: str) -> str:
    return (
        f"RBI Report for {asset_name}\n"
        f"Risk Level: {risk_level.upper()}\n\n"
        f"Findings:\n{findings}\n\n"
        f"Recommendation: "
        f"{'Immediate inspection and mitigation required.' if risk_level == 'critical' else "
        f"Schedule inspection within the next quarter." if risk_level == 'high' else "
        f"Monitor during routine inspections." if risk_level == 'medium' else "
        f"No immediate action required."}"
    )
