import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 mt-auto py-12 px-6 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display font-extrabold uppercase text-stone-100 text-sm tracking-tight">
            Deutronomy<span className="text-amber-500">.</span>
          </p>
          <p className="mt-1 text-stone-400">Curated village thrift & professional suede restoration.</p>
        </div>
        <p className="text-stone-500">© {new Date().getFullYear()} Powered By Astariqa Labs. All rights reserved.</p>
      </div>
    </footer>
  )
}