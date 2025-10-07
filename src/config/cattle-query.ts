/**
 * Cattle Query Configuration
 *
 * Contains all constants, configurations, and mappings used in cattle queries
 */

export const CATTLE_QUERY_CONFIG = {
    // Pagination limits
    MAX_PER_PAGE: 100,
    DEFAULT_PER_PAGE: 10,

    // Cache settings
    CACHE_TTL: 60, // 1 minute
    CACHE_TAGS: ["cattle", "animals", "purchases", "weights", "sales"],

    // Default values
    DEFAULT_CATTLE_CLASS: "SILVER" as const,
    DEFAULT_WEIGHT: "0",

    // Sortable fields categorization
    SORTABLE_FIELDS: {
        // Fields that can be sorted at SQL level
        SIMPLE: [
            "tagNumber",
            "gender",
            "healthStatus",
            "createdAt",
            "animalStatus",
        ],
        // Fields that require post-processing sorting
        COMPUTED: [
            "cattleClass",
            "purchasePrice",
            "totalPrice",
            "purchaseDate",
        ],
    },

    // Health status field mappings
    HEALTH_STATUS_MAPPINGS: {
        LACTATING: "isLactating",
        PREGNANT: "isPregnant",
        QUARANTINED: "isQuarantined",
        NOT_LACTATING: "isLactating",
        NOT_PREGNANT: "isPregnant",
        NOT_QUARANTINED: "isQuarantined",
    } as const,

    // Health status categories
    HEALTH_STATUS_CATEGORIES: {
        BOOLEAN_FIELDS: [
            "LACTATING",
            "PREGNANT",
            "QUARANTINED",
            "NOT_LACTATING",
            "NOT_PREGNANT",
            "NOT_QUARANTINED",
        ],
        HEALTH_STATUSES: ["HEALTHY", "MINOR_ISSUE", "SICK", "CRITICAL"],
    },

    // Query optimization settings
    OPTIMIZATION: {
        BATCH_SIZE: 1000,
        MAX_JOINS: 10,
        ENABLE_QUERY_OPTIMIZATION: true,
    },
} as const;

export type CattleClass = "SILVER" | "GOLD" | "PLATINUM";
export type HealthStatusField =
    keyof typeof CATTLE_QUERY_CONFIG.HEALTH_STATUS_MAPPINGS;
