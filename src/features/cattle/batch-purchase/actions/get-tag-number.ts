/**
 * Server Action: Get Largest Tag Number
 * Retrieves the largest tag number in the current business cycle (July to July)
 */

'use server'

import { db } from '@/db'
import { animals, cattle, animalPurchases, purchases } from '@/db/schema'
import { and, gte, lt, eq } from 'drizzle-orm'

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

        if (result.length === 0) {
            console.log('No cattle found in current business cycle')
            return null
        }

        // Extract numeric part from each tag number and find the largest
        const largestTag = result.reduce((maxTag, current) => {
            // Extract numeric part by splitting on '-' or '/'
            const parts = current.tagNumber.split(/[-/]/)
            const numericPart = parts[parts.length - 1] // Get last part (the number)
            const currentNum = Number.parseInt(numericPart, 10)

            if (!maxTag) {
                return { tag: current.tagNumber, num: currentNum }
            }

            // Extract numeric part from max tag
            const maxParts = maxTag.tag.split(/[-/]/)
            const maxNumericPart = maxParts[maxParts.length - 1]
            const maxNum = Number.parseInt(maxNumericPart, 10)

            // Return the tag with the larger number
            return currentNum > maxNum
                ? { tag: current.tagNumber, num: currentNum }
                : maxTag
        }, null as { tag: string; num: number } | null)

        const largestTagNumber = largestTag?.tag || null

        console.log("Result:", result)
        console.log(`Largest tag number found: ${largestTagNumber}`)
        return largestTagNumber
    } catch (error) {
        console.error('Failed to get largest tag number:', error)
        throw new Error('Failed to retrieve tag number from database')
    }
}

/**
 * Gets the next available tag number by incrementing the largest current tag number
 * @returns The next available tag number (e.g., "001" if no cattle exist, or "ABC-124" if largest is "ABC-123")
 */
export async function getNextTagNumber(): Promise<string> {
    try {
        const largestTag = await getLargestTagNumber()

        if (!largestTag) {
            // No cattle in current cycle, start with "001"
            return "001"
        }

        // Split by '-' or '/' to handle prefixes (e.g., "ABC-002", "ABC/002", or just "002")
        const parts = largestTag.split(/[-/]/)
        const numericPart = parts[parts.length - 1]
        const prefix = parts.length > 1 ? parts.slice(0, -1).join('-') : null
        const separator = largestTag.includes('/') ? '/' : '-'

        // Parse the numeric part
        const currentNumber = Number.parseInt(numericPart, 10)

        if (Number.isNaN(currentNumber)) {
            console.warn(`Tag number "${largestTag}" doesn't contain valid numeric part, starting from 001`)
            return "001"
        }

        const nextNumber = currentNumber + 1

        // Pad with leading zeros to match the original format
        const paddingLength = numericPart.length
        const nextNumericPart = nextNumber.toString().padStart(paddingLength, '0')

        // Reconstruct with prefix if it exists
        const nextTag = prefix
            ? `${prefix}${separator}${nextNumericPart}`
            : nextNumericPart

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