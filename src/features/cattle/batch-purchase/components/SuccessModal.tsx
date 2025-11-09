/**
 * Success Modal - Step 5
 * Displays success message after batch purchase creation
 */

'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { BatchPurchaseData } from '../types'

interface SuccessModalProps {
  purchaseData: BatchPurchaseData
  onAddAnother: () => void
  onViewInventory: () => void
}

const currencyFormatter = new Intl.NumberFormat('en-IN')

const dateFormatter = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/')
  const date = new Date(`${year}-${month}-${day}`)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function SuccessModal({ purchaseData, onAddAnother, onViewInventory }: SuccessModalProps) {
  const { cattle, numberOfCattle, transportCost, hasilFee, miscCost, purchaseDate } = purchaseData

  const totalBasePrice = cattle.reduce((sum, c) => sum + (parseFloat(c.purchasePrice) || 0), 0)
  const sharedCosts =
    (parseFloat(transportCost) || 0) + (parseFloat(hasilFee) || 0) + (parseFloat(miscCost) || 0)
  const grandTotal = totalBasePrice + sharedCosts

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-[480px]">
        <CardContent className="pt-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-4">✓ Success!</h2>
          <p className="text-base">
            {numberOfCattle} cattle successfully added to inventory
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Purchase Date: {dateFormatter(purchaseDate)}
          </p>
          <p className="text-base font-semibold mt-3">
            Total Investment: {currencyFormatter.format(grandTotal)} ৳
          </p>
        </CardContent>
        <CardFooter className="justify-center gap-3">
          <Button variant="outline" onClick={onViewInventory}>
            View Inventory
          </Button>
          <Button onClick={onAddAnother}>Add Another Purchase</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

