"use server"

import convex from "@/lib/convexClient"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

/**
 * server-side action to get a download URL for a file stored in Convex storage.
 */
export async function getFileDownloadUrl(storageId: Id<"_storage"> | string) {
    try {
        const fileDownloadUrl = await convex.query(api.receipts.getReceiptDownloadUrl, {
            fileId: storageId as Id<"_storage">,
        })
        if (!fileDownloadUrl) {
            throw new Error("Could not get file download URL")
        }
        return { success: true, fileDownloadUrl }
    } catch (error) {
        console.error("Error getting file download URL:", error)
        return { success: false, error: `Failed to get file download URL: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }
}