import Header from '@/components/Header'
import AddToCart from '@/components/AddToCart'
import ShareButtons from '@/components/ShareButtons'
import { findDemoProduct } from '@/lib/products'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { notFound } from 'next/navigation'

async function getProduct(slug: string): Promise<Product | null> {
  if (supabase) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single()
    if (data) return data as Product
  }
  return findDemoProduct(slug) || null
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return notFound()
  const images = product.images?.length ? product.images : [product.image_url]
  const specs = (product.specs || {}) as Record<string, string>

  return (
    <main>
      <Header />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div>
          <img src={product.image_url} alt={product.name} className="h-[430px] w-full rounded-3xl object-cover" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {images.slice(0, 4).map((img, index) => (
              <img key={index} src={img} alt={`${product.name} ${index + 1}`} className="h-24 rounded-xl object-cover" />
            ))}
          </div>
        </div>

        <div className="card">
          <p className="text-sm font-semibold text-slate-500">{product.category || 'Product'} {product.sku ? `• SKU: ${product.sku}` : ''}</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-slate-600">{product.description}</p>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-4xl font-black">৳{product.price}</span>
            {product.compare_at_price ? <span className="text-lg text-slate-400 line-through">৳{product.compare_at_price}</span> : null}
          </div>
          <p className={`mt-3 text-sm font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>Stock: {product.stock}</p>
          <AddToCart product={product} />
          <ShareButtons product={product} />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-12 md:grid-cols-2">
        <div className="card">
          <h2 className="text-2xl font-black">Product Details</h2>
          <p className="mt-3 leading-7 text-slate-700">{product.long_description || product.description}</p>
          {product.features?.length ? (
            <ul className="mt-5 list-disc space-y-2 pl-5 text-slate-700">
              {product.features.map(feature => <li key={feature}>{feature}</li>)}
            </ul>
          ) : null}
        </div>
        <div className="card">
          <h2 className="text-2xl font-black">Specification</h2>
          <div className="mt-4 divide-y">
            {Object.entries(specs).length ? Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 py-3 text-sm">
                <b>{key}</b>
                <span className="text-right text-slate-600">{value}</span>
              </div>
            )) : <p className="text-slate-600">No specification added.</p>}
          </div>
        </div>
      </section>
    </main>
  )
}
