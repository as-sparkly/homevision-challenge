import React, { useState } from 'react';
import InfiniteScrollList from './components/InfiniteScrollList';
import VirtualizedInfiniteList from './components/VirtualizedInfiniteList';
import PerformanceDashboard from './components/PerformanceDashboard';
import ErrorBoundary from './utils/errorBoundary';
import './App.css';

function App() {
  const [useVirtualization, setUseVirtualization] = useState(false);
  const [showPerformance, setShowPerformance] = useState(process.env.NODE_ENV === 'development');

  return (
    <div className="App">
      <header className="App-header">
        <h1>HomeVision - House Listings</h1>
        <p>Browse through our collection of beautiful homes</p>
        
        <div className="header-controls">
          <label className="virtualization-toggle">
            <input
              type="checkbox"
              checked={useVirtualization}
              onChange={(e) => setUseVirtualization(e.target.checked)}
            />
            <span className="toggle-text">
              🚀 Virtual Scrolling {useVirtualization ? '(ON)' : '(OFF)'}
            </span>
          </label>
          
          <label className="performance-toggle">
            <input
              type="checkbox"
              checked={showPerformance}
              onChange={(e) => setShowPerformance(e.target.checked)}
            />
            <span className="toggle-text">
              📊 Performance Monitor
            </span>
          </label>
        </div>
      </header>
      
      <main>
        <ErrorBoundary>
          {useVirtualization ? (
            <VirtualizedInfiniteList />
          ) : (
            <InfiniteScrollList />
          )}
        </ErrorBoundary>
      </main>
      
      {showPerformance && <PerformanceDashboard />}
    </div>
  );
}

export default App;
