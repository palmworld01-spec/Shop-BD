import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { demoProducts } from '@/lib/products'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'

async function getProducts(): Promise<Product[]> {
  if (!supabase) return demoProducts
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error || !data?.length) return demoProducts
  return data as Product[]
}

export default async function HomePage() {
  const products = await getProducts()
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl bg-slate-900 px-6 py-12 text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-300">Vercel + GitHub E-commerce</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black md:text-6xl">Manual bKash/Nagad Payment সহ Online Shop</h1>
          <p className="mt-4 max-w-xl text-slate-300">Product details, share option, cart, checkout, manual payment verification এবং admin approval সহ complete starter.</p>
        </div>
        <h2 className="mt-10 text-2xl font-black">Products</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </main>
  )
}
