"use client"
import { useParams } from "next/navigation"

function ReceiptDetail() {
    const params = useParams<{ id: string }>()

  return (
    <div>
        <h1>Receipt Detail</h1>
        <p>{params.id}</p>
    </div>
  )
}

export default ReceiptDetail