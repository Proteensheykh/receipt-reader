import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// function to generate a convex storage upload url
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl()
    }
})

// function to store receipt in convex db
export const storeReceipt = mutation({
    args: {
        userId: v.string(),
        fileName: v.string(),
        fileId: v.id("_storage"), // from convex storage
        UploadedAt: v.number(),
        size: v.number(), 
        mimeType: v.string(),
    },
    handler: async (ctx, args) => {
        // save receipt to convex db
        const receiptId = await ctx.db.insert("receipts", {
            userId: args.userId,
            fileName: args.fileName,
            fileId: args.fileId,
            UploadedAt: args.UploadedAt,
            size: args.size,
            mimeType: args.mimeType,
            status: "pending",
            // Initialize extracted data fields
            merchantName: undefined,
            merchantAddress: undefined,
            merchantContact: undefined,
            transactionDate: undefined,
            transactionAmount: undefined,
            currency: undefined,
            receiptSummary: undefined,
            items: [],
        })

        return receiptId
    }
})

// function to get user's receipts from convex db
export const getReceipts = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("receipts")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .collect()
    }
})

// function to get a single receipt by id
export const getReceiptById = query({
    args: {
        receiptId: v.id("receipts"),
    },
    handler: async (ctx, args) => {
        // get receipt by id
        const receipt = await ctx.db.get(args.receiptId)
        if (receipt) {
            const identity = await ctx.auth.getUserIdentity()
            if (!identity) {
                throw new Error("User not authenticated")
            }

            const userId = identity.subject
            if (receipt.userId !== userId) {
                throw new Error("User not authorized to access this receipt")
            }
        }
        return receipt
    }
})

// Generate a URL to downloaad a receipt file
export const getReceiptDownloadUrl = query({
    args: {
        fileId: v.id("_storage"), // from convex storage
    },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.fileId)
    }
})

// Update receipt status
export const updateReceiptStatus = mutation({
    args: {
        receiptId: v.id("receipts"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        // Verify user has access to receipt
        const receipt = await ctx.db.get(args.receiptId)
        if (!receipt) {
            throw new Error("Receipt not found")
        }
        
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error("User not authenticated")
        }

        const userId = identity.subject
        if (receipt.userId !== userId) {
            throw new Error("User not authorized to access this receipt")
        }
        
        await ctx.db.patch(args.receiptId, {
            status: args.status,
        })
        return true
    }
})

// Delete receipt and file
export const deleteReceipt = mutation({
    args: {
        receiptId: v.id("receipts"),
    },
    handler: async (ctx, args) => {
        // Verify user has access to receipt
        const receipt = await ctx.db.get(args.receiptId)
        if (!receipt) {
            throw new Error("Receipt not found")
        }
        // Verify user is authenticated
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error("User not authenticated")
        }

        const userId = identity.subject
        if (receipt.userId !== userId) {
            throw new Error("User not authorized to access this receipt")
        }
        
        // Delete receipt and file
        await ctx.storage.delete(receipt.fileId)
        await ctx.db.delete(args.receiptId)
        
        return true
    }
})

// Update a receipt with extracted data
export const updateReceiptData = mutation({
    args: {
        id: v.id("receipts"),
        fileDisplayname: v.string(),
        merchantName: v.string(),
        merchantAddress: v.string(),
        merchantContact: v.string(),
        transactionDate: v.string(),
        transactionAmount: v.number(),
        currency: v.string(),
        receiptSummary: v.string(),
        items: v.array(v.object({
            name: v.string(),
            unitPrice: v.number(),
            totalPrice: v.number(),
            quantity: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        // Verify user has access to receipt
        const receipt = await ctx.db.get(args.id)
        if (!receipt) {
            throw new Error("Receipt not found")
        }
        // Verify user is authenticated
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error("User not authenticated")
        }

        const userId = identity.subject
        if (receipt.userId !== userId) {
            throw new Error("User not authorized to access this receipt")
        }
        
        // Update receipt with extracted data
        await ctx.db.patch(args.id, {
            fileDisplayname: args.fileDisplayname,
            merchantName: args.merchantName,
            merchantAddress: args.merchantAddress,
            merchantContact: args.merchantContact,
            transactionDate: args.transactionDate,
            transactionAmount: args.transactionAmount,
            currency: args.currency,
            receiptSummary: args.receiptSummary,
            items: args.items,
            status: "processed", // set status to processed now that data has been extracted
        })

        return {
            userId: receipt.userId,
        }
    }
})