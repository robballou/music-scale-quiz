export type Scale = {
	name: string
	modeName?: string
	scale: (number | string)[]
}

export type ScaleWithAnswer = Scale & {
	correct: null | boolean
	answer: (number | string)[]
}
