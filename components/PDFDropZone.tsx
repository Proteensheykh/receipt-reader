"use client"

import React, { useCallback, useRef, useState } from 'react'
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useSchematicEntitlement } from '@schematichq/schematic-react'
import { uploadPDF } from '@/actions/uploadPDF'
import { CheckCircle2, CloudUpload } from 'lucide-react'
import { Button } from './ui/button'

function PDFDropzone() {
    const sensors = useSensors(useSensor(PointerSensor)) // Sensors for drag and drop
    const user = useUser() // User authentication
    const router = useRouter() // Router for navigation
    const fileInputRef = useRef<HTMLInputElement>(null) // Reference for file input

    const isUserSignedIn = !!user
    
    // Schematic entitlement for receipt scans
    const {
        value: isFeatureEnabled,
        featureUsageExceeded,
        featureAllocation,
    } = useSchematicEntitlement('receipt-scans')

    const canUpload = isFeatureEnabled && !featureUsageExceeded
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<string[]>([])
    const [isDraggingOver, setIsDraggingOver] = useState(false)

    // Handles drag over events 
    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        setIsDraggingOver(true)
    }, [])

    // Handles drag leave events
    const handleDragLeave = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        setIsDraggingOver(false)
    }, [])

    const triggerFileInput = useCallback(() => {
        if (!isUserSignedIn) {
            alert("Please sign in to upload a receipt")
            return
        }
        fileInputRef.current?.click()
    }, [isUserSignedIn])

    const handleUpload = useCallback(async (files: FileList | File[]) => {
        if (!files || files.length === 0) {
            return
        }

        if (!user) {
            alert("Please sign in to upload a receipt")
            return
        }

        if (featureUsageExceeded) {
            alert("You have reached your upload limit")
            return
        }
        
        const fileArray = Array.from(files)
        const pdfFiles = fileArray.filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
        
        if (pdfFiles.length === 0) {
            alert("Please upload a PDF file")
            return
        }

        setIsUploading(true)
        try {
            // Upload files
            const newUploadedFiles: string[] = []
            for (const file of pdfFiles) {
                // Create form data for file upload
                const formData = new FormData()
                formData.append('file', file)

                // Call server-side(action) upload function
                const result = await uploadPDF(formData)
            
                if (!result.success) {
                    throw new Error(result.error)
                }
                if (!result.data) {
                    throw new Error('No data returned from upload')
                }
                newUploadedFiles.push(result.data.receiptId)
            }
            
            setUploadedFile((prevFiles) => [...prevFiles, ...newUploadedFiles])

            setTimeout(() => {
                setUploadedFile([])
            }, 5000)

            router.push('/receipts')
        } catch (error) {
            console.error('Error uploading file:', error)
            alert(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsUploading(false)
        }
    }, [])

    // Handles file input change events
    const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return
        }
        handleUpload(event.target.files)
    }, [handleUpload])
    
    // Handles drop events
    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        setIsDraggingOver(false)
        
        if (!user) {
            alert("Please sign in to upload a receipt")
            return
        }

        if (featureUsageExceeded) {
            alert("You have reached your upload limit")
            return
        }

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            handleUpload(event.dataTransfer.files)
        }
    }, [])

    

    return (
        <DndContext sensors={sensors}>
            <div className='w-full max-w-md mx-auto rounded-lg my-12'>
                <div 
                onDragOver={canUpload ? handleDragOver : undefined} 
                onDrop={canUpload ? handleDrop : e => e.preventDefault()}
                onDragLeave={canUpload ? handleDragLeave : undefined}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${!canUpload ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    {isUploading ? (
                        <div className='flex flex-col items-center'>
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                            <p>Uploading...</p>
                        </div>
                    ) : !isUserSignedIn ? (
                        <>
                        <CloudUpload className='w-121 h-6 text-gray-400 mx-auto' />
                        <p className='text-gray-600 text-sm mt-2'>Sign in to upload a receipt</p>
                        </>
                    ) : (
                        <>
                        <CloudUpload className='w-121 h-6 text-gray-400 text-center mx-auto' />
                        <p className='text-gray-600 text-sm mt-2'>Drag and drop a PDF file here or click to upload</p>
                        <input 
                        type="file" 
                        accept="application/pdf,.pdf" 
                        onChange={handleFileInputChange} 
                        className='hidden' 
                        ref={fileInputRef}
                        />
                        <Button className='mt-4' 
                        onClick={triggerFileInput}
                        disabled={!canUpload}
                        >
                            {canUpload ? 'Upload PDF' : 'Upgrade to upload PDF'}
                        </Button>
                        </>
                    )}
                </div>

                <div className='mt-4'>
                    {featureUsageExceeded && (
                        <div className='flex items-center p-3 bg-red-50 border border-red-200 rounded-lg text-red-600'>
                            <span>
                                You have reached your upload limit of {featureAllocation} receipt scans per month.
                                Please upgrade your plan to continue.
                            </span>
                        </div>
                    )}

                    {uploadedFile.length > 0 && (
                        <div className='mt-4'>
                            <h3 className='font-medium'>Uploaded files:</h3>
                            <ul className='mt-2 text-sm text-gray-600 space-y-1'>
                                {uploadedFile.map((fileName, index) => (
                                    <li key={index} className='flex items-center'>
                                        <CheckCircle2 className='w-5 h-5 text-green-500 mr-2'/>
                                        {fileName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </DndContext>
    )
}

export default PDFDropzone