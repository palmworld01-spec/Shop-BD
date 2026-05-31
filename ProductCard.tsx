'use client'

import Link from 'next/link'
import { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = () => {
    const current = JSON.parse(localStorage.getItem('cart') || '[]')
    const found = current.find((item: any) => item.id === product.id)
    const next = found
      ? current.map((item: any) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }]
    localStorage.setItem('cart', JSON.stringify(next))
    alert('কার্টে যোগ করা হয়েছে')
  }

  return (
    <div className="card overflow-hidden p-0">
      <Link href={`/products/${product.slug || product.id}`}>
        <img src={product.image_url} alt={product.name} className="h-56 w-full object-cover" />
      </Link>
      <div className="p-5">
        <Link href={`/products/${product.slug || product.id}`} className="text-lg font-bold hover:underline">{product.name}</Link>
        <p className="mt-1 text-sm text-slate-600">{product.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xl font-black">৳{product.price}</span>
          {product.compare_at_price ? <span className="text-sm text-slate-400 line-through">৳{product.compare_at_price}</span> : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href={`/products/${product.slug || product.id}`} className="rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold">Details</Link>
          <button onClick={addToCart} className="btn">Add</button>
        </div>
      </div>
    </div>
  )
}
