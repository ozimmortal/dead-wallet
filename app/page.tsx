"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { PublicKey } from "@solana/web3.js"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  X,
  AlertCircle,
  Clipboard,
  CheckCircle2,
  History,
 
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { WalletStatusCard } from "@/components/wallet-status-card"
import { TransactionsTable } from "@/components/transaction-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WalletStatus {
  isDead: boolean
  lastActivity: Date
  daysSinceLastActivity: number
  totalTransactions: number
  incomingTransactions: number
  outgoingTransactions: number
  balanceChange: number // SOL
  activityScore: number // 0-100
  transactions: Transaction[]
}

interface Transaction {
  signature: string
  timestamp: number
  type: string
  description: string
  fee: number
  sender: string
}

export default function Home() {
  const [status, setStatus] = useState<WalletStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [address, setAddress] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentWalletSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Save recent searches to localStorage when they change
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem("recentWalletSearches", JSON.stringify(recentSearches))
    }
  }, [recentSearches])

  // Validate Solana address
  const validateAddress = useCallback((addr: string): boolean => {
    if (!addr.trim()) return false
    try {
      new PublicKey(addr)
      return true
    } catch (error) {
      if (error instanceof Error) {
        return false
      }
      return false
    }
  }, [])

  // Handle input change with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.trim()) {
      setIsValidAddress(validateAddress(value))
    } else {
      setIsValidAddress(null)
    }
  }

  // Clear input field
  const clearInput = () => {
    setInputValue("")
    setIsValidAddress(null)
  }

  // Copy address to clipboard
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Add to recent searches
  const addToRecentSearches = (addr: string) => {
    setRecentSearches((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => item !== addr)
      // Add to beginning and limit to 5 items
      return [addr, ...filtered].slice(0, 5)
    })
  }

  // Use a recent search
  /*
  const useRecentSearch = (addr: string) => {
    setInputValue(addr)
    setIsValidAddress(true)
  }*/

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentWalletSearches")
  }

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateAddress(inputValue)) {
      setError("Please enter a valid Solana wallet address")
      return
    }

    setLoading(true)
    setError(null)
    setStatus(null)

    try {
      const formData = new FormData()
      formData.append("address", inputValue)

      const response = await fetch("/api/check", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to check wallet")
      }

      const result = await response.json()
      setAddress(inputValue)
      setStatus(result)
      addToRecentSearches(inputValue)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Toggle theme
 

  const handleBadgeClick = (search: string) => {
    setInputValue(search)
    setIsValidAddress(true)
  }

  return (
    <div className="min-h-screen font-mono bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Navbar */}
      <Navbar />

      <main className="py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {/* Enhanced Header Section with SEO-friendly content */}
          <motion.div
            className="text-center mb-8 w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-mono p-4 font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600">
            Analyze Solana Wallet Activity Instantly
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm font-semibold font-mono">
              Analyze any Solana wallet to determine if it&apos;s active or dormant. Get detailed transaction history,
              activity scores, and comprehensive wallet analytics.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8 mb-8 w-full backdrop-blur-sm shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      name="address"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="Enter Solana wallet address..."
                      className={cn(
                        "bg-gray-800/70 border-gray-700 text-white pl-4 pr-10 h-12 transition-all",
                        isValidAddress === false ? "border-red-500 focus-visible:ring-red-500" : "",
                        isValidAddress === true ? "border-green-500 focus-visible:ring-green-500" : "",
                      )}
                      aria-label="Solana wallet address input"
                    />
                    {inputValue && (
                      <button
                        type="button"
                        onClick={clearInput}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        aria-label="Clear input"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || isValidAddress === false}
                    className="gap-2 h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    aria-label="Analyze wallet"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Analyzing
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>

                {/* Validation feedback */}
                <AnimatePresence>
                  {isValidAddress === false && inputValue && (
                    <motion.p
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <AlertCircle className="h-3 w-3" /> Invalid Solana wallet address
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <History className="h-3 w-3" />
                    <span>Recent:</span>
                  </div>

                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-800 text-gray-300"
                      onClick={() => {
                        handleBadgeClick(search)
                      }}
                    >
                      {search.slice(0, 4)}...{search.slice(-4)}
                    </Badge>
                  ))}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 hover:text-gray-300 h-6 px-2"
                    onClick={clearRecentSearches}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </form>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="w-full mb-8 bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 flex items-center gap-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                className="w-full space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="border border-gray-800 rounded-xl p-6 bg-gray-900/30 backdrop-blur-sm">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-8 w-48 bg-gray-800" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-20 bg-gray-800" />
                          <Skeleton className="h-6 w-16 bg-gray-800" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border border-gray-800 rounded-xl overflow-hidden">
                  <div className="bg-gray-800 p-4">
                    <Skeleton className="h-6 w-40 bg-gray-700" />
                  </div>
                  <div className="p-4 bg-gray-900/30">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="py-4 space-y-2 border-b border-gray-800 last:border-0">
                        <Skeleton className="h-5 w-full bg-gray-800" />
                        <Skeleton className="h-4 w-3/4 bg-gray-800" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <AnimatePresence>
            {status && !loading && (
              <motion.div
                className="flex flex-col w-full gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Address with copy button */}
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                  <span>Wallet:</span>
                  <code className="bg-gray-800/50 px-2 py-1 rounded font-mono">
                    {address.slice(0, 8)}...{address.slice(-8)}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                    aria-label="Copy address"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                  </button>
                </div>

                {/* Wallet Status Card */}
                <WalletStatusCard
                  address={address}
                  status={{
                    isDead: status.isDead,
                    lastActivity: status.lastActivity,
                    daysSinceLastActivity: status.daysSinceLastActivity,
                    totalTransactions: status.totalTransactions,
                    incomingTransactions: status.incomingTransactions,
                    outgoingTransactions: status.outgoingTransactions,
                    balanceChange: status.balanceChange,
                    activityScore: status.activityScore,
                  }}
                />

                {/* Transactions Table */}
                <TransactionsTable transactions={status.transactions} walletAddress={address} />
              </motion.div>
            )}
          </AnimatePresence>
            {/* Footer with SEO content */}
        <footer className="mt-20 h-full   border-gray-800 p-4">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-sm text-gray-500 pb-8">
                © {new Date().getFullYear()} SolPluse. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </main>
      
    </div>
  )
}
