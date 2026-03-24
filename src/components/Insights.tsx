import { useState, useEffect } from 'react'
import { Brain, AlertCircle, TrendingUp, ChevronRight, Activity, Moon, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import './Insights.css'

export default function Insights() {
    const [stressData, setStressData] = useState<{ risk_level: string, confidence: number, feature_summary: string } | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    
    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/predict/stress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Using dummy vitals that trigger a moderate/high response based on our trained model
                    body: JSON.stringify({
                        heart_rate: 90,
                        sleep_quality: 4,
                        activity_level: 2000,
                        work_hours: 10
                    })
                });
                const data = await response.json();
                setStressData(data);
            } catch (err) {
                console.error("Failed to connect to ML Backend:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrediction();
    }, []);

    return (
        <div className="insights-container">
            <div className="insights-grid">
                {/* Left Column: AI Summary */}
                <div className="ai-summary-col">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card ai-card">
                        <div className="ai-header">
                            <div className="ai-icon-wrapper">
                                <Brain size={32} />
                            </div>
                            <div>
                                <h3 className="card-title glow-primary">Aura AI Analysis</h3>
                                <p className="text-muted text-sm">Real-time health interpretation</p>
                            </div>
                        </div>

                        <div className="ai-chat-bubble mt-4">
                            {isLoading ? (
                                <div className="flex-align gap-2 text-muted"> <Loader2 size={16} className="spin" /> Analyzing live vitals... </div>
                            ) : (
                                <p>
                                    "Hello Sankarlal. Based on your live data and ML analysis, your estimated stress risk level is <strong>{stressData?.risk_level || 'Moderate'}</strong>
                                    {stressData?.confidence ? ` (Confidence: ${Math.round(stressData.confidence * 100)}%)` : ''}.
                                    {stressData?.feature_summary || " I suggest reviewing your sleep patterns to help improve recovery."}"
                                </p>
                            )}
                        </div>

                        <div className="ai-suggestions mt-4">
                            <h4 className="suggestion-title">AI Recommendations</h4>
                            <ul className="suggestion-list">
                                <li><Activity size={16} color="var(--primary)" /> Try to complete your workout 3 hours before bedtime.</li>
                                <li><Moon size={16} color="#8b5cf6" /> Avoid blue light exposure after 9 PM.</li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card mt-4">
                        <h3 className="card-title flex-align gap-2">
                            <TrendingUp size={20} color="var(--warning)" />
                            Lifestyle Patterns
                        </h3>
                        <p className="text-muted mt-2 text-sm">How your daily habits affect your health score.</p>

                        <div className="pattern-bars mt-4">
                            <div className="pattern-item">
                                <div className="flex-between mb-1">
                                    <span className="pattern-label">Work Stress vs Sleep</span>
                                    <span className="pattern-value text-warning">Negative Impact</span>
                                </div>
                                <div className="progress-bg">
                                    <div className="progress-fill warning" style={{ width: '75%' }}></div>
                                </div>
                            </div>

                            <div className="pattern-item mt-3">
                                <div className="flex-between mb-1">
                                    <span className="pattern-label">Hydration vs Energy</span>
                                    <span className="pattern-value text-accent">Positive Impact</span>
                                </div>
                                <div className="progress-bg">
                                    <div className="progress-fill accent" style={{ width: '90%' }}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Health Risks */}
                <div className="risks-col">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card">
                        <h3 className="card-title flex-align gap-2 glow-danger text-danger">
                            <AlertCircle size={20} />
                            Predicted Health Risks
                        </h3>
                        <p className="text-muted mt-2 text-sm">AI-driven early warning system based on your vitals.</p>

                        <div className="risks-list mt-4">
                            <div className="risk-card high-risk">
                                <div className="risk-header">
                                    <h4>Hypertension Risk</h4>
                                    <span className="risk-badge">Moderate - 45%</span>
                                </div>
                                <p className="risk-desc">Slightly elevated blood pressure observed after working hours. Suggested to take a 10-min walk.</p>
                                <div className="risk-action">
                                    <span>View Details</span>
                                    <ChevronRight size={16} />
                                </div>
                            </div>

                            <div className="risk-card low-risk mt-3">
                                <div className="risk-header">
                                    <h4>Dehydration</h4>
                                    <span className="risk-badge">Low - 15%</span>
                                </div>
                                <p className="risk-desc">Water intake has been optimal for the past 3 days.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
