"use client"

import React from "react"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ExternalLink,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  X,
  Info,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-mobile"

interface Transaction {
  signature: string
  timestamp: number
  type: string
  description: string
  fee: number
  sender: string
}

interface TransactionsTableProps {
  transactions: Transaction[]
  walletAddress: string
  isLoading?: boolean
}

type SortField = "timestamp" | "fee" | "type"
type SortDirection = "asc" | "desc"

export function TransactionsTable({ transactions, walletAddress, isLoading = false }: TransactionsTableProps) {
  const [sortField, setSortField] = useState<SortField>("timestamp")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [expandedTx, setExpandedTx] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 10

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Determine transaction direction
  const getTransactionDirection = (tx: Transaction) => {
    return tx.description.includes(`to ${walletAddress}`) ? "in" : "out"
  }

  // Get unique transaction types for filtering
  const transactionTypes = useMemo(() => {
    const types = new Set(transactions.map((tx) => tx.type))
    return Array.from(types)
  }, [transactions])

  // Sort and filter transactions
  const processedTransactions = useMemo(() => {
    let result = [...transactions]

    // Apply type filter
    if (typeFilter) {
      result = result.filter((tx) => tx.type === typeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (tx) =>
          tx.signature.toLowerCase().includes(query) ||
          tx.description.toLowerCase().includes(query) ||
          tx.sender.toLowerCase().includes(query) ||
          tx.type.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case "timestamp":
          comparison = a.timestamp - b.timestamp
          break
        case "fee":
          comparison = a.fee - b.fee
          break
        case "type":
          comparison = a.type.localeCompare(b.type)
          break
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [transactions, sortField, sortDirection, typeFilter, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(processedTransactions.length / transactionsPerPage)

  // Get current page transactions
  const currentTransactions = useMemo(() => {
    const indexOfLastTx = currentPage * transactionsPerPage
    const indexOfFirstTx = indexOfLastTx - transactionsPerPage
    return processedTransactions.slice(indexOfFirstTx, indexOfLastTx)
  }, [processedTransactions, currentPage, transactionsPerPage])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [typeFilter, searchQuery, sortField, sortDirection])

  // Toggle sort direction
  const toggleSortDirection = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Toggle transaction expansion
  const toggleExpandTx = (signature: string) => {
    setExpandedTx((prev) => (prev === signature ? null : signature))
  }

  // Clear all filters
  const clearFilters = () => {
    setTypeFilter(null)
    setSearchQuery("")
  }

  // Auto-close expanded transaction when changing filters or page
  useEffect(() => {
    setExpandedTx(null)
  }, [typeFilter, searchQuery, sortField, sortDirection, currentPage])

  // Pagination controls
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Get transaction status badge
  const getStatusBadge = (tx: Transaction) => {
    const direction = getTransactionDirection(tx)

    if (direction === "in") {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
          Incoming
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
          Outgoing
        </Badge>
      )
    }
  }

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = []
    const maxButtonsToShow = isMobile ? 3 : 5

    // Always show first page
    if (currentPage > 2) {
      buttons.push(
        <Button
          key="first"
          variant="outline"
          size="sm"
          className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 h-8 w-8 p-0"
          onClick={() => goToPage(1)}
        >
          1
        </Button>,
      )

      // Show ellipsis if needed
      if (currentPage > 3) {
        buttons.push(
          <Button
            key="ellipsis-start"
            variant="outline"
            size="sm"
            className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 h-8 w-8 p-0 cursor-default"
            disabled
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>,
        )
      }
    }

    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1)

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1)
    }

    // Generate page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            currentPage === i
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300",
          )}
          onClick={() => goToPage(i)}
        >
          {i}
        </Button>,
      )
    }

    // Show ellipsis if needed
    if (endPage < totalPages - 1) {
      buttons.push(
        <Button
          key="ellipsis-end"
          variant="outline"
          size="sm"
          className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 h-8 w-8 p-0 cursor-default"
          disabled
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>,
      )
    }

    // Always show last page if not already included
    if (endPage < totalPages) {
      buttons.push(
        <Button
          key="last"
          variant="outline"
          size="sm"
          className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 h-8 w-8 p-0"
          onClick={() => goToPage(totalPages)}
        >
          {totalPages}
        </Button>,
      )
    }

    return buttons
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/50">
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <Skeleton className="h-9 w-32 bg-gray-700" />
          <Skeleton className="h-9 w-48 bg-gray-700" />
        </div>
        <div className="p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-4 space-y-3">
              <Skeleton className="h-6 w-full bg-gray-800" />
              <Skeleton className="h-4 w-3/4 bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden shadow-lg shadow-gray-900/20 backdrop-blur-sm">
      {/* Header with Search and Filters */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-800/90 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-medium">Transaction History</h2>
          <Badge className="bg-gray-700 hover:bg-gray-700 text-gray-300">
            {processedTransactions.length} {processedTransactions.length === 1 ? "transaction" : "transactions"}
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-900/50 border-gray-700 focus:border-gray-600 text-white placeholder:text-gray-500 w-full md:w-auto"
            />
            {searchQuery && (
              <button
                className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-300"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              "border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300",
              showFilters && "bg-gray-800 text-white",
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300"
              >
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-gray-900 border-gray-700 text-gray-300">
              <div className="space-y-2">
                <h3 className="font-medium text-white">About Transactions</h3>
                <p className="text-sm">
                  This table shows your transaction history on the Solana blockchain. Click on any row to see more
                  details about that transaction.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowDownLeft className="w-4 h-4 text-green-400" />
                  <span>Incoming transactions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                  <span>Outgoing transactions</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Filter Controls */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800/50 p-4 border-t border-b border-gray-800">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-sm text-gray-400">Filter by type:</span>
                </div>
                <Badge
                  variant={!typeFilter ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    !typeFilter
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700",
                  )}
                  onClick={() => setTypeFilter(null)}
                >
                  All
                </Badge>
                {transactionTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={typeFilter === type ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      typeFilter === type
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700",
                    )}
                    onClick={() => setTypeFilter(type)}
                  >
                    {type}
                  </Badge>
                ))}

                {(typeFilter || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-400 hover:text-white ml-auto"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile View */}
      {isMobile ? (
        <div className="bg-gray-900/50 divide-y divide-gray-800">
          {processedTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No transactions found</p>
              {(typeFilter || searchQuery) && (
                <Button variant="link" onClick={clearFilters} className="text-gray-400 hover:text-white mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {currentTransactions.map((tx) => (
                <motion.div
                  key={tx.signature}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4"
                >
                  <div
                    className="rounded-lg bg-gray-800/30 p-4 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                    onClick={() => toggleExpandTx(tx.signature)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getTransactionDirection(tx) === "in" ? (
                          <div className="bg-green-500/10 p-1.5 rounded-full">
                            <ArrowDownLeft className="w-4 h-4 text-green-400" />
                          </div>
                        ) : (
                          <div className="bg-red-500/10 p-1.5 rounded-full">
                            <ArrowUpRight className="w-4 h-4 text-red-400" />
                          </div>
                        )}
                        <span className="font-medium text-white">{tx.type}</span>
                      </div>
                      {getStatusBadge(tx)}
                    </div>

                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">{tx.description}</p>

                    <div className="flex justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(tx.timestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                        <span>{(tx.fee / 1000000000).toFixed(6)} SOL</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedTx === tx.signature && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 pt-4 border-t border-gray-700/50 text-sm grid gap-3"
                        >
                          <div>
                            <p className="text-gray-400 mb-1">Signature:</p>
                            <p className="font-mono text-white break-all text-xs">{tx.signature}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Sender:</p>
                            <p className="font-mono text-white break-all text-xs">{tx.sender}</p>
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <p className="text-gray-400 mb-1">Full Fee:</p>
                              <p className="text-white">{(tx.fee / 1000000000).toFixed(9)} SOL</p>
                            </div>
                            <Link
                              href={`https://solscan.io/tx/${tx.signature}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-500/10 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-md flex items-center gap-1 h-fit"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}

              {/* Mobile Pagination */}
              {totalPages > 1 && (
                <div className="p-4 flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 h-8 w-8 p-0"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">{renderPaginationButtons()}</div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 h-8 w-8 p-0"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="bg-gray-900/50">
          <Table>
            <TableHeader className="bg-gray-800/70">
              <TableRow className="hover:bg-gray-800 border-gray-800">
                <TableHead
                  className="text-gray-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSortDirection("type")}
                >
                  <div className="flex items-center gap-1">
                    Type
                    {sortField === "type" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead
                  className="text-gray-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSortDirection("timestamp")}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortField === "timestamp" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="text-gray-300 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSortDirection("fee")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Fee (SOL)
                    {sortField === "fee" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="text-gray-300">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No transactions found</p>
                    {(typeFilter || searchQuery) && (
                      <Button variant="link" onClick={clearFilters} className="text-gray-400 hover:text-white mt-2">
                        Clear filters
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                currentTransactions.map((tx) => (
                  <React.Fragment key={tx.signature}>
                    <TableRow
                      className={cn(
                        "border-gray-800 cursor-pointer transition-colors",
                        expandedTx === tx.signature ? "bg-gray-800/50 hover:bg-gray-800/50" : "hover:bg-gray-800/30",
                      )}
                      onClick={() => toggleExpandTx(tx.signature)}
                    >
                      <TableCell>
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {getTransactionDirection(tx) === "in" ? (
                            <div className="bg-green-500/10 p-1.5 rounded-full">
                              <ArrowDownLeft className="w-4 h-4 text-green-400" />
                            </div>
                          ) : (
                            <div className="bg-red-500/10 p-1.5 rounded-full">
                              <ArrowUpRight className="w-4 h-4 text-red-400" />
                            </div>
                          )}
                          <span className="font-medium text-white">{tx.type}</span>
                        </motion.div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-md truncate text-white">{tx.description}</div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md bg-gray-900 border-gray-700">
                              {tx.description}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-white">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {formatDate(tx.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="font-medium text-white">{(tx.fee / 1000000000).toFixed(6)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`https://solscan.io/tx/${tx.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500/10 text-blue-400 hover:text-blue-300 px-2 py-1 rounded-md flex items-center gap-1 w-fit"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </TableCell>
                    </TableRow>
                    <AnimatePresence>
                      {expandedTx === tx.signature && (
                        <motion.tr
                          className="bg-gray-800/20 border-gray-800"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell colSpan={5} className="p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400 mb-1">Signature:</p>
                                <p className="font-mono text-white break-all">{tx.signature}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 mb-1">Sender:</p>
                                <p className="font-mono text-white break-all">{tx.sender}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 mb-1">Direction:</p>
                                <p className="text-white">
                                  {getTransactionDirection(tx) === "in" ? (
                                    <span className="text-green-400">Incoming</span>
                                  ) : (
                                    <span className="text-red-400">Outgoing</span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 mb-1">Full Fee:</p>
                                <p className="text-white">{(tx.fee / 1000000000).toFixed(9)} SOL</p>
                              </div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>

          {/* Desktop Pagination */}
          {totalPages > 1 && (
            <div className="p-4 flex justify-center items-center gap-2 border-t border-gray-800">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 h-8"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1 mx-2">{renderPaginationButtons()}</div>

              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 h-8"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Pagination Info */}
      {processedTransactions.length > 0 && (
        <div className="bg-gray-800/50 p-3 border-t border-gray-800 text-sm text-gray-400 text-center">
          Showing {Math.min((currentPage - 1) * transactionsPerPage + 1, processedTransactions.length)} to{" "}
          {Math.min(currentPage * transactionsPerPage, processedTransactions.length)} of {processedTransactions.length}{" "}
          transactions
        </div>
      )}
    </div>
  )
}
