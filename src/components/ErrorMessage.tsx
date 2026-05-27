import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  errorType?: 'network' | 'server' | 'timeout' | 'general';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, errorType = 'general' }) => {
  const getErrorDetails = () => {
    switch (errorType) {
      case 'network':
        return {
          icon: '🌐',
          title: 'Connection Problem',
          suggestion: 'Please check your internet connection and try again.'
        };
      case 'server':
        return {
          icon: '🔧',
          title: 'Server Error',
          suggestion: 'The server is experiencing issues. Please try again in a moment.'
        };
      case 'timeout':
        return {
          icon: '⏰',
          title: 'Request Timed Out',
          suggestion: 'The request took too long. Please try again.'
        };
      default:
        return {
          icon: '⚠️',
          title: 'Something went wrong',
          suggestion: 'An unexpected error occurred.'
        };
    }
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="error-container">
      <div className="error-icon">{errorDetails.icon}</div>
      <h3 className="error-title">{errorDetails.title}</h3>
      <p className="error-message">{message}</p>
      <p className="error-suggestion">{errorDetails.suggestion}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          {errorType === 'network' ? 'Check Connection & Retry' : 'Try Again'}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;