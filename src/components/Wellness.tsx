import { Heart, Activity, Coffee, Smile, Headphones, PlayCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import './Wellness.css'

export default function Wellness() {
    return (
        <div className="wellness-container">
            <div className="wellness-header">
                <h2 className="section-title glow-accent">Mental & Physical Wellness</h2>
                <p className="text-muted">Personalized recovery guidance based on your vitals.</p>
            </div>

            {/* Mental Health Monitoring row */}
            <div className="grid-dashboard wellness-stats mt-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card stat-card wellness-card text-center">
                    <h4 className="card-title text-muted mb-2">Daily Mental Score</h4>
                    <div className="wellness-score">92</div>
                    <p className="status positive text-sm mt-2">Excellent balance today</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card stat-card wellness-card text-center">
                    <h4 className="card-title text-muted mb-2">Current Mood</h4>
                    <Smile size={48} color="var(--primary)" style={{ margin: '10px auto' }} className="pulse-animation" />
                    <p className="status text-primary text-sm font-semibold">Calm & Focused</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card stat-card wellness-card text-center">
                    <h4 className="card-title text-muted mb-2">Stress Detection</h4>
                    <div className="flex-center gap-2 mt-4 text-accent">
                        <Heart size={32} />
                        <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>Low</span>
                    </div>
                    <p className="status text-sm mt-3">HRV is stable.</p>
                </motion.div>
            </div>

            {/* Recovery Guidance */}
            <div className="guidance-grid mt-4">
                {/* Left: Exercises & Diet */}
                <div className="guidance-left">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card">
                        <h3 className="card-title mb-4 flex-align gap-2">
                            <Activity size={20} color="var(--primary)" />
                            Suggested Exercises
                        </h3>
                        <div className="routine-list">
                            <div className="routine-card">
                                <div className="routine-img-placeholder yoga"></div>
                                <div className="routine-info">
                                    <h4>Evening Yoga Flow</h4>
                                    <span className="text-muted text-sm">15 mins • Low Intensity</span>
                                </div>
                                <PlayCircle className="text-primary cursor-pointer" size={28} />
                            </div>

                            <div className="routine-card">
                                <div className="routine-img-placeholder stretch"></div>
                                <div className="routine-info">
                                    <h4>Post-desk Stretches</h4>
                                    <span className="text-muted text-sm">10 mins • Flexibility</span>
                                </div>
                                <PlayCircle className="text-primary cursor-pointer" size={28} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card mt-4">
                        <h3 className="card-title mb-4 flex-align gap-2">
                            <Coffee size={20} color="var(--warning)" />
                            Diet Recommendations
                        </h3>
                        <ul className="diet-list">
                            <li>
                                <span className="diet-badge">Dinner</span>
                                <p>Lean protein with magnesium-rich greens to promote deep sleep.</p>
                            </li>
                            <li>
                                <span className="diet-badge outline">Hydration</span>
                                <p>Drink 2 glasses of water before bedtime.</p>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Right: Meditation & Audio */}
                <div className="guidance-right">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card h-full flex-col">
                        <h3 className="card-title mb-4 flex-align gap-2 text-accent glow-accent">
                            <Headphones size={20} />
                            Guided Meditation
                        </h3>
                        <p className="text-muted text-sm mb-4">Wind down for the day with these customized sessions.</p>

                        <div className="audio-cards">
                            <div className="audio-card active">
                                <div className="play-btn"><PlayCircle size={32} /></div>
                                <div>
                                    <h4 className="audio-title">Deep Sleep Release</h4>
                                    <span className="text-muted text-sm">12 mins • Sleep</span>
                                </div>
                            </div>
                            <div className="audio-card">
                                <div className="play-btn outline"><PlayCircle size={32} /></div>
                                <div>
                                    <h4 className="audio-title">Stress Relief Breathing</h4>
                                    <span className="text-muted text-sm">5 mins • Focus</span>
                                </div>
                            </div>
                            <div className="audio-card">
                                <div className="play-btn outline"><PlayCircle size={32} /></div>
                                <div>
                                    <h4 className="audio-title">Morning Alignment</h4>
                                    <span className="text-muted text-sm">10 mins • Energy</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
