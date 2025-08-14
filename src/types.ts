import { z } from 'zod'

const stepSchema = z.literal([1, 2, 3])
export type Step = z.infer<typeof stepSchema>

export function isStep(num: number): num is Step {
	const result = stepSchema.safeParse(num)
	return result.success
}

export type Scale = {
	name: string
	modeName?: string
	intervals: (number | string)[]
	steps: Step[]
}

type BaseScaleQuestion = Scale & {
	correct: null | boolean
}

export type IntervalScaleQuestion = BaseScaleQuestion & {
	type: 'interval'
	answer: (number | string)[]
}

export type StepScaleQuestion = BaseScaleQuestion & {
	type: 'step'
	answer: Step[]
}

export type ScaleQuestion = IntervalScaleQuestion | StepScaleQuestion
