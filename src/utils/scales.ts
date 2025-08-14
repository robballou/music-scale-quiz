import scalesCollection from '../scales.json'
import type { Scale } from '../types'

export const scales = scalesCollection.scales as Record<string, Scale>

export function getStepAsNumber(step: string): 1 | 2 | 3 {
	switch (step.toLowerCase()) {
		case 'w':
			return 2
		case 'h':
			return 1
		case 'w+h':
			return 3
	}
	throw new Error('Invalid step')
}

export function getStepAsNotation(step: 1 | 2 | 3): string {
	switch (step) {
		case 1:
			return 'H'
		case 2:
			return 'W'
		case 3:
			return 'W+H'
	}
}
