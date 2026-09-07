import AdminHeader from '@/components/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <AdminHeader />
      <div className="flex-1">{children}</div>
    </div>
  )
}