import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import shuffle from "lodash/shuffle";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function randomChoice<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function randomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min);
}

const cardTypes = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"];
const cardSymbols = ["clubs", "diamonds", "hearts", "spades"];
const deck = cardTypes.flatMap((type) => cardSymbols.map((symbol) => `${type}_of_${symbol}`));

export function shuffleDeck(): typeof deck {
	return shuffle(deck);
}

export function arrayAt<T>(array: T[], index: number): T {
	return array.at(index % array.length) as T;
}
