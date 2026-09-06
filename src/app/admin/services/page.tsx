import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function AdminServiceQueuePage() {
  const supabase = await createClient()

  // Fetch orders containing suede dye services
  const { data: serviceOrders } = await supabase
    .from('orders')
    .select(`
      id,
      customer_email,
      customer_phone,
      shipping_address,
      service_status,
      created_at,
      order_items (
        dye_color,
        shoe_model_note,
        price
      )
    `)
    .not('service_status', 'is', null)
    .order('created_at', { ascending: false })

  // Server Action to update service stage
  async function updateStatus(formData: FormData) {
    'use server'
    const orderId = formData.get('orderId') as string
    const status = formData.get('status') as string

    const client = await createClient()
    await client
      .from('orders')
      .update({ service_status: status })
      .eq('id', orderId)

    revalidatePath('/admin/services')
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6 text-stone-900">
      <div className="flex justify-between items-center border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suede Dyeing Service Queue</h1>
          <p className="text-stone-600 text-sm">Track customer shoe drop-offs, dyeing status, and dispatch.</p>
        </div>
      </div>

      <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-700 border-b">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Shoe Model & Color</th>
              <th className="p-3">Address</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Update Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {serviceOrders?.map((order) => {
              const item = order.order_items?.[0]
              return (
                <tr key={order.id} className="hover:bg-stone-50">
                  <td className="p-3">
                    <p className="font-semibold text-stone-900">{order.customer_phone}</p>
                    <p className="text-xs text-stone-500">{order.customer_email}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-stone-800">{item?.shoe_model_note || 'Clarks Suede'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-stone-100 border border-stone-300 text-[10px] font-bold rounded">
                      {item?.dye_color?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-stone-600 max-w-xs truncate">{order.shipping_address}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {order.service_status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <form action={updateStatus} className="inline-flex items-center space-x-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.service_status}
                        className="p-1 text-xs border border-stone-300 rounded bg-white"
                      >
                        <option value="WAITING_FOR_PAIR">WAITING_FOR_PAIR</option>
                        <option value="RECEIVED">RECEIVED</option>
                        <option value="IN_PREPARATION">IN_PREPARATION</option>
                        <option value="DYED">DYED</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                      </select>
                      <button type="submit" className="px-2.5 py-1 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800">
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}