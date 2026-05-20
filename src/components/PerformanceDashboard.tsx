import React, { useState, useEffect, useCallback } from 'react';
import { performanceMonitor } from '../utils/performance';
import { analytics } from '../utils/analytics';
import './PerformanceDashboard.css';

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  apiCalls: number;
  errorRate: number;
  fps: number;
}

const PerformanceDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    renderTime: 0,
    apiCalls: 0,
    errorRate: 0,
    fps: 60
  });

  // FPS monitoring
  const [fpsCounter, setFpsCounter] = useState(0);
  const [lastFrameTime, setLastFrameTime] = useState(performance.now());

  const measureFPS = useCallback(() => {
    const now = performance.now();
    const delta = now - lastFrameTime;
    const fps = 1000 / delta;
    
    setFpsCounter(prev => {
      const newFps = Math.round(fps);
      return prev === 0 ? newFps : Math.round((prev + newFps) / 2);
    });
    
    setLastFrameTime(now);
    requestAnimationFrame(measureFPS);
  }, [lastFrameTime]);

  useEffect(() => {
    const frameId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(frameId);
  }, [measureFPS]);

  useEffect(() => {
    const updateMetrics = () => {
      const performanceMetrics = performanceMonitor.getMetrics();
      const events = analytics.getEvents();
      
      // Calculate error rate
      const totalEvents = events.length;
      const errorEvents = events.filter(e => e.name === 'error').length;
      const errorRate = totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0;

      // Get memory usage if available
      const memoryUsage = (performance as any).memory 
        ? Math.round(((performance as any).memory.usedJSHeapSize / (performance as any).memory.totalJSHeapSize) * 100)
        : 0;

      // Calculate average render time
      const renderTimes = Object.values(performanceMetrics);
      const avgRenderTime = renderTimes.length > 0 
        ? renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
        : 0;

      setMetrics({
        memoryUsage,
        renderTime: Math.round(avgRenderTime),
        apiCalls: events.filter(e => e.name === 'infinite_scroll').length,
        errorRate: Math.round(errorRate),
        fps: fpsCounter
      });
    };

    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, [fpsCounter]);

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return '#10b981'; // green
    if (value <= thresholds[1]) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const memoryColor = getStatusColor(metrics.memoryUsage, [70, 85]);
  const renderColor = getStatusColor(metrics.renderTime, [16, 50]);
  const fpsColor = getStatusColor(60 - metrics.fps, [10, 20]);
  const errorColor = getStatusColor(metrics.errorRate, [5, 15]);

  if (!isVisible) {
    return (
      <button 
        className="perf-toggle-btn"
        onClick={() => setIsVisible(true)}
        title="Show Performance Dashboard"
      >
        📊
      </button>
    );
  }

  return (
    <div className="performance-dashboard">
      <div className="perf-header">
        <h3>Performance Monitor</h3>
        <button 
          className="perf-close-btn"
          onClick={() => setIsVisible(false)}
          aria-label="Close dashboard"
        >
          ✕
        </button>
      </div>
      
      <div className="perf-metrics">
        <div className="perf-metric">
          <span className="perf-label">Memory</span>
          <span className="perf-value" style={{ color: memoryColor }}>
            {metrics.memoryUsage}%
          </span>
        </div>
        
        <div className="perf-metric">
          <span className="perf-label">Render</span>
          <span className="perf-value" style={{ color: renderColor }}>
            {metrics.renderTime}ms
          </span>
        </div>
        
        <div className="perf-metric">
          <span className="perf-label">FPS</span>
          <span className="perf-value" style={{ color: fpsColor }}>
            {metrics.fps}
          </span>
        </div>
        
        <div className="perf-metric">
          <span className="perf-label">API Calls</span>
          <span className="perf-value">
            {metrics.apiCalls}
          </span>
        </div>
        
        <div className="perf-metric">
          <span className="perf-label">Error Rate</span>
          <span className="perf-value" style={{ color: errorColor }}>
            {metrics.errorRate}%
          </span>
        </div>
      </div>
      
      <div className="perf-status">
        <span className={`status-indicator ${
          metrics.memoryUsage < 70 && 
          metrics.renderTime < 16 && 
          metrics.fps > 50 && 
          metrics.errorRate < 10 
            ? 'status-good' 
            : 'status-warning'
        }`}>
          {metrics.memoryUsage < 70 && 
           metrics.renderTime < 16 && 
           metrics.fps > 50 && 
           metrics.errorRate < 10 
            ? '🟢 Excellent' 
            : '🟡 Needs Attention'}
        </span>
      </div>
    </div>
  );
};

export default PerformanceDashboard;