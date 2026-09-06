import { createClient } from '@/lib/supabase/server'
import ProductForm from './ProductForm'
import { deleteProduct, toggleProductStatus } from './actions'

function formatCondition(condition: string) {
  const labels: Record<string, string> = {
    LIKE_NEW: 'Like New',
    GENTLY_USED: 'Gently Used',
    WELL_LOVED: 'Well Loved',
  }
  return labels[condition] || condition.replace('_', ' ')
}

function formatPriceKES(price: number | string) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(numericPrice)
}

export default async function AdminInventoryPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-5 flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-stone-900">
              Inventory Management
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Add new village finds, adjust pricing, or mark pairs as sold.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-full uppercase">
            Admin Vault
          </span>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Add Shoe Form Panel */}
          <section className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-bold text-base uppercase tracking-tight text-amber-700 mb-6 flex items-center gap-2">
              <span>➕</span> Add New Pair
            </h2>
            <ProductForm />
          </section>

          {/* Current Stock Table Panel */}
          <section className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="font-display font-bold text-base uppercase tracking-tight text-stone-900">
                Current Stock ({products?.length || 0})
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Shoe</th>
                    <th className="p-3.5">Size</th>
                    <th className="p-3.5">Condition</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {products && products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50 transition">
                        <td className="p-3.5 font-bold text-stone-900">
                          {item.title}{' '}
                          <span className="text-stone-500 font-normal">
                            {item.color ? `(${item.color})` : ''}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-xs text-stone-700">{item.size}</td>
                        <td className="p-3.5 font-semibold text-xs text-stone-600">
                          {formatCondition(item.condition)}
                        </td>
                        <td className="p-3.5 font-bold text-amber-700 font-mono">
                          {formatPriceKES(item.price)}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase ${
                              item.status === 'AVAILABLE'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-stone-200 text-stone-600 border border-stone-300'
                            }`}
                          >
                            {item.status || 'AVAILABLE'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-3">
                          <form
                            action={toggleProductStatus.bind(null, item.id, item.status || 'AVAILABLE')}
                            className="inline"
                          >
                            <button
                              type="submit"
                              className="text-xs font-bold text-stone-600 hover:text-stone-900 underline cursor-pointer"
                            >
                              {item.status === 'AVAILABLE' ? 'Mark Sold' : 'Mark Available'}
                            </button>
                          </form>

                          <form action={deleteProduct.bind(null, item.id)} className="inline">
                            <button
                              type="submit"
                              className="text-xs font-bold text-red-600 hover:text-red-700 underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500 text-xs">
                        No shoes currently listed in inventory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}