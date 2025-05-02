"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Heart, Coffee,  Github, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import logo from "@/public/logo.png"
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showDonationBanner, setShowDonationBanner] = useState(true)

  // Track scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* Donation Banner */}
      <AnimatePresence>
        {showDonationBanner && (
          <motion.div
            className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white py-2 px-4 text-center text-[0.75rem] md:text-sm relative"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-4 w-4 text-red-300 text-sm" />
              <p>If you find this tool helpful, please consider supporting with a small donation!</p>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white h-7 rounded-full px-3 ml-2"
                onClick={() => window.location.href = "/donate"}
              >
                <Coffee className="h-3.5 w-3.5 mr-1" />
                <span>Donate</span>
              </Button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                onClick={() => setShowDonationBanner(false)}
                aria-label="Close donation banner"
              >
                <X className="h-4 w-4 text-lg " />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-gray-900/90 backdrop-blur-md border-b border-gray-800 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-2 flex items-center justify-center">
              <Image src={logo} alt="SolPluse Logo" width={22} height={22} className="" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600">
              SolPluse
            </span>
            <Badge
              variant="outline"
              className="ml-1 bg-gray-800/50 text-gray-300 border-gray-700 text-[10px] px-1.5 hidden sm:flex"
            >
              BETA
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
           
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            

            {/* Social Links - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                      asChild
                    >
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>GitHub</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                      asChild
                    >
                      <a href="https://x.com/oliyadza" target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Donate Button - Desktop */}
            <Button
              size="sm"
              onClick={() =>window.location.href = "/donate"}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hidden md:flex"
            >
              <Heart className="h-4 w-4 mr-1.5" />
              Support 
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-gray-900 border-t border-gray-800"
            >
              <div className="px-4 py-4 space-y-4">
            
                <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                    asChild
                  >
                    <a href="https://github.com/ozimmortal" target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                    asChild
                  >
                    <a href="https://x.com/oliyadza" target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => window.location.href = "/donate"}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 ml-auto"
                  >
                    <Heart className="h-4 w-4 mr-1.5" />
                    Support
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
