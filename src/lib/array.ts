export function arrayAt<T>(array: T[], index: number): T {
	return array.at(index % array.length) as T;
}
