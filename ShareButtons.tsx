'use client'

import { Product } from '@/lib/types'

export default function ShareButtons({ product }: { product: Product }) {
  const getUrl = () => typeof window !== 'undefined' ? window.location.href : ''

  const shareNative = async () => {
    const url = getUrl()
    const text = `${product.name} - ৳${product.price}`
    if (navigator.share) {
      await navigator.share({ title: product.name, text, url })
    } else {
      await navigator.clipboard.writeText(url)
      alert('Product link copied')
    }
  }

  const encodedUrl = () => encodeURIComponent(getUrl())
  const encodedText = () => encodeURIComponent(`${product.name} - ৳${product.price}`)

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <button onClick={shareNative} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold">Share</button>
      <a className="rounded-xl border border-slate-300 px-4 py-2 font-semibold" target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl()}`}>Facebook</a>
      <a className="rounded-xl border border-slate-300 px-4 py-2 font-semibold" target="_blank" href={`https://wa.me/?text=${encodedText()}%20${encodedUrl()}`}>WhatsApp</a>
      <a className="rounded-xl border border-slate-300 px-4 py-2 font-semibold" target="_blank" href={`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodedText()}%20${encodedUrl()}`}>Email</a>
    </div>
  )
}
