import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { demoProducts } from '@/lib/products'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET() {
  if (!supabase) return NextResponse.json({ products: demoProducts })
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ products: data })
}

export async function POST(req: Request) {
  if (!supabase) return NextResponse.json({ error: 'Supabase env missing' }, { status: 400 })
  const body = await req.json()
  if (body.pin !== process.env.ADMIN_PIN) return unauthorized()
  const { pin, ...product } = body
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ product: data })
}

export async function PATCH(req: Request) {
  if (!supabase) return NextResponse.json({ error: 'Supabase env missing' }, { status: 400 })
  const body = await req.json()
  if (body.pin !== process.env.ADMIN_PIN) return unauthorized()
  const { pin, id, ...updates } = body
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ product: data })
}

export async function DELETE(req: Request) {
  if (!supabase) return NextResponse.json({ error: 'Supabase env missing' }, { status: 400 })
  const body = await req.json()
  if (body.pin !== process.env.ADMIN_PIN) return unauthorized()
  const { error } = await supabase.from('products').delete().eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
