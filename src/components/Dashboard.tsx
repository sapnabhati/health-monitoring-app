import { Activity, Heart, Moon, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import './Dashboard.css'

const data = [
    { time: '00:00', heartRate: 65 },
    { time: '04:00', heartRate: 62 },
    { time: '08:00', heartRate: 75 },
    { time: '12:00', heartRate: 85 },
    { time: '16:00', heartRate: 82 },
    { time: '20:00', heartRate: 72 },
    { time: '24:00', heartRate: 68 },
]

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            {/* Top Stats Row */}
            <div className="grid-dashboard stats-grid">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper heart">
                            <Heart size={24} className="pulse-animation" />
                        </div>
                        <span className="stat-label">Heart Rate</span>
                    </div>
                    <div className="stat-value">72 <span className="unit">bpm</span></div>
                    <div className="stat-trend positive">Normal</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper sleep">
                            <Moon size={24} />
                        </div>
                        <span className="stat-label">Sleep</span>
                    </div>
                    <div className="stat-value">7h 15m</div>
                    <div className="stat-trend positive">Optimal</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper stress">
                            <Zap size={24} />
                        </div>
                        <span className="stat-label">Stress Level</span>
                    </div>
                    <div className="stat-value">Low</div>
                    <div className="stat-trend positive">Relaxed</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper activity">
                            <Activity size={24} />
                        </div>
                        <span className="stat-label">Activity</span>
                    </div>
                    <div className="stat-value">6,420 <span className="unit">steps</span></div>
                    <div className="stat-trend">+12% from yesterday</div>
                </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="main-dashboard-grid mt-4">
                {/* Left Col: Charts */}
                <div className="chart-section">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="glass-card main-chart-card">
                        <div className="flex-between mb-4">
                            <h3 className="card-title">Heart Rate Activity</h3>
                            <select className="dark-select">
                                <option>Today</option>
                                <option>This Week</option>
                            </select>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                                    <Tooltip
                                        contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'white' }}
                                        itemStyle={{ color: 'var(--primary)' }}
                                    />
                                    <Area type="monotone" dataKey="heartRate" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorHeart)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Right Col: Health Score & SOS summary */}
                <div className="side-section">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="glass-card health-score-card">
                        <h3 className="card-title text-center mb-2">Daily Health Score</h3>
                        <div className="score-circle-container">
                            <div className="score-circle">
                                <div className="score-value">88</div>
                                <div className="score-label">Excellent</div>
                            </div>
                        </div>
                        <p className="score-desc mt-3 text-center">Your health is stable. Keep up the good work!</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="glass-card sync-card mt-4">
                        <div className="flex-between">
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>Device Sync</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Apple Watch Series 8</p>
                            </div>
                            <div className="sync-status online"></div>
                        </div>
                        <button className="btn-primary" style={{ width: '100%', marginTop: '16px', background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}>
                            Sync Now
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
