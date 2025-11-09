/**
 * Cattle Search Component Types
 */

export interface AnimalValue {
	id: string;
	tagNumber: string;
	liveWeight: number;
	adjustedPrice?: number;
}

export interface CattleSearchFieldProps {
	value?: AnimalValue[];
	onChange?: (value: AnimalValue[]) => void;
	placeholder?: string;
	disabled?: boolean;
}
