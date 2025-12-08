import React, { useState } from 'react';
import { DollarSign, Download, Eye, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { Card, Button, Badge, Table, Modal } from '../components/UI';
import { PAYROLL_FREQUENCY, DEDUCTION_TYPES, ALLOWANCE_TYPES } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const Payroll = () => {
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [payrollMonth, setPayrollMonth] = useState('2025-12');

  // Mock payroll data
  const [payslips] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      month: '2025-12',
      status: 'processed',
      baseSalary: 85000,
      allowances: {
        da: 15000,
        hra: 12750,
        conveyance: 2000,
        medical: 1000,
      },
      deductions: {
        income_tax: 8500,
        pf: 8500,
        esi: 850,
      },
      netSalary: 98900,
      processedDate: '2025-12-05',
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Jane Smith',
      month: '2025-12',
      status: 'processed',
      baseSalary: 65000,
      allowances: {
        da: 11700,
        hra: 9750,
        conveyance: 1500,
      },
      deductions: {
        income_tax: 6500,
        pf: 6500,
        esi: 650,
      },
      netSalary: 74300,
      processedDate: '2025-12-05',
    },
  ]);

  const columns = [
    {
      key: 'name',
      label: 'Employee',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{row.employeeId}</p>
        </div>
      ),
    },
    {
      key: 'month',
      label: 'Month',
    },
    {
      key: 'baseSalary',
      label: 'Base Salary',
      render: (value) => <span className="font-medium">{formatCurrency(value)}</span>,
    },
    {
      key: 'netSalary',
      label: 'Net Salary',
      render: (value) => <span className="font-bold text-green-600">{formatCurrency(value)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <Badge variant={value === 'processed' ? 'green' : 'yellow'}>{value}</Badge>,
    },
    {
      key: 'id',
      label: 'Action',
      render: (value, row) => (
        <button
          onClick={() => {
            setSelectedPayslip(row);
            setShowModal(true);
          }}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <Eye size={16} />
          View
        </button>
      ),
    },
  ];

  const totalAllowances = selectedPayslip 
    ? Object.values(selectedPayslip.allowances).reduce((a, b) => a + b, 0)
    : 0;
  
  const totalDeductions = selectedPayslip 
    ? Object.values(selectedPayslip.deductions).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Payroll Management</h1>
            <p className="text-gray-600">Manage salaries, payslips, and compensation</p>
          </div>
          <div className="flex gap-2">
            <input
              type="month"
              value={payrollMonth}
              onChange={(e) => setPayrollMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>Process Payroll</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-gray-600 text-sm">Total Payroll</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">$173.2K</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Processed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">98%</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">2%</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Total Deductions</p>
            <p className="text-2xl font-bold text-red-600 mt-1">$19.5K</p>
          </Card>
        </div>

        {/* Payslips Table */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Payslips - {payrollMonth}</h3>
            <Button size="sm" variant="secondary" className="flex items-center gap-2">
              <Download size={16} />
              Export Report
            </Button>
          </div>
          <Table columns={columns} data={payslips} />
        </Card>

        {/* Payroll Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Salary Structure */}
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">Salary Structure</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span>Basic Salary</span>
                <span className="font-semibold">$85,000</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="font-medium text-gray-800 mb-2">Allowances</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Dearness Allowance</span>
                    <span className="font-semibold text-green-600">$15,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>House Rent Allowance</span>
                    <span className="font-semibold text-green-600">$12,750</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Conveyance</span>
                    <span className="font-semibold text-green-600">$2,000</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="font-medium text-gray-800 mb-2">Deductions</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Income Tax</span>
                    <span className="font-semibold text-red-600">-$8,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Provident Fund</span>
                    <span className="font-semibold text-red-600">-$8,500</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Payroll Timeline */}
          <Card>
            <h3 className="font-semibold text-gray-800 mb-4">Payroll Calendar</h3>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-green-600 bg-green-50">
                <p className="font-medium text-gray-800">December 2025</p>
                <p className="text-sm text-gray-600">Processed on 2025-12-05</p>
              </div>
              <div className="p-3 border-l-4 border-blue-600 bg-blue-50">
                <p className="font-medium text-gray-800">January 2026</p>
                <p className="text-sm text-gray-600">Scheduled for 2026-01-05</p>
              </div>
              <div className="p-3 border-l-4 border-gray-300 bg-gray-50">
                <p className="font-medium text-gray-800">February 2026</p>
                <p className="text-sm text-gray-600">Scheduled for 2026-02-05</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payslip Modal */}
        <Modal
          isOpen={showModal}
          title="Payslip Details"
          onClose={() => setShowModal(false)}
          size="lg"
        >
          {selectedPayslip && (
            <div className="space-y-4">
              {/* Header */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">{selectedPayslip.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedPayslip.employeeId} • {selectedPayslip.month}
                </p>
              </div>

              {/* Earnings */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Earnings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Basic Salary</span>
                    <span className="font-medium">{formatCurrency(selectedPayslip.baseSalary)}</span>
                  </div>
                  {Object.entries(selectedPayslip.allowances).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-700">{key.replace('_', ' ').toUpperCase()}</span>
                      <span className="font-medium text-green-600">+ {formatCurrency(value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                    <span>Gross Salary</span>
                    <span>{formatCurrency(selectedPayslip.baseSalary + totalAllowances)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Deductions</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(selectedPayslip.deductions).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-700">{key.replace('_', ' ').toUpperCase()}</span>
                      <span className="font-medium text-red-600">- {formatCurrency(value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 border-t border-gray-200 font-semibold">
                    <span>Total Deductions</span>
                    <span className="text-red-600">-{formatCurrency(totalDeductions)}</span>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Net Salary (Take Home)</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedPayslip.netSalary)}
                  </span>
                </div>
              </div>

              {/* Action */}
              <Button className="w-full flex items-center gap-2 justify-center">
                <Download size={16} />
                Download Payslip
              </Button>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Payroll;
