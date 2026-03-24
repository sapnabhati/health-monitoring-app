import { Download, FileText, Filter, Key, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import './Reports.css'

export default function Reports() {
    return (
        <div className="reports-container">
            <div className="reports-header flex-between mb-4">
                <div>
                    <h2 className="section-title text-primary glow-primary">Health Reports</h2>
                    <p className="text-muted">View, securely store, and export your historical health data.</p>
                </div>
                <button className="btn-primary" style={{ gap: '8px' }}>
                    <Download size={18} />
                    Export All Data
                </button>
            </div>

            <div className="reports-grid">
                {/* Left Column: Recent Reports */}
                <div className="reports-list-col">
                    <div className="flex-between mb-4">
                        <h3 className="card-title">Recent Summaries</h3>
                        <div className="filter-badge">
                            <Filter size={14} /> Filter
                        </div>
                    </div>

                    <div className="reports-list">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card report-item">
                            <div className="report-icon">
                                <FileText size={24} />
                            </div>
                            <div className="report-info">
                                <h4>Weekly Health Digest</h4>
                                <p className="text-muted flex-align gap-2 text-sm mt-1">
                                    <Calendar size={14} /> Sep 10 - Sep 16, 2026
                                </p>
                            </div>
                            <button className="download-btn">
                                <Download size={20} />
                            </button>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card report-item">
                            <div className="report-icon">
                                <FileText size={24} />
                            </div>
                            <div className="report-info">
                                <h4>Monthly Cardiovascular Report</h4>
                                <p className="text-muted flex-align gap-2 text-sm mt-1">
                                    <Calendar size={14} /> August 2026
                                </p>
                            </div>
                            <button className="download-btn">
                                <Download size={20} />
                            </button>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card report-item">
                            <div className="report-icon">
                                <FileText size={24} />
                            </div>
                            <div className="report-info">
                                <h4>Sleep Cycle Analysis</h4>
                                <p className="text-muted flex-align gap-2 text-sm mt-1">
                                    <Calendar size={14} /> August 2026
                                </p>
                            </div>
                            <button className="download-btn">
                                <Download size={20} />
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column: Security Banner & History Graph */}
                <div className="security-col">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card security-card mb-4">
                        <div className="security-icon mb-3">
                            <Key size={32} color="var(--accent)" className="glow-accent" />
                        </div>
                        <h3 className="card-title">End-to-End Encrypted</h3>
                        <p className="text-muted text-sm mt-2 line-height-1-5">
                            Your health data is protected by AES-256 encryption. Only you and authorized healthcare providers can access your historical reports. Privacy-first architecture ensures your data never leaves your control.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card stats-overview-card mt-4">
                        <h3 className="card-title mb-4">Account Stats</h3>

                        <div className="overview-row">
                            <span className="text-muted">Total Days Tracked</span>
                            <span className="font-semibold text-primary">342 days</span>
                        </div>
                        <div className="overview-row">
                            <span className="text-muted">Generated Reports</span>
                            <span className="font-semibold text-primary">24 docs</span>
                        </div>
                        <div className="overview-row">
                            <span className="text-muted">Connected Devices</span>
                            <span className="font-semibold text-primary">2 online</span>
                        </div>

                        <button className="btn-primary w-full mt-4" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', boxShadow: 'none' }}>
                            Manage Data Privacy
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
