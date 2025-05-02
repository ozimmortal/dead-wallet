import { NextResponse, NextRequest } from "next/server";
import { PublicKey } from '@solana/web3.js';
import {getCachedData, setCachedData } from '@/lib/redis'

const CACHE_TTL = 3600

export async function POST(request: NextRequest) {

    const formData = await request.formData();
    const walletAddress = formData.get('address') as string;
    if (!isSolanaAddress(walletAddress)) {
        return NextResponse.json({ message: 'Please enter a valid Solana wallet address' });
    }

    const cacheKey = `wallet:${walletAddress}`
    const cachedData = await getCachedData<any>(cacheKey)
    
    if (cachedData) {
      console.log('Serving from cache')
      return NextResponse.json(cachedData)
    }
    const result = await parseWallet(walletAddress);
    console.log('Serving from API');
    await setCachedData(cacheKey, result, CACHE_TTL)
    return NextResponse.json(result);
}

const token = process.env.API_KEY!;
function isSolanaAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      if(error instanceof Error) {
        return false;
      }
      return false;
    }
  }
interface WalletStatus {
    isDead: boolean;
    lastActivity: Date;
    daysSinceLastActivity: number;
    totalTransactions: number;
    incomingTransactions: number;
    outgoingTransactions: number;
    balanceChange: number; // SOL
    activityScore: number; // 0-100
    transactions: Transaction[]
  }
interface Transaction {
    signature: string;
    timestamp: number;
    type: string;
    description: string;
    fee: number;
    sender: string;
}
interface Error {
    message: string
    
}
  
const parseWallet = async (w: string): Promise<WalletStatus | Error> => {
    const urls = `https://api.helius.xyz/v0/addresses/${w}/transactions?api-key=${token}`;
    
    try {
      const response = await fetch(urls);
      const data = await response.json();
      
      if (!data || data.length === 0) {
        return {
          isDead: true,
          lastActivity: new Date(0),
          daysSinceLastActivity: Infinity,
          totalTransactions: 0,
          incomingTransactions: 0,
          outgoingTransactions: 0,
          balanceChange: 0,
          activityScore: 0,
          transactions: []
          
        };
      }
  
      // Process transactions
      let lastTimestamp = 0;
      let incomingCount = 0;
      let outgoingCount = 0;
      let balanceChange = 0;
      const transactions : Transaction[] = [];

      data.forEach((tx: any) => {
        // Track most recent activity
        if (tx.timestamp > lastTimestamp) {
          lastTimestamp = tx.timestamp;
        }
        // add transactions
        transactions.push({
          timestamp: tx.timestamp,
          type: tx.type,
          description: tx.description,
          signature: tx.signature,
          fee: tx.fee,
          sender: tx.feePayer
        });
        // Analyze transaction type
        if (tx.type === 'TRANSFER') {
          if (tx.description.includes(`${w} transferred`)) {
            outgoingCount++;
            // Extract SOL amount sent (simplified)
            const sentMatch = tx.description.match(/transferred (\d+\.\d+) SOL/);
            if (sentMatch) balanceChange -= parseFloat(sentMatch[1]);
          } else {
            incomingCount++;
            // Extract SOL amount received (simplified)
            const receivedMatch = tx.description.match(/transferred (\d+\.\d+) SOL to/);
            if (receivedMatch) balanceChange += parseFloat(receivedMatch[1]);
          }
        }
      });
  
      // Calculate time since last activity
      const lastActivity = new Date(lastTimestamp * 1000);
      const daysSinceLastActivity = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate activity score (0-100)
      const activityScore = Math.min(100, Math.max(0, 
        100 - (daysSinceLastActivity * 2) + // Recent activity bonus
        (Math.log(data.length) * 10 + // Transaction volume
        (outgoingCount > 0 ? 20 : 0) // Outgoing activity bonus
      )));
  
      // Determine if wallet is dead
      const isDead = daysSinceLastActivity > 90 || // No activity for 3 months
                    (data.length < 3 && daysSinceLastActivity > 30) || // Few transactions and inactive for 1 month
                    activityScore < 20; // Very low activity score
  
      return {
        isDead,
        lastActivity,
        daysSinceLastActivity,
        totalTransactions: data.length,
        incomingTransactions: incomingCount,
        outgoingTransactions: outgoingCount,
        balanceChange,
        activityScore: Math.round(activityScore),
        transactions
      };
  
    } catch (error) {
      console.error(error);
      return {
          message:"error occured"
      }
    }
  };
  
export const runtime = "edge";