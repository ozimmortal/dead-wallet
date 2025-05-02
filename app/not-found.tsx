"use client";

import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Geist_Mono } from 'next/font/google';
import { Button } from '@/components/ui/button'; // Assuming you're using shadcn/ui

const geistMono = Geist_Mono({ subsets: ['latin'] });

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-950">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className={`${geistMono.className} text-sm font-medium text-purple-400 mb-2`}>404 ERROR</div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Lost in the <span className="text-purple-400">Blockchain</span>
          </motion.h1>
          
          <motion.p
            className="text-lg text-gray-300 mb-8 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            The wallet address or page you're looking for doesn't exist or has been moved.
            Maybe try analyzing a different Solana wallet?
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button asChild variant="default" size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            className="mt-12 text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
          </motion.div>
        </motion.div>
        
        {/* Optional: Add a cool blockchain visualization in the background */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat"></div>
        </div>
      </main>
    </div>
  );
}