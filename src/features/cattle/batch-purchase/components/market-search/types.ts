/**
 * Type definitions for Market Search Field
 */

export interface MarketValue {
    id?: string;
    name: string;
    location: string | null;
    phone: string | null;
    isNew: boolean;
}

export interface MarketSearchFieldProps {
    value?: MarketValue;
    onChange: (value: MarketValue) => void;
    placeholder?: string;
    disabled?: boolean;
}

