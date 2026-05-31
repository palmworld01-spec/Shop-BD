'use client'

import Header from '@/components/Header'
import { CartItem } from '@/lib/types'
import { useEffect, useMemo, useState } from 'react'

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '', phone: '', address: '', payment_method: 'Cash on Delivery', sender_number: '', trx_id: '', paid_amount: '', note: ''
  })

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'))
  }, [])

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])
  const paymentNumber = form.payment_method === 'bKash Manual Payment'
    ? process.env.NEXT_PUBLIC_BKASH_NUMBER
    : form.payment_method === 'Nagad Manual Payment'
      ? process.env.NEXT_PUBLIC_NAGAD_NUMBER
      : form.payment_method === 'Rocket Manual Payment'
        ? process.env.NEXT_PUBLIC_ROCKET_NUMBER
        : ''

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cart.length) return alert('Cart empty')
    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, paid_amount: Number(form.paid_amount || 0), items: cart, total })
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return alert(data.error || 'Order failed')
    localStorage.removeItem('cart')
    setCart([])
    alert(`Order placed successfully. Order ID: ${data.order.id}`)
  }

  return (
    <main>
      <Header />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-2">
        <div className="card">
          <h1 className="text-2xl font-black">Checkout</h1>
          <div className="mt-4 space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between border-b pb-2 text-sm">
                <span>{item.name} × {item.quantity}</span>
                <b>৳{item.price * item.quantity}</b>
              </div>
            ))}
            <div className="flex justify-between text-xl font-black"><span>Total</span><span>৳{total}</span></div>
          </div>
        </div>

        <form onSubmit={submitOrder} className="card space-y-4">
          <input className="input" placeholder="Customer Name" required value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} />
          <input className="input" placeholder="Phone Number" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <textarea className="input" placeholder="Full Address" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />

          <select className="input" value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}>
            <option>Cash on Delivery</option>
            <option>bKash Manual Payment</option>
            <option>Nagad Manual Payment</option>
            <option>Rocket Manual Payment</option>
          </select>

          {paymentNumber && (
            <div className="rounded-xl bg-amber-50 p-4 text-sm">
              <b>Payment Number:</b> {paymentNumber}<br />
              <b>Amount:</b> ৳{total}<br />
              টাকা পাঠিয়ে নিচের Sender Number এবং TrxID দিন।
            </div>
          )}

          {form.payment_method !== 'Cash on Delivery' && (
            <>
              <input className="input" placeholder="Sender Payment Number" value={form.sender_number} onChange={e => setForm({ ...form, sender_number: e.target.value })} />
              <input className="input" placeholder="Transaction ID / TrxID" value={form.trx_id} onChange={e => setForm({ ...form, trx_id: e.target.value })} />
              <input className="input" placeholder="Paid Amount" type="number" value={form.paid_amount} onChange={e => setForm({ ...form, paid_amount: e.target.value })} />
            </>
          )}

          <textarea className="input" placeholder="Order note optional" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          <button className="btn w-full" disabled={loading}>{loading ? 'Submitting...' : 'Confirm Order'}</button>
        </form>
      </section>
    </main>
  )
}
