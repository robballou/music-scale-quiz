import type { Scale, ScaleWithAnswer } from '../types'

function keysOf<
	Collection extends Record<string, unknown>,
	CollectionKey extends keyof Collection,
>(record: Collection): CollectionKey[] {
	return Object.keys(record) as CollectionKey[]
}

function getRandomKeys<Collection extends Record<string, unknown>>(
	record: Collection,
	numberOfKeys: number,
): (keyof Collection)[] {
	return keysOf(record)
		.sort(() => Math.random() - 0.5) // shuffle
		.slice(0, numberOfKeys) // pick first n
}

export function getQuestions(
	questionPool: Record<string, Scale>,
	numberOfQuestions = 2,
): ScaleWithAnswer[] {
	const questions: ScaleWithAnswer[] = []
	const keys = getRandomKeys(questionPool, numberOfQuestions)
	keys.forEach((key) =>
		questions.push({ ...questionPool[key], correct: null, answer: [] }),
	)
	return questions
}
