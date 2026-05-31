import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-black">ShopBD</Link>
        <nav className="flex gap-4 text-sm font-semibold">
          <Link href="/">Products</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
