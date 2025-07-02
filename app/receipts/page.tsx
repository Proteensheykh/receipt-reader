import PDFDropZone from '@/components/PDFDropZone'
import ReceiptList from '@/components/ReceiptList'
import React from 'react'

function Receipts() {
  return (
    <div className="container xl:max-w-4xl mx-auto px-4 py-10 md:p-0">
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            {/*     PDF Drop Zone */}
            <PDFDropZone />

            
            {/* Receipt List */}
            <ReceiptList />
        </div>
    </div>
  )
}

export default Receipts