import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import convex from "@/lib/convexClient"
import { client } from "@/lib/schematic"
import { createAgent, createTool, openai } from "@inngest/agent-kit"
import { z } from "zod"

const saveToDatabaseTool = createTool({
    name: "Save to Database",
    description: "Saves the receipt data to the convex database.",
    parameters: z.object({
        fileDisplayname: z.string().describe("The readable display name of the receipt to show in the UI. If the file name is not human readable, use this to give a more readable name."),
        receiptId: z.string().describe("The ID of the receipt to update"),
        merchantName: z.string(),
        merchantAddress: z.string(),
        merchantContact: z.string(),
        transactionDate: z.string(),
        transactionAmount: z.number().describe("The total amount of the transaction, suming all the items on the receipt."),
        receiptSummary: z.string().describe("A summary of the receipt, including the merchant name, address, contact, transaction date, transaction amount, and currency. Include a human readable summary of the receipt. Mention both invoice number and receipt number if both are present. Include some key details about the items on the receip, this is a special featured summary so it should include some key details about the items on the receipt with some context."),
        currency: z.string(),
        items: z.array(z.object({
            name: z.string(),
            unitPrice: z.number(),
            totalPrice: z.number(),
            quantity: z.number(),
        }).describe("An Array of items on the receipt. Include the name, unit price, total price, and quantity of items.")),
    }),
    handler: async (params, context) => {
        const { 
            fileDisplayname, 
            receiptId, 
            merchantName, 
            merchantAddress, 
            merchantContact, 
            transactionDate, 
            transactionAmount, 
            receiptSummary, 
            currency, 
            items 
        } = params

        const result = await context.step?.run(
            "save-receipt-to-database",
            async () => {
                try {
                    // call the convex mutation to update the receipt with extracted data
                    const { userId } = await convex.mutation(api.receipts.updateReceiptData, {
                        id: receiptId as Id<"receipts">,
                        fileDisplayname,
                        merchantName,
                        merchantAddress,
                        merchantContact,
                        transactionDate,
                        transactionAmount,
                        receiptSummary,
                        currency,
                        items,
                    })

                    // Track event in schematic
                    await client.track({
                        event: "scan",
                        company: {
                            id: userId
                        },
                        user: {
                            id: userId
                        },
                    })

                    return {
                        addedToDb: "Success",
                        receiptId,
                        fileDisplayname,
                        merchantName,
                        merchantAddress,
                        merchantContact,
                        transactionDate,
                        transactionAmount,
                        receiptSummary,
                        currency,
                        items,
                    }
                } catch (error) {
                    return {
                        addedToDb: "Failed",
                        error: error instanceof Error ? error.message : "Unknown error"
                    }
                }
            },
        )

        if (result?.addedToDb === "Success") {
            // Only set the state if the receipt was added to the database
            context.network?.state.kv.set("saved-to-database", true)
            context.network?.state.kv.set("receipt", receiptId)
        }

        return result
    }
})

export const databaseAgent = createAgent({
    name: "Database Agent",
    description: "Responsible for taking key information regarding receipts and saving it to the convex database.",
    system: "You are a helpful assistant that takes key information regarding recepts and saves it to the convex database.",
    model: openai({
        model: "gpt-4o-mini",
        defaultParameters: {
            max_completion_tokens: 1000,
        },
    }),
    tools: [
        saveToDatabaseTool
    ]
}) 