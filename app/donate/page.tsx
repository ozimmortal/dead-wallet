"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Heart, Wallet, CreditCard, Bitcoin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DonatePage() {
  const [hasDonated, setHasDonated] = useState(false)
// Check if user has previously donated (would be implemented with actual storage in a real app)
  useEffect(() => {
    const hasUserDonated = localStorage.getItem("hasDonated")
    if (hasUserDonated === "true") {
      setHasDonated(true)
    }
  }, [])

  return (
    <div className="min-h-screen font-mono bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Navbar */}
      <Navbar  />

      <main className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-full mb-4">
              <Heart className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600">
              Support Our Project
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-md">
              Your donations help us maintain and improve the Solana Wallet Checker. We appreciate any contribution, no
              matter how small.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Column - Donation Information */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Why Donate?</h2>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-purple-500/20 h-fit">
                        <Wallet className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Support Development</h3>
                        <p className="text-gray-400">
                          Help us continue developing new features and improving existing ones.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-blue-500/20 h-fit">
                        <CreditCard className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Cover Infrastructure Costs</h3>
                        <p className="text-gray-400">
                          Your donations help pay for servers, APIs, and other infrastructure costs.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-green-500/20 h-fit">
                        <Bitcoin className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Keep the Service Free</h3>
                        <p className="text-gray-400">
                          We want to keep our basic services free for everyone. Your donations make this possible.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-white mb-4">What We&apos;ll Use It For</h2>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>Developing new analytics features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>Improving data accuracy and coverage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>Expanding to support more blockchain networks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>Enhancing the user interface and experience</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                      <span>Maintaining servers and API access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {hasDonated && (
                <Card className="bg-green-900/20 border-green-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-500/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-400"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">Thank You!</h3>
                        <p className="text-gray-300">
                          We&apos;ve noticed you&apos;ve donated before. Thank you for your continued support!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Right Column - Donation Widget */}
            <motion.div
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex flex-col items-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-full mb-4 text-center">
                <h2 className="text-xl font-medium text-white">Donate with Cryptocurrency</h2>
                <p className="text-gray-400 text-sm mt-1">Support our project with your preferred cryptocurrency</p>
              </div>

              <div className="flex justify-center">
                <iframe
                  src="https://nowpayments.io/embeds/donation-widget?api_key=PR9RK3M-476MA4G-H9XDR4J-9G2KH4V"
                  width="346"
                  height="623"
                  frameBorder="0"
                  scrolling="no"
                  style={{ overflowY: "hidden" }}
                  title="NOWPayments Donation Widget"
                >
                  Can&apos;t load widget
                </iframe>
              </div>
            </motion.div>
          </div>
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
