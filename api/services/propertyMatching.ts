type MatchableLead = { budget: number; location: string; propertyType: string };
type MatchableProperty = { price: number; location: string; propertyType: string; status: string };

export function matchProperties(lead: MatchableLead, properties: MatchableProperty[]) {
  return properties.filter((property) => property.status === "Available").map((property) => {
    let score = 0;
    if (property.propertyType.toLowerCase() === lead.propertyType.toLowerCase()) score += 40;
    if (property.location.toLowerCase().includes(lead.location.toLowerCase()) || lead.location.toLowerCase().includes(property.location.toLowerCase())) score += 35;
    const budgetFit = Math.abs(property.price - lead.budget) / Math.max(lead.budget, 1);
    if (budgetFit <= 0.1) score += 25;
    else if (budgetFit <= 0.2) score += 15;
    return { property, matchPercentage: Math.min(100, score) };
  }).filter((result) => result.matchPercentage >= 35).sort((a, b) => b.matchPercentage - a.matchPercentage);
}