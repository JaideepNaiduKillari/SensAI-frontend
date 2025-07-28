'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, NmapReport } from '@/lib/supabase';
import Link from 'next/link';

export default function ResultsPage() {
  const [scans, setScans] = useState<NmapReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<NmapReport | null>(null);

  useEffect(() => {
    fetchAllScans();
  }, []);

  const fetchAllScans = async () => {
    try {
      const { data, error } = await supabase
        .from('nmap_reports')
        .select('*')
        .order('timestampz', { ascending: false });

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

  const deleteScan = async (id: number) => {
    try {
      const { error } = await supabase
        .from('nmap_reports')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting scan:', error);
      } else {
        setScans(scans.filter(scan => scan.id !== id));
        setSelectedScan(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-400">Loading scan history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background Image */}
      <div className="fixed inset-0 -z-20 w-full h-full">
        <img
          src="/j.jpg"
          alt="background"
          className="w-full h-full object-cover object-center"
          style={{ minHeight: "100vh", minWidth: "100vw" }}
          draggable={false}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-20 flex items-center justify-between px-8 py-4 bg-black/60 backdrop-blur-md text-white shadow-lg">
        <div className="font-bold text-2xl tracking-tight">Sens-AI</div>
        <div className="flex gap-8 text-lg">
          <Link href="/" className="hover:underline">Dashboard</Link>
          <span className="text-blue-400">Previous Test Results</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-8 pb-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_#38bdf8]"
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Scan History
            </motion.h1>
            <p className="text-xl text-gray-300">
              View and manage all your previous network security scans
            </p>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gray-800/70 backdrop-blur-md border border-blue-400/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{scans.length}</div>
              <div className="text-gray-300">Total Scans</div>
            </div>
            <div className="bg-gray-800/70 backdrop-blur-md border border-green-400/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {scans.length}
              </div>
              <div className="text-gray-300">Completed</div>
            </div>
            <div className="bg-gray-800/70 backdrop-blur-md border border-purple-400/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {scans.length > 0 ? new Date(scans[0].timestampz).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-gray-300">Latest Scan</div>
            </div>
          </motion.div>

          {/* Scan Results Grid */}
          {scans.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">No scans found</h3>
              <p className="text-gray-400 mb-6">Start your first scan to see results here</p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-colors"
              >
                Go to Dashboard
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scan List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-blue-400 mb-4">Recent Scans</h2>
                {scans.map((scan, index) => (
                  <motion.div
                    key={scan.id}
                    className={`bg-gray-800/70 backdrop-blur-md border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedScan?.id === scan.id
                        ? 'border-blue-400/50 bg-blue-500/10'
                        : 'border-gray-600/20 hover:border-blue-400/30'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedScan(scan)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-blue-400 truncate">{scan.target}</h3>
                      <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                        completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(scan.timestampz).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {scan.analysis.substring(0, 100)}...
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Scan Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-green-400 mb-4">Scan Details</h2>
                {selectedScan ? (
                  <motion.div
                    className="bg-gray-800/70 backdrop-blur-md border border-green-400/20 rounded-lg p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-green-400">{selectedScan.target}</h3>
                      <button
                        onClick={() => deleteScan(selectedScan.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Timestamp</h4>
                        <p className="text-gray-300">{new Date(selectedScan.timestampz).toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Scan ID</h4>
                        <p className="text-gray-300 font-mono text-sm">{selectedScan.scan_id}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">AI Analysis</h4>
                        <div className="bg-gray-900/50 rounded p-4 text-sm text-gray-300 max-h-48 overflow-y-auto">
                          {selectedScan.analysis}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Raw Scan Output</h4>
                        <div className="bg-gray-900/50 rounded p-4 text-xs text-gray-300 max-h-48 overflow-y-auto font-mono">
                          <pre className="whitespace-pre-wrap">{selectedScan.scan_result}</pre>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-gray-800/70 backdrop-blur-md border border-gray-600/20 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-gray-400">Select a scan to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* SVG particle animation */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="absolute inset-0" style={{ filter: 'blur(1.5px)' }}>
          <circle cx="10%" cy="20%" r="2" fill="#38bdf8">
            <animate attributeName="cy" values="20%;80%;20%" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="80%" cy="60%" r="1.5" fill="#a21caf">
            <animate attributeName="cy" values="60%;30%;60%" dur="7s" repeatCount="indefinite" />
          </circle>
          <circle cx="50%" cy="10%" r="1.8" fill="#facc15">
            <animate attributeName="cy" values="10%;90%;10%" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="30%" cy="80%" r="1.2" fill="#22d3ee">
            <animate attributeName="cy" values="80%;40%;80%" dur="9s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
} 