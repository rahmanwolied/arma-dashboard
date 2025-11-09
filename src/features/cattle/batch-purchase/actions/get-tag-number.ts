/**
 * Server Action: Get Largest Tag Number
 * Retrieves the largest tag number in the current business cycle (July to July)
 */

'use server'

import { db } from '@/db'
import { animals, cattle, animalPurchases, purchases } from '@/db/schema'
import { desc, and, gte, lt, eq } from 'drizzle-orm'

/**
 * Calculates the current business cycle dates (July to July)
 * @returns Object with startDate and endDate of the current business cycle
 */
function getCurrentBusinessCycle() {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() // 0-indexed (0 = January, 6 = July)

    let startDate: Date
    let endDate: Date

    if (currentMonth >= 6) {
        // July (6) or later - cycle is July current year to June next year
        startDate = new Date(currentYear, 6, 1) // July 1st current year
        endDate = new Date(currentYear + 1, 6, 1) // July 1st next year
    } else {
        // Before July - cycle is July previous year to June current year
        startDate = new Date(currentYear - 1, 6, 1) // July 1st previous year
        endDate = new Date(currentYear, 6, 1) // July 1st current year
    }
    return { startDate, endDate }
}

/**
 * Gets the largest tag number in the current business cycle
 * @returns The largest tag number or null if no cattle exist in the current cycle
 */
export async function getLargestTagNumber(): Promise<string | null> {
    try {
        const { startDate, endDate } = getCurrentBusinessCycle()

        console.log(`Querying tag numbers for business cycle: ${startDate.toISOString()} to ${endDate.toISOString()}`)

        // Query cattle joined with purchase tables, filtered by purchase date in current business cycle
        // Order by tagNumber descending to get the largest first
        const result = await db
            .select({
                tagNumber: cattle.tagNumber,
                purchaseDate: purchases.purchaseDate,
            })
            .from(cattle)
            .innerJoin(animals, eq(cattle.animalId, animals.id))
            .innerJoin(animalPurchases, eq(animalPurchases.animalId, animals.id))
            .innerJoin(purchases, eq(animalPurchases.purchaseId, purchases.id))
            .where(
                and(
                    gte(purchases.purchaseDate, startDate),
                    lt(purchases.purchaseDate, endDate)
                )
            )
        // .orderBy(desc(cattle.tagNumber))
        // .limit(1)

        console.log(`Result: ${JSON.stringify(result)}`)

        if (result.length === 0) {
            console.log('No cattle found in current business cycle')
            return null
        }

        console.log(`Largest tag number found: ${result[0].tagNumber}`)
        return result[0].tagNumber
    } catch (error) {
        console.error('Failed to get largest tag number:', error)
        throw new Error('Failed to retrieve tag number from database')
    }
}

/**
 * Gets the next available tag number by incrementing the largest current tag number
 * @returns The next available tag number (e.g., "001" if no cattle exist, or "123" if largest is "122")
 */
export async function getNextTagNumber(): Promise<string> {
    try {
        const largestTag = await getLargestTagNumber()

        if (!largestTag) {
            // No cattle in current cycle, start with "001"
            return "001"
        }

        // Parse the tag number (assuming it's numeric or has numeric part)
        // Handle cases like "001", "123", or potentially "ARMA-001"
        const numericMatch = largestTag.match(/\d+/)

        if (!numericMatch) {
            console.warn(`Tag number "${largestTag}" doesn't contain numeric part, starting from 001`)
            return "001"
        }

        const currentNumber = Number.parseInt(numericMatch[0], 10)
        const nextNumber = currentNumber + 1

        // Pad with leading zeros to match the original format
        const paddingLength = numericMatch[0].length
        const nextTag = nextNumber.toString().padStart(paddingLength, '0')

        return nextTag
    } catch (error) {
        console.error('Failed to get next tag number:', error)
        throw new Error('Failed to generate next tag number')
    }
}

export async function isDuplicateTagNumber(tagNumber: string): Promise<boolean> {
    // is duplicate if this tag number exists for the same business cycle
    try {
        const { startDate, endDate } = getCurrentBusinessCycle()

        const result = await db
            .select({
                tagNumber: cattle.tagNumber,
            })
            .from(cattle)
            .innerJoin(animals, eq(cattle.animalId, animals.id))
            .innerJoin(animalPurchases, eq(animalPurchases.animalId, animals.id))
            .innerJoin(purchases, eq(animalPurchases.purchaseId, purchases.id))
            .where(
                and(
                    eq(cattle.tagNumber, tagNumber),
                    gte(purchases.purchaseDate, startDate),
                    lt(purchases.purchaseDate, endDate)
                )
            )

        return result.length > 0
    } catch (error) {
        console.error('Failed to check for duplicate tag number:', error)
        return false
    }
}