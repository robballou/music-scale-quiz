import type { Scale, ScaleQuestion } from '../types'

export function keysOf<
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

/** Return a random subset of questions/scales for the quiz. */
export function getQuestions(
	questionPool: Record<string, Scale>,
	numberOfQuestions = 2,
	questionType: ScaleQuestion['type'] = 'step',
): ScaleQuestion[] {
	const questions: ScaleQuestion[] = []
	const keys = getRandomKeys(questionPool, numberOfQuestions)
	keys.forEach((key) =>
		questions.push({
			...questionPool[key],
			correct: null,
			answer: [],
			type: questionType,
		}),
	)
	return questions
}
