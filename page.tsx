'use client'

import Header from '@/components/Header'
import { Order, Product } from '@/lib/types'
import { useState } from 'react'

const emptyProduct = {
  id: '', slug: '', name: '', price: '', compare_at_price: '', image_url: '', images: '', description: '', long_description: '', category: '', brand: '', sku: '', stock: '0', features: '', specs: '', is_active: true
}

export default function AdminPage() {
  const [pin, setPin] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'orders' | 'products'>('orders')
  const [productForm, setProductForm] = useState<any>(emptyProduct)

  const loadOrders = async () => {
    setLoading(true)
    const res = await fetch(`/api/orders?pin=${pin}`)
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return alert(data.error || 'Failed')
    setOrders(data.orders)
  }

  const loadProducts = async () => {
    setLoading(true)
    const res = await fetch('/api/products')
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return alert(data.error || 'Failed')
    setProducts(data.products)
  }

  const loadAll = async () => {
    await loadOrders()
    await loadProducts()
  }

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, pin })
    })
    const data = await res.json()
    if (!res.ok) return alert(data.error || 'Failed')
    setOrders(orders.map(order => order.id === id ? data.order : order))
  }

  const editProduct = (product: Product) => {
    setTab('products')
    setProductForm({
      ...product,
      price: String(product.price),
      compare_at_price: product.compare_at_price ? String(product.compare_at_price) : '',
      stock: String(product.stock),
      images: product.images?.join('\n') || product.image_url,
      features: product.features?.join('\n') || '',
      specs: product.specs ? JSON.stringify(product.specs, null, 2) : ''
    })
  }

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    let specs = {}
    if (productForm.specs?.trim()) {
      try { specs = JSON.parse(productForm.specs) } catch { return alert('Specs must be valid JSON') }
    }
    const payload = {
      pin,
      slug: productForm.slug,
      name: productForm.name,
      price: Number(productForm.price || 0),
      compare_at_price: productForm.compare_at_price ? Number(productForm.compare_at_price) : null,
      image_url: productForm.image_url,
      images: productForm.images ? productForm.images.split('\n').map((x: string) => x.trim()).filter(Boolean) : [],
      description: productForm.description,
      long_description: productForm.long_description,
      category: productForm.category,
      brand: productForm.brand,
      sku: productForm.sku,
      stock: Number(productForm.stock || 0),
      features: productForm.features ? productForm.features.split('\n').map((x: string) => x.trim()).filter(Boolean) : [],
      specs,
      is_active: productForm.is_active
    }
    const isEdit = Boolean(productForm.id)
    const res = await fetch('/api/products', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEdit ? { ...payload, id: productForm.id } : payload)
    })
    const data = await res.json()
    if (!res.ok) return alert(data.error || 'Failed')
    alert(isEdit ? 'Product updated' : 'Product added')
    setProductForm(emptyProduct)
    loadProducts()
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    const res = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, pin })
    })
    const data = await res.json()
    if (!res.ok) return alert(data.error || 'Failed')
    setProducts(products.filter(product => product.id !== id))
  }

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="card flex flex-col gap-3 md:flex-row">
          <input className="input" type="password" placeholder="Admin PIN" value={pin} onChange={e => setPin(e.target.value)} />
          <button className="btn" onClick={loadAll}>{loading ? 'Loading...' : 'Load Admin Data'}</button>
        </div>

        <div className="mt-6 flex gap-2">
          <button className={`rounded-xl px-5 py-3 font-semibold ${tab === 'orders' ? 'bg-slate-900 text-white' : 'bg-white border'}`} onClick={() => setTab('orders')}>Orders</button>
          <button className={`rounded-xl px-5 py-3 font-semibold ${tab === 'products' ? 'bg-slate-900 text-white' : 'bg-white border'}`} onClick={() => setTab('products')}>Products</button>
        </div>

        {tab === 'orders' && (
          <div className="mt-6 space-y-5">
            {orders.map(order => (
              <div key={order.id} className="card">
                <div className="flex flex-col justify-between gap-2 md:flex-row">
                  <div>
                    <h2 className="text-xl font-black">#{order.id.slice(0, 8)} — {order.customer_name}</h2>
                    <p className="text-sm text-slate-600">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold">{order.status}</span>
                </div>

                <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p><b>Phone:</b> {order.phone}</p>
                    <p><b>Address:</b> {order.address}</p>
                    <p><b>Total:</b> ৳{order.total}</p>
                    <p><b>Payment:</b> {order.payment_method}</p>
                    <p><b>Sender:</b> {order.sender_number || '-'}</p>
                    <p><b>TrxID:</b> {order.trx_id || '-'}</p>
                    <p><b>Paid:</b> ৳{order.paid_amount || 0}</p>
                  </div>
                  <div>
                    <b>Items:</b>
                    <ul className="mt-2 list-disc pl-5">
                      {order.items?.map(item => <li key={item.id}>{item.name} × {item.quantity} = ৳{item.price * item.quantity}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="btn" onClick={() => updateStatus(order.id, 'payment_approved')}>Approve Payment</button>
                  <button className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white" onClick={() => updateStatus(order.id, 'payment_rejected')}>Reject</button>
                  <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white" onClick={() => updateStatus(order.id, 'shipped')}>Shipped</button>
                  <button className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white" onClick={() => updateStatus(order.id, 'delivered')}>Delivered</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'products' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <form onSubmit={saveProduct} className="card space-y-3">
              <h2 className="text-2xl font-black">{productForm.id ? 'Edit Product' : 'Add Product'}</h2>
              <input className="input" placeholder="Product Name" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
              <input className="input" placeholder="Slug e.g. cotton-tshirt" required value={productForm.slug} onChange={e => setProductForm({ ...productForm, slug: e.target.value })} />
              <div className="grid gap-3 md:grid-cols-2">
                <input className="input" placeholder="Price" type="number" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                <input className="input" placeholder="Old Price optional" type="number" value={productForm.compare_at_price} onChange={e => setProductForm({ ...productForm, compare_at_price: e.target.value })} />
              </div>
              <input className="input" placeholder="Main Image URL" required value={productForm.image_url} onChange={e => setProductForm({ ...productForm, image_url: e.target.value })} />
              <textarea className="input" placeholder="Gallery image URLs, one per line" value={productForm.images} onChange={e => setProductForm({ ...productForm, images: e.target.value })} />
              <textarea className="input" placeholder="Short Description" required value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
              <textarea className="input" placeholder="Full Product Details" value={productForm.long_description} onChange={e => setProductForm({ ...productForm, long_description: e.target.value })} />
              <div className="grid gap-3 md:grid-cols-2">
                <input className="input" placeholder="Category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} />
                <input className="input" placeholder="Brand" value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} />
                <input className="input" placeholder="SKU" value={productForm.sku} onChange={e => setProductForm({ ...productForm, sku: e.target.value })} />
                <input className="input" placeholder="Stock" type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} />
              </div>
              <textarea className="input" placeholder="Features, one per line" value={productForm.features} onChange={e => setProductForm({ ...productForm, features: e.target.value })} />
              <textarea className="input font-mono text-xs" placeholder='Specs JSON e.g. {"Material":"Cotton"}' value={productForm.specs} onChange={e => setProductForm({ ...productForm, specs: e.target.value })} />
              <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={productForm.is_active} onChange={e => setProductForm({ ...productForm, is_active: e.target.checked })} /> Active Product</label>
              <div className="flex gap-2">
                <button className="btn" type="submit">Save Product</button>
                <button type="button" className="rounded-xl border px-5 py-3 font-semibold" onClick={() => setProductForm(emptyProduct)}>Clear</button>
              </div>
            </form>

            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="card flex gap-4">
                  <img src={product.image_url} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-black">{product.name}</h3>
                    <p className="text-sm text-slate-600">৳{product.price} • Stock {product.stock} • {product.is_active ? 'Active' : 'Hidden'}</p>
                    <p className="mt-1 text-sm text-slate-500">/{product.slug}</p>
                    <div className="mt-3 flex gap-2">
                      <button className="rounded-lg border px-3 py-2 text-sm font-semibold" onClick={() => editProduct(product)}>Edit</button>
                      <button className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => deleteProduct(product.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
