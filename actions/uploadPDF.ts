"use server"

import { api } from "@/convex/_generated/api"
import convex from "@/lib/convexClient"
import { currentUser } from "@clerk/nextjs/server"
import { getFileDownloadUrl } from "./getFileDownloadUrl"
import { inngest } from "@/inngest/client"
import Events from "@/inngest/constants"

/**
 * server-side action to upload a PDF file to Convex.
 */
export async function uploadPDF(formData: FormData) {
    const user = await currentUser()
    if (!user) {
        return { 
            success: false, 
            error: 'User not authenticated' 
        }
    }
    
    try {
        const file = formData.get('file') as File

        if (!file) {
            return { success: false, error: 'No file uploaded' }
        }
        // check if file is a pdf
        if (file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
            return { success: false, error: 'Only PDF files are allowed' }
        }

        // get upload url from convex
        const uploadUrl = await convex.mutation(api.receipts.generateUploadUrl, {})

        // convert file to array buffer
        const arrayBuffer = await file.arrayBuffer()

        // upload file to convex storage
        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            body: new Uint8Array(arrayBuffer),
        })

        if (!response.ok) {
            throw new Error(`Failed to upload file: ${response.statusText}`)
        }

        const {storageId} = await response.json()

        // store receipt in convex db
        const receiptId = await convex.mutation(api.receipts.storeReceipt, {
            userId: user.id,
            fileName: file.name,
            fileId: storageId,
            UploadedAt: Date.now(),
            size: file.size,
            mimeType: file.type,
        })

        const fileUrl = await getFileDownloadUrl(storageId)

        // TODO: Trigger inngest workflow
        await inngest.send({
            name: Events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE,
            data: {
                url: fileUrl.fileDownloadUrl,
                receiptId
            }
        })

        console.log('File uploaded successfully:', fileUrl)
        return { 
            success: true, 
            data: {
             receiptId, 
             fileName: file.name 
            } 
        }
        
    } catch (error) {
        console.error('Error uploading file:', error)
        return { 
            success: false, 
            error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }
    }
}