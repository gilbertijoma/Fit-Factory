export function calculateCarbPercentDV(carbs: number): string {
	const dailyRecommendedCarbs = 300

	const percentDV = (carbs / dailyRecommendedCarbs) * 100
	const roundedPercentDV = Math.round(percentDV) // Round to no decimal places

	return `${roundedPercentDV}%`
}
export function calculateFatPercentDV(fats: number): string {
	const dailyRecommendedFats = 100

	const percentDV = (fats / dailyRecommendedFats) * 100
	const roundedPercentDV = Math.round(percentDV) // Round to no decimal places

	return `${roundedPercentDV}%`
}
