import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  // Fetch all orders with product details
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      phone_number,
      shipping_address,
      deposit_amount,
      balance_due,
      deposit_status,
      products (
        title,
        size
      )
    `)
    .order('created_at', { ascending: false })

  // Action to toggle dispatch / delivery completion state
  async function updateOrderStatus(formData: FormData) {
    'use server'
    const orderId = formData.get('orderId') as string
    const nextStatus = formData.get('nextStatus') as string

    const supabase = await createClient()
    await supabase
      .from('orders')
      .update({ deposit_status: nextStatus })
      .eq('id', orderId)

    revalidatePath('/admin/orders')
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 py-8 px-4 sm:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Simple Page Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h1 className="font-display font-black text-xl uppercase tracking-tight text-stone-900">
              Rider Dispatch & Deliveries
            </h1>
            <p className="text-xs text-stone-500">
              Manage 50% deposits paid and cash balances due on delivery.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            {orders?.length || 0} Total Orders
          </span>
        </div>

        {/* Orders List */}
        {!orders || orders.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 text-xs font-semibold">
            No orders placed yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any) => {
              const deposit = Number(order.deposit_amount || 0)
              const balance = Number(order.balance_due || 0)
              const isDelivered = order.deposit_status === 'FULLY_PAID'

              return (
                <div
                  key={order.id}
                  className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                    isDelivered ? 'border-stone-200 opacity-60' : 'border-stone-300'
                  }`}
                >
                  {/* Left Column: Shoe & Customer Details */}
                  <div className="space-y-1 md:w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-sm uppercase text-stone-900">
                        {order.products?.title || 'Thrift Shoe'}
                      </span>
                      <span className="text-[10px] font-extrabold bg-stone-100 text-stone-700 px-2 py-0.5 rounded uppercase">
                        UK {order.products?.size}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 font-mono space-y-0.5">
                      <p className="font-bold text-amber-800">📱 {order.phone_number}</p>
                      <p className="text-stone-500 truncate">📍 {order.shipping_address}</p>
                    </div>
                  </div>

                  {/* Middle Column: Deposit vs Balance Due */}
                  <div className="flex items-center gap-6 border-y md:border-y-0 md:border-x border-stone-100 py-3 md:py-0 md:px-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-stone-400">
                        Deposit Paid
                      </p>
                      <p className="font-mono font-bold text-emerald-700 text-sm">
                        KES {deposit.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-stone-400">
                        Collect on Delivery
                      </p>
                      <p className="font-mono font-black text-amber-700 text-sm">
                        KES {balance.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Status & Action Toggle */}
                  <div className="flex items-center justify-between md:justify-end gap-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        isDelivered
                          ? 'bg-stone-100 text-stone-600'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isDelivered ? 'Completed' : 'Pending Delivery'}
                    </span>

                    <form action={updateOrderStatus}>
                      <input type="hidden" name="orderId" value={order.id} />
                      <input
                        type="hidden"
                        name="nextStatus"
                        value={isDelivered ? 'DEPOSIT_PAID' : 'FULLY_PAID'}
                      />
                      <button
                        type="submit"
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer ${
                          isDelivered
                            ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            : 'bg-stone-900 hover:bg-amber-700 text-white'
                        }`}
                      >
                        {isDelivered ? 'Reopen' : 'Mark Delivered & Paid'}
                      </button>
                    </form>
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>
    </main>
  )
}