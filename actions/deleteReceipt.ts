"use server"

import convex from "@/lib/convexClient"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export async function deleteReceipt(receiptID: string) {
    try {
        await convex.mutation(api.receipts.deleteReceipt, { receiptId: receiptID as Id<"receipts"> })
        console.log("Receipt deleted successfully")
        return { success: true }
    } catch (error) {
        console.error("Error deleting receipt:", error)
        return { success: false, error: `Failed to delete receipt: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
}