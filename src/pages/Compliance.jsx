import React, { useState } from 'react';
import { Shield, FileCheck, AlertCircle, Plus, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { handleDownloadReport } from '../utils/handlers';
import { Card, Button, Badge, Table } from '../components/UI';
import { DOCUMENT_STATUS } from '../utils/constants';

const Compliance = () => {
  const [activeTab, setActiveTab] = useState('policies');

  const [policies] = useState([
    {
      id: 1,
      name: 'Code of Conduct',
      version: '2.0',
      lastUpdated: '2025-11-15',
      status: 'active',
      applicableEmployees: 324,
      acknowledgmentRate: 98,
    },
    {
      id: 2,
      name: 'Data Privacy & Security',
      version: '1.5',
      lastUpdated: '2025-10-01',
      status: 'active',
      applicableEmployees: 324,
      acknowledgmentRate: 95,
    },
    {
      id: 3,
      name: 'Anti-Harassment Policy',
      version: '1.0',
      lastUpdated: '2025-09-20',
      status: 'active',
      applicableEmployees: 324,
      acknowledgmentRate: 100,
    },
  ]);

  const [documents] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      documentType: 'Identity Verification',
      issueDate: '2020-01-15',
      expiryDate: '2030-01-14',
      status: 'verified',
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Jane Smith',
      documentType: 'Professional License',
      issueDate: '2022-06-01',
      expiryDate: '2026-05-31',
      status: 'verified',
    },
  ]);

  const [auditLogs] = useState([
    {
      id: 1,
      action: 'Policy Updated',
      object: 'Code of Conduct',
      performedBy: 'Sarah Williams',
      timestamp: '2025-12-08 10:30 AM',
      details: 'Updated section 3.2',
    },
    {
      id: 2,
      action: 'Document Verified',
      object: 'John Doe - Passport',
      performedBy: 'HR Admin',
      timestamp: '2025-12-07 02:15 PM',
      details: 'Verified for employment',
    },
  ]);

  return (
    <MainLayout>
      <div className="space-y-6 pb-6">
        {/* Header with gradient */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Compliance & Documentation
            </h1>
            <p className="text-slate-400 mt-2">Manage policies, documents, and compliance</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            New Policy
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-gray-600 text-sm">Active Policies</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">12</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Verified Documents</p>
            <p className="text-2xl font-bold text-green-600 mt-1">324</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">8</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Compliance Rate</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">98%</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: 'policies', label: 'Policies' },
            { id: 'documents', label: 'Documents' },
            { id: 'audit', label: 'Audit Trail' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'policies' && (
          <div className="space-y-4">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{policy.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                      <div>Version: {policy.version}</div>
                      <div>Updated: {policy.lastUpdated}</div>
                      <div>Employees: {policy.applicableEmployees}</div>
                      <div>Acknowledged: {policy.acknowledgmentRate}%</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="green">Active</Badge>
                    <Button size="sm" variant="secondary" className="flex items-center gap-1">
                      <Download size={14} />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'documents' && (
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">Employee Documents</h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{doc.name}</p>
                    <p className="text-sm text-gray-600">{doc.documentType}</p>
                    <p className="text-xs text-gray-500">
                      Expires: {doc.expiryDate}
                    </p>
                  </div>
                  <Badge variant="green">{doc.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'audit' && (
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">Audit Trail</h3>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{log.action}</p>
                      <p className="text-sm text-gray-600">{log.object}</p>
                    </div>
                    <span className="text-xs text-gray-500">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    By: {log.performedBy} • {log.details}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Compliance;
