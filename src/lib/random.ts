export function randomChoice<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function randomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min);
}
