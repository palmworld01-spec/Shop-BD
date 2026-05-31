'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'

export default function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)

  const addToCart = () => {
    const current = JSON.parse(localStorage.getItem('cart') || '[]')
    const found = current.find((item: any) => item.id === product.id)
    const next = found
      ? current.map((item: any) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...current, { ...product, quantity }]
    localStorage.setItem('cart', JSON.stringify(next))
    alert(`${quantity} item কার্টে যোগ করা হয়েছে`)
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <div className="flex w-36 items-center justify-between rounded-xl border bg-white px-3 py-2">
        <button className="text-2xl" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
        <b>{quantity}</b>
        <button className="text-2xl" onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
      <button className="btn flex-1" onClick={addToCart}>Add to Cart</button>
    </div>
  )
}
