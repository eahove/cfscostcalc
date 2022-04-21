// new smooth model
function smoothRate(x){
	const minIncome = 20000
	const minPercent = 0.08
	const slope = 5.929487179487181e-07

	return (x - minIncome) * slope + minPercent
}

function stepRate(x) {
	let rate = 0.12
	if (x < 40000) {
		rate = 0.08
	} else if (x < 60000) {
		rate = 0.09
	} else if (x < 80000) {
		rate = 0.1
	} else if (x < 100000) {
		rate = 0.11
	}
	return rate
}

function incStepRate(x) {
	return stepRate(x) * 1.1
}

export function model3(x) {
	const roundTo = 100
	const maxTuition = 13500
	const minTuition = 1600
	const minIncome = 20000

	if (x < minIncome){
		return minTuition
	}

	const rate = smoothRate(x)

	const adj = x * rate
	if (adj < minTuition) {
		return minTuition
	} else if (adj > maxTuition) {
		return maxTuition
	} else {
		return Math.ceil(adj / roundTo) * roundTo
	}
}

export function ConsistentIncreasingRate(minRate,maxRate,LERPPercent)
{
	if(LERPPercent <= 0)
	{
		return minRate
	}
	else if(LERPPercent >= 1.0)
	{
		return maxRate
	}
	else
	{
		return (maxRate - minRate)*LERPPercent + minRate
	}
}

export function model2022(x) {
	const roundTo = 1
	const maxTuition = 19500
	const minTuition = 1600
	const minIncome = 20000
	const peakIncome = 130000
	const minRate = .0865
	const maxRate = .1500

	if (x <= minIncome){
		return minTuition
	}

	if( x >= peakIncome){
		return maxTuition
	}

	//const rate = smoothRate(x)

	const rate = ConsistentIncreasingRate(minRate, maxRate, ((x-minIncome)/(peakIncome-minIncome)))	

	const adj = x * rate
	if (adj < minTuition) {
		return minTuition
	} else if (adj > maxTuition) {
		return maxTuition
	} else {
		return Math.floor(adj / roundTo) * roundTo
	}
}

// step model -- old system
export function stepModel(x) {
	const roundTo = 250
	const maxTuition = 12000
	const minTuition = 1500
	const minIncome = 20000

	if (x < minIncome){
		return minTuition
	}

	const rate = stepRate(x)

	const adj = x * rate
	if (adj < minTuition) {
		return minTuition
	} else if (adj > maxTuition) {
		return maxTuition
	} else {
		return Math.ceil(adj / roundTo) * roundTo
	}
}


// transitional model
export function model4(x) {
	const roundTo = 100
	const maxTuition = 13500
	const minTuition = 1600
	const minIncome = 20000

	if (x < minIncome){
		return minTuition
	}

	const rate = (smoothRate(x) + incStepRate(x)) / 2

	const adj = x * rate
	if (adj < minTuition) {
		return minTuition
	} else if (adj > maxTuition) {
		return maxTuition
	} else {
		return Math.ceil(adj / roundTo) * roundTo
	}
}

export const MODEL3 = 'smooth scale'
export const STEPMODEL = 'step scale'
export const MODEL4 = 'transitional scale'
