import { createAgent, createTool, openai, anthropic } from "@inngest/agent-kit"
import z from "zod"

const parsePDFTool = createTool({
    name: "parse-pdf",
    description: "Analyzes the given PDF",
    parameters: z.object({
        pdfUrl: z.string().describe("The URL of the PDF to analyze"),
    }),
    handler: async ({pdfUrl}, {step}) => {
        try {
            return await step?.ai.infer("parse-pdf", {
            model: anthropic({
                model: "claude-3-5-sonnet-latest",
                defaultParameters: {
                    max_tokens: 3094,
                },
            }),
            body: {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "document",
                                source: {
                                    type: "url",
                                    url: pdfUrl,
                                }
                            },
                            {
                                type: "text",
                                text: `Extract the data from the receipt and return the structured output as follows:
                                {
                                    "merchant": {
                                        "name": "Store name",
                                        "address": "123 Main St, Anytown, USA",
                                        "contact": "+123-456-7890"
                                    },
                                    "transaction": {
                                        "date": "YYYY-MM-DD",
                                        "receipt_number": "ABC122345",
                                        "payment_method": "Credit Card"
                                    },
                                    "items": [
                                        {
                                            "name": "Item name",
                                            "quantity": 1,
                                            "unit_price": 12.34,
                                            "total_price": 12.34
                                        }
                                    ],
                                    "total": {
                                        "subtotal": 12.34,
                                        "tax": 12.34,
                                        "total": 12.34,
                                        "currency": "USD"
                                    }
                                }`
                            }
                        ]
                    }
                ]
            }
        })
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Unknown error"
        }
    }
}
})

export const receiptScanningAgent = createAgent({
    name: "Receipt Scanning Agent",
    description: "Processes receipt images and PDFs to extract key information such as vendor names, dates, amounts, and line items.",
    system: `You are an AI-powered receipt scanning assistant. Your primary role is to accurately extract and structure relevant information from scanned receipts. Your task includes recognizing and parsing details such as:
     * Merchant Information: Store name, address, contact details
     * Transaction Details: Date, time, receipt number, payment method.
     * Itemized Purchases: Product names, unit prices, discounts, quantities.
     * Total Amounts: Subtotal , taxes, total paid and my applied discounts.
     * Ensure high accuracy by detecting OCR errors and correcting misread text when possible.
     * Normalize dates, currency values, and formatted numbers to a consistent format.
     * If any key details are missing or unclear, return a structured response indicating incomplete data.
     * Handle multiple formats, languages, and varying receipt layouts efficiently.
     * Maintain a structured JSON output for easy integration with databases or expense tracking systems
     `,
    model: openai({
        model: "gpt-4o-mini",
        defaultParameters: {
            max_completion_tokens: 3094,
        },
    }),
    tools: [parsePDFTool]
})