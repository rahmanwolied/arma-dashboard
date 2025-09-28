export const CATTLE_CLASS_OPTIONS = [
	{ value: "GOLD", label: "Gold" },
	{ value: "SILVER", label: "Silver" },
	{ value: "PLATINUM", label: "Platinum" },
];

export const HEALTH_STATUS_OPTIONS = [
	{ groupLabel: "Health Status", value: "HEALTHY", label: "Healthy" },
	{ groupLabel: "Health Status", value: "MINOR_ISSUE", label: "Minor Issue" },
	{ groupLabel: "Health Status", value: "SICK", label: "Sick" },
	{ groupLabel: "Health Status", value: "CRITICAL", label: "Critical" },
];

// Boolean field options for separate filters
export const LACTATING_OPTIONS = [
	{ groupLabel: "Cattle Info", value: "LACTATING", label: "Lactating" },
	{ groupLabel: "Cattle Info", value: "NOT_LACTATING", label: "Not Lactating" },
];

export const PREGNANT_OPTIONS = [
	{ groupLabel: "Cattle Info", value: "PREGNANT", label: "Pregnant" },
	{ groupLabel: "Cattle Info", value: "NOT_PREGNANT", label: "Not Pregnant" },
];

export const QUARANTINED_OPTIONS = [
	{ groupLabel: "Cattle Info", value: "QUARANTINED", label: "Quarantined" },
	{
		groupLabel: "Cattle Info",
		value: "NOT_QUARANTINED",
		label: "Not Quarantined",
	},
];

export const ANIMAL_STATUS_OPTIONS = [
	{ value: "ON_FARM", label: "On Farm" },
	{ value: "SOLD", label: "Sold" },
	{ value: "SLAUGHTERED", label: "Slaughtered" },
];

export const ANIMAL_STATUS_OPTION_GROUPS = [
	...HEALTH_STATUS_OPTIONS,
	...LACTATING_OPTIONS,
	...PREGNANT_OPTIONS,
	...QUARANTINED_OPTIONS,
	...ANIMAL_STATUS_OPTIONS,
];
