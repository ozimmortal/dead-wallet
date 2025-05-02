"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Activity,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Info,
  TrendingUp,
  TrendingDown,
  Copy,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Coins,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WalletStatusCardProps {
  status: {
    isDead: boolean
    lastActivity: Date
    daysSinceLastActivity: number
    totalTransactions: number
    incomingTransactions: number
    outgoingTransactions: number
    balanceChange: number
    activityScore: number
  }
  address: string
}

export function WalletStatusCard({ status, address }: WalletStatusCardProps) {
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate activity level text based on score
  const getActivityLevel = (score: number) => {
    if (score >= 80) return "Very High"
    if (score >= 60) return "High"
    if (score >= 40) return "Moderate"
    if (score >= 20) return "Low"
    return "Very Low"
  }

  // Get color based on activity score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-emerald-500"
    if (score >= 40) return "bg-yellow-500"
    if (score >= 20) return "bg-orange-500"
    return "bg-red-500"
  }

  // Calculate transaction ratio
  const incomingRatio =
    status.totalTransactions > 0 ? (status.incomingTransactions / status.totalTransactions) * 100 : 0

  const outgoingRatio =
    status.totalTransactions > 0 ? (status.outgoingTransactions / status.totalTransactions) * 100 : 0

  return (
    <Card className="w-full overflow-hidden border-0 shadow-xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <div className="absolute top-0 left-0 w-full h-1">
        <div
          className={cn("h-full", getScoreColor(status.activityScore))}
          style={{ width: `${status.activityScore}%` }}
        />
      </div>

      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-1.5 rounded-full bg-violet-500/20">
                <Wallet className="w-5 h-5 text-violet-400" />
              </div>
              Wallet Status
            </CardTitle>

            <div className="flex items-center mt-2 space-x-2">
              <code className="bg-gray-800/80 px-2 py-1 rounded text-sm font-mono text-gray-300 border border-gray-700">
                {address.slice(0, 6)}...{address.slice(-6)}
              </code>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={copyAddress}>
                      {copied ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-gray-400" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{copied ? "Copied!" : "Copy address"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" asChild>
                      <a href={`https://solscan.io/account/${address}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>View on Solscan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge
                variant={status.isDead ? "destructive" : "default"}
                className={cn(
                  "px-3 py-1 text-sm font-medium",
                  status.isDead
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-green-500/20 text-green-300 border border-green-500/30",
                )}
              >
                {status.isDead ? "Inactive Wallet" : "Active Wallet"}
              </Badge>
            </motion.div>

            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {status.daysSinceLastActivity === 0 ? "Active today" : `${status.daysSinceLastActivity} days inactive`}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-gray-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gray-700 text-white">
              Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 space-y-5">
            {/* Activity Score */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-800">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-400" />
                  <span className="font-medium">Activity Score</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                        <Info className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Activity score is calculated based on transaction frequency, volume, and recency.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="mt-3">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-gray-400">{getActivityLevel(status.activityScore)} Activity</span>
                  <span className="text-sm font-bold">{status.activityScore}/100</span>
                </div>

                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full", getScoreColor(status.activityScore))}
                    initial={{ width: 0 }}
                    animate={{ width: `${status.activityScore}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Balance Change */}
            <div
              className={cn(
                "p-4 rounded-lg border",
                status.balanceChange >= 0 ? "bg-green-900/10 border-green-800/30" : "bg-red-900/10 border-red-800/30",
              )}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium">Net Balance Change</span>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    status.balanceChange >= 0 ? "text-green-400" : "text-red-400",
                  )}
                >
                  {status.balanceChange >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-bold text-base">
                    {status.balanceChange >= 0 ? "+" : ""}
                    {status.balanceChange.toFixed(6)} SOL
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-700/30 text-sm text-gray-400">
                <div className="flex justify-between items-center">
                  <span>Last activity:</span>
                  <span>{formatDate(status.lastActivity)}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-0 space-y-5">
            {/* Transaction Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium">Total TXs</span>
                </div>
                <p className="text-2xl font-bold">{status.totalTransactions}</p>
              </div>

              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownLeft className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">Incoming</span>
                </div>
                <p className="text-2xl font-bold">{status.incomingTransactions}</p>
                <p className="text-xs text-gray-400 mt-1">{incomingRatio.toFixed(1)}% of total</p>
              </div>

              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium">Outgoing</span>
                </div>
                <p className="text-2xl font-bold">{status.outgoingTransactions}</p>
                <p className="text-xs text-gray-400 mt-1">{outgoingRatio.toFixed(1)}% of total</p>
              </div>
            </div>

            {/* Transaction Flow Visualization */}
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Transaction Flow</span>
                <span className="text-xs text-gray-400">
                  {status.incomingTransactions} in / {status.outgoingTransactions} out
                </span>
              </div>

              <div className="h-4 bg-gray-700 rounded-full overflow-hidden flex">
                <motion.div
                  className="bg-green-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${incomingRatio}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="bg-red-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${outgoingRatio}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="flex justify-between mt-2 text-xs">
                <span className="text-green-400">Incoming</span>
                <span className="text-red-400">Outgoing</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white w-full flex items-center justify-center gap-1"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide details" : "Show details"}
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardFooter>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-sm border-t border-gray-800 pt-4 mt-2 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">First Seen:</p>
                  <p className="font-medium">
                    {/* This is a placeholder - you would need to add this data to your props */}
                    {formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Last Seen:</p>
                  <p className="font-medium">{formatDate(status.lastActivity)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg. Transaction Value:</p>
                  <p className="font-medium">
                    {/* This is a placeholder - you would need to add this data to your props */}
                    0.25 SOL
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Wallet Age:</p>
                  <p className="font-medium">
                    {/* This is a placeholder - you would need to add this data to your props */}
                    90 days
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-gray-400 mb-1">Activity Analysis:</p>
                <p className="text-gray-300">
                  {status.isDead
                    ? `This wallet appears to be inactive with no transactions in the last ${status.daysSinceLastActivity} days.`
                    : `This wallet shows ${getActivityLevel(status.activityScore).toLowerCase()} activity with regular transactions.`}
                  {status.balanceChange >= 0
                    ? ` The wallet has gained ${status.balanceChange.toFixed(6)} SOL overall.`
                    : ` The wallet has lost ${Math.abs(status.balanceChange).toFixed(6)} SOL overall.`}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
