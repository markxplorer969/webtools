import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, Mail, Clock, ExternalLink, Trash2 } from 'lucide-react';

const TempEmail = () => {
  const [email, setEmail] = useState('');
  const [inbox, setInbox] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const generateEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/temp-mail?action=generate');
      const data = await response.json();
      
      if (data && data.length > 0) {
        setEmail(data[0]);
        setInbox([]); // Clear inbox when new email is generated
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInbox = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      // Parse email to get login and domain
      const [login, domain] = email.split('@');
      
      const response = await fetch(`/api/temp-mail?action=read&login=${login}&domain=${domain}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setInbox(data);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Error refreshing inbox:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (error) {
      console.error('Failed to copy email:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearInbox = () => {
    setInbox([]);
  };

  // Auto-refresh inbox every 30 seconds if email exists
  useEffect(() => {
    if (!email) return;
    
    const interval = setInterval(() => {
      refreshInbox();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [email]);

  // Calculate time since last refresh
  const getTimeSinceRefresh = () => {
    if (!lastRefresh) return null;
    const now = new Date();
    const diff = Math.floor((now - lastRefresh) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Temporary Email</h1>
          <p className="text-gray-600">Generate disposable email addresses for privacy protection</p>
        </div>

        {/* Email Generation Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="space-y-4">
            {/* Email Display */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Temporary Email Address
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={email || 'Click "Generate Email" to create address'}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-mono"
                    placeholder="No email generated"
                  />
                  <button
                    onClick={copyEmail}
                    disabled={!email}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={generateEmail}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Mail className="w-4 h-4" />
                {isLoading ? 'Generating...' : 'Generate Email'}
              </button>
              
              <button
                onClick={refreshInbox}
                disabled={isLoading || !email}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh Inbox'}
              </button>

              {inbox.length > 0 && (
                <button
                  onClick={clearInbox}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Inbox
                </button>
              )}
            </div>

            {/* Status Info */}
            {email && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {lastRefresh ? `Last refresh: ${getTimeSinceRefresh()}` : 'Not refreshed yet'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{inbox.length} messages</span>
                </div>
                <div className="text-xs text-gray-500">
                  Auto-refreshes every 30 seconds
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inbox Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Inbox</h2>
            {email && (
              <button
                onClick={refreshInbox}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 inline mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
          </div>

          {!email ? (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No email address generated</p>
              <p className="text-sm mt-2">Generate an email address to receive messages</p>
            </div>
          ) : inbox.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No messages in inbox</p>
              <p className="text-sm mt-2">Messages will appear here automatically</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inbox.map((message, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{message.subject}</h3>
                        {message.hasAttachment && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            Attachment
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>From: {message.from}</span>
                        <span>{formatDate(message.date)}</span>
                        {message.size && (
                          <span>{formatFileSize(message.size)}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(message.messageUrl, '_blank')}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  {/* Message Preview */}
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
                    <div dangerouslySetInnerHTML={{ __html: message.textBody || message.htmlBody || 'No content' }} />
                  </div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h4>
                      <div className="flex flex-wrap gap-2">
                        {message.attachments.map((attachment, attIndex) => (
                          <div
                            key={attIndex}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm text-gray-700"
                          >
                            <span>{attachment.filename}</span>
                            <span className="text-xs text-gray-500">
                              ({formatFileSize(attachment.size)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">How to use:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Click "Generate Email" to create a temporary address</li>
            <li>• Use the email for registrations and verifications</li>
            <li>• Messages appear automatically in your inbox</li>
            <li>• Email addresses expire after inactivity (varies by provider)</li>
            <li>• Never use temporary emails for important accounts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TempEmail;