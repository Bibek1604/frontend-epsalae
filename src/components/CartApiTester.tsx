// src/components/CartApiTester.tsx
// Interactive API endpoint tester with UI

import React, { useState } from 'react';
import { CART_ENDPOINTS, getEndpointsByCategory, Endpoint, EndpointParam, RequestBody } from '../config/endpoints';
import { API_BASE_URL } from '@/config';
import './CartApiTester.css';

interface RequestLog {
  id: string;
  endpoint: Endpoint;
  timestamp: string;
  status: 'pending' | 'success' | 'error';
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: any;
  };
  response?: {
    status: number;
    data: any;
  };
  error?: string;
}

export const CartApiTester: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(CART_ENDPOINTS[0]);
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [authToken, setAuthToken] = useState('');
  const [sessionId, setSessionId] = useState('');

  const endpointsByCategory = getEndpointsByCategory();

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Build request URL
  const buildUrl = (endpoint: Endpoint): string => {
    let url = endpoint.path;

    // Replace path parameters
    if (endpoint.pathParams) {
      endpoint.pathParams.forEach((param) => {
        const value = formData[`path_${param.name}`];
        if (value) {
          url = url.replace(`:${param.name}`, value);
        }
      });
    }

    // Add query parameters
    const queryParams = new URLSearchParams();
    if (endpoint.queryParams) {
      endpoint.queryParams.forEach((param) => {
        const value = formData[`query_${param.name}`];
        if (value) {
          queryParams.append(param.name, value);
        }
      });
    }

    const queryString = queryParams.toString();
    return `${API_BASE_URL}${url}${queryString ? '?' + queryString : ''}`;
  };

  // Build request headers
  const buildHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (selectedEndpoint?.requiresAuth && authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
  };

  // Execute API request
  const executeRequest = async () => {
    if (!selectedEndpoint) return;

    const url = buildUrl(selectedEndpoint);
    const headers = buildHeaders();
    let body: any = undefined;

    // Build request body
    if (selectedEndpoint.requestBody && selectedEndpoint.method !== 'GET' && selectedEndpoint.method !== 'DELETE') {
      body = {};
      Object.keys(selectedEndpoint.requestBody).forEach((key) => {
        const value = formData[`body_${key}`];
        if (value !== undefined && value !== '') {
          body[key] = value;
        }
      });
    }

    const log: RequestLog = {
      id: Date.now().toString(),
      endpoint: selectedEndpoint,
      timestamp: new Date().toLocaleString(),
      status: 'pending',
      request: {
        method: selectedEndpoint.method,
        url,
        headers,
        body,
      },
    };

    setRequestLogs((prev) => [log, ...prev]);
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: selectedEndpoint.method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      setRequestLogs((prev) =>
        prev.map((l) =>
          l.id === log.id
            ? {
                ...l,
                status: response.ok ? 'success' : 'error',
                response: {
                  status: response.status,
                  data,
                },
              }
            : l
        )
      );
    } catch (error) {
      setRequestLogs((prev) =>
        prev.map((l) =>
          l.id === log.id
            ? {
                ...l,
                status: 'error',
                error: (error as Error).message,
              }
            : l
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({});
  };

  // Clear logs
  const clearLogs = () => {
    setRequestLogs([]);
  };

  return (
    <div className="cart-api-tester">
      <header className="tester-header">
        <div className="header-content">
          <h1>🛒 Cart API Tester</h1>
          <p>Interactive API endpoint explorer and tester</p>
        </div>
      </header>

      <div className="tester-container">
        {/* Sidebar: Endpoint List */}
        <aside className="endpoints-sidebar">
          <div className="sidebar-content">
            {Object.entries(endpointsByCategory).map(([category, endpoints]) => (
              <div key={category} className="endpoint-category">
                <h3 className="category-title">{category}</h3>
                <div className="endpoints-list">
                  {endpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      className={`endpoint-button ${
                        selectedEndpoint?.id === endpoint.id ? 'active' : ''
                      }`}
                      onClick={() => {
                        setSelectedEndpoint(endpoint);
                        setFormData({});
                      }}
                    >
                      <span className={`method ${endpoint.method.toLowerCase()}`}>
                        {endpoint.method}
                      </span>
                      <span className="path">{endpoint.path}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content: Request Builder & Response */}
        <main className="tester-main">
          {selectedEndpoint ? (
            <>
              {/* Request Builder */}
              <section className="request-builder">
                <div className="section-header">
                  <h2>{selectedEndpoint.title}</h2>
                  <p className="description">{selectedEndpoint.description}</p>
                </div>

                {/* Authentication */}
                {selectedEndpoint.requiresAuth && (
                  <div className="form-section auth-section">
                    <h4>🔐 Authentication</h4>
                    <div className="form-group">
                      <label>Auth Token</label>
                      <input
                        type="text"
                        placeholder="Bearer token (JWT)"
                        value={authToken}
                        onChange={(e) => setAuthToken(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Path Parameters */}
                {selectedEndpoint.pathParams && selectedEndpoint.pathParams.length > 0 && (
                  <div className="form-section">
                    <h4>📌 Path Parameters</h4>
                    {selectedEndpoint.pathParams.map((param) => (
                      <div key={param.name} className="form-group">
                        <label>
                          {param.name}
                          {param.required && <span className="required">*</span>}
                        </label>
                        <input
                          type={param.type === 'number' ? 'number' : 'text'}
                          placeholder={param.example}
                          value={formData[`path_${param.name}`] || ''}
                          onChange={(e) => handleInputChange(`path_${param.name}`, e.target.value)}
                        />
                        <small>{param.description}</small>
                      </div>
                    ))}
                  </div>
                )}

                {/* Query Parameters */}
                {selectedEndpoint.queryParams && selectedEndpoint.queryParams.length > 0 && (
                  <div className="form-section">
                    <h4>❓ Query Parameters</h4>
                    {selectedEndpoint.queryParams.map((param) => (
                      <div key={param.name} className="form-group">
                        <label>
                          {param.name}
                          {param.required && <span className="required">*</span>}
                        </label>
                        <input
                          type={param.type === 'number' ? 'number' : 'text'}
                          placeholder={param.example}
                          value={formData[`query_${param.name}`] || ''}
                          onChange={(e) => handleInputChange(`query_${param.name}`, e.target.value)}
                        />
                        <small>{param.description}</small>
                      </div>
                    ))}
                  </div>
                )}

                {/* Request Body */}
                {selectedEndpoint.requestBody && Object.keys(selectedEndpoint.requestBody).length > 0 && (
                  <div className="form-section">
                    <h4>📦 Request Body</h4>
                    {Object.entries(selectedEndpoint.requestBody).map(([fieldName, fieldDef]) => (
                      <div key={fieldName} className="form-group">
                        <label>
                          {fieldName}
                          {fieldDef.required && <span className="required">*</span>}
                        </label>
                        {fieldDef.type === 'object' ? (
                          <textarea
                            placeholder={JSON.stringify(fieldDef.example, null, 2)}
                            value={formData[`body_${fieldName}`] || ''}
                            onChange={(e) => handleInputChange(`body_${fieldName}`, e.target.value)}
                          />
                        ) : (
                          <input
                            type={fieldDef.type === 'number' ? 'number' : 'text'}
                            placeholder={String(fieldDef.example)}
                            value={formData[`body_${fieldName}`] || ''}
                            onChange={(e) => handleInputChange(`body_${fieldName}`, e.target.value)}
                          />
                        )}
                        <small>{fieldDef.description}</small>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={executeRequest}
                    disabled={loading}
                  >
                    {loading ? '⏳ Sending...' : '🚀 Send Request'}
                  </button>
                  <button className="btn btn-secondary" onClick={clearForm}>
                    🔄 Clear Form
                  </button>
                </div>
              </section>

              {/* Response Viewer */}
              <section className="response-viewer">
                <div className="section-header">
                  <h2>📊 Request History</h2>
                  {requestLogs.length > 0 && (
                    <button className="btn btn-small" onClick={clearLogs}>
                      Clear Logs
                    </button>
                  )}
                </div>

                {requestLogs.length === 0 ? (
                  <div className="empty-state">
                    <p>No requests yet. Send a request to see the response here.</p>
                  </div>
                ) : (
                  <div className="logs-list">
                    {requestLogs.map((log) => (
                      <details key={log.id} className={`log-item ${log.status}`}>
                        <summary className="log-summary">
                          <span className={`status-badge ${log.status}`}>{log.status.toUpperCase()}</span>
                          <span className="log-info">
                            <span className={`method ${log.request.method.toLowerCase()}`}>
                              {log.request.method}
                            </span>
                            <span className="path">{log.endpoint.path}</span>
                          </span>
                          {log.response && (
                            <span className={`status-code ${log.response.status < 400 ? 'success' : 'error'}`}>
                              {log.response.status}
                            </span>
                          )}
                          <span className="timestamp">{log.timestamp}</span>
                        </summary>

                        <div className="log-details">
                          {/* Request Details */}
                          <div className="detail-section">
                            <h4>📤 Request</h4>
                            <div className="detail-content">
                              <p><strong>URL:</strong> {log.request.url}</p>
                              <p><strong>Method:</strong> {log.request.method}</p>
                              {log.request.body && (
                                <div>
                                  <strong>Body:</strong>
                                  <pre>{JSON.stringify(log.request.body, null, 2)}</pre>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Response Details */}
                          {log.response && (
                            <div className="detail-section">
                              <h4>📥 Response</h4>
                              <div className="detail-content">
                                <p><strong>Status:</strong> {log.response.status}</p>
                                <strong>Data:</strong>
                                <pre>{JSON.stringify(log.response.data, null, 2)}</pre>
                              </div>
                            </div>
                          )}

                          {/* Error Details */}
                          {log.error && (
                            <div className="detail-section error">
                              <h4>❌ Error</h4>
                              <div className="detail-content">
                                <pre>{log.error}</pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="empty-state">
              <p>Select an endpoint from the sidebar to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CartApiTester;
