// src/components/EquityPaybillModal.tsx
'use client'

import { X, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  amount?: number
}

export default function EquityPaybillModal({ isOpen, onClose, amount }: Props) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText('0708223674')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-stone-900 border border-stone-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-white space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full border border-amber-500/20">
            Equity Bank Payment
          </span>
          <h3 className="text-xl font-extrabold mt-2 text-stone-100">
            Paybill Payment Details
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Follow the steps below to make your payment directly via M-Pesa or Equity Mobile.
          </p>
        </div>

        {/* Steps */}
        <div className="bg-stone-950/60 rounded-xl p-4 border border-stone-800 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center py-1 border-b border-stone-800/60">
            <span className="text-stone-400">Bank</span>
            <span className="font-bold text-amber-400">Equity Bank</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-stone-800/60">
            <span className="text-stone-400">Business No (Paybill)</span>
            <span className="font-bold text-amber-400 text-sm">247247</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-stone-800/60">
            <span className="text-stone-400">Account No</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400 text-sm">0708223674</span>
              <button
                onClick={handleCopy}
                className="text-stone-400 hover:text-white transition p-1"
                title="Copy Account Number"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {amount && (
            <div className="flex justify-between items-center py-1">
              <span className="text-stone-400">Total Amount</span>
              <span className="font-bold text-white text-sm">
                KES {amount.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-[11px] text-stone-400 space-y-1 leading-relaxed">
          <p><strong>1.</strong> Go to M-Pesa / Banking App &rarr; Lipa na M-Pesa &rarr; Pay Bill.</p>
          <p><strong>2.</strong> Enter Business No: <strong className="text-white">247247</strong>.</p>
          <p><strong>3.</strong> Enter Account No: <strong className="text-white">0708223674</strong>.</p>
          <p><strong>4.</strong> Enter the amount and complete the transaction.</p>
        </div>

        {/* Action */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider rounded-xl transition"
        >
          Done / Close
        </button>
      </div>
    </div>
  )
}