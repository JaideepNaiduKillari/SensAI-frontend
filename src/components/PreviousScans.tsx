'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface ScanResult {
  id: number;
  target: string;
  scan_result: string;
  analysis: string;
  timestamp: string;
  status: string;
}

export default function PreviousScans() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreviousScans();
  }, []);

  const fetchPreviousScans = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching scans:', error);
      } else {
        setScans(data || []);
      }
    } catch (err) {
      console.error('Database error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-400 mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading previous scans...</p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-4xl">
      <motion.h2
        className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Previous Scan Results
      </motion.h2>
      
      {scans.length === 0 ? (
        <motion.div
          className="text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No previous scans found.
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {scans.map((scan, index) => (
            <motion.div
              key={scan.id}
              className="bg-gray-800/70 backdrop-blur-md border border-gray-600/20 rounded-lg p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-blue-400">{scan.target}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  scan.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {scan.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                {new Date(scan.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-gray-300 line-clamp-2">
                {scan.analysis.substring(0, 150)}...
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 