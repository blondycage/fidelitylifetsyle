'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import toast from 'react-hot-toast';

interface EarningsData {
  totalEarnings: number;
  thisMonth: number;
  thisWeek: number;
  custom: number;
}

interface PendingPayment {
  id: string;
  orderId: string;
  customerName: string;
  productName: string;
  amount: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Delivered';
}

interface Transaction {
  id: string;
  orderId: string;
  amountReceived: number;
  commission: number;
  netAmount: number;
  paymentDate: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const EarningsPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transaction-history' | 'payout-information'>('overview');
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 12000,
    thisMonth: 1200,
    thisWeek: 120,
    custom: 0
  });
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize mock data
  useEffect(() => {
    const mockPendingPayments: PendingPayment[] = [
      {
        id: '1',
        orderId: '#123456',
        customerName: 'John Doe',
        productName: 'Presidential suite',
        amount: 400,
        status: 'Pending'
      },
      {
        id: '2',
        orderId: '#123457',
        customerName: 'Jane Smith',
        productName: 'Deluxe Room',
        amount: 250,
        status: 'Pending'
      },
      {
        id: '3',
        orderId: '#123458',
        customerName: 'Mike Johnson',
        productName: 'Executive Suite',
        amount: 300,
        status: 'Pending'
      }
    ];

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        orderId: '#123456',
        amountReceived: 400,
        commission: 20,
        netAmount: 380,
        paymentDate: '09-21-25',
        status: 'Completed'
      },
      {
        id: '2',
        orderId: '#123457',
        amountReceived: 400,
        commission: 20,
        netAmount: 380,
        paymentDate: '09-21-25',
        status: 'Completed'
      },
      {
        id: '3',
        orderId: '#123458',
        amountReceived: 400,
        commission: 20,
        netAmount: 380,
        paymentDate: '09-21-25',
        status: 'Completed'
      }
    ];

    setPendingPayments(mockPendingPayments);
    setTransactions(mockTransactions);
  }, []);

  const handleAccept = (paymentId: string) => {
    setPendingPayments(prev =>
      prev.map(payment =>
        payment.id === paymentId
          ? { ...payment, status: 'Accepted' as const }
          : payment
      )
    );
    toast.success('Payment accepted successfully');
  };

  const handleReject = (paymentId: string) => {
    setPendingPayments(prev =>
      prev.map(payment =>
        payment.id === paymentId
          ? { ...payment, status: 'Rejected' as const }
          : payment
      )
    );
    toast.success('Payment rejected');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-100 text-orange-600';
      case 'Accepted':
        return 'bg-green-100 text-green-600';
      case 'Rejected':
        return 'bg-red-100 text-red-600';
      case 'Delivered':
        return 'bg-blue-100 text-blue-600';
      case 'Completed':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const renderOverview = () => (
    <>
      {/* Statistics Cards */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Total Earnings Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2F2DB] shadow-sm flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[#BDBDBD] text-base font-semibold font-urbanist">Total Earnings</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-black font-urbanist">${earningsData.totalEarnings.toLocaleString()}</p>
                <span className="text-[#34C759] text-xs font-bold">+55%</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-[#DCFAF8] rounded-2xl flex items-center justify-center">
              <img src="/images/coin-earnings.svg" alt="Coin" className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* This Month Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2F2DB] shadow-sm flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[#BDBDBD] text-base font-semibold font-urbanist">This Month</p>
              <p className="text-2xl font-bold text-black font-urbanist">${earningsData.thisMonth.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 bg-[#E7EDFF] rounded-2xl flex items-center justify-center">
              <img src="/images/timer-earnings.svg" alt="Timer" className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* This Week Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2F2DB] shadow-sm flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[#BDBDBD] text-base font-semibold font-urbanist">This Week</p>
              <p className="text-2xl font-bold text-black font-urbanist">${earningsData.thisWeek.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 bg-[#FFF5D9] rounded-2xl flex items-center justify-center">
              <img src="/images/clock-earnings.svg" alt="Clock" className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* Custom Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2F2DB] shadow-sm flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[#BDBDBD] text-base font-semibold font-urbanist">Custom</p>
              <p className="text-2xl font-bold text-black font-urbanist">${earningsData.custom.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 bg-[#E9EDF5] rounded-2xl flex items-center justify-center">
              <img src="/images/calendar-earnings.svg" alt="Calendar" className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payments Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Pending Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAFAFA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE]">
                {pendingPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                      {payment.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                      {payment.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                        <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.status === 'Pending' && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleReject(payment.id)}
                            className="px-6 py-2 bg-red-100 text-red-500 border border-red-200 rounded-full text-sm font-semibold hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAccept(payment.id)}
                            className="px-6 py-2 bg-[#6CC049] text-white rounded-full text-sm font-semibold hover:bg-[#5AA83A] transition-colors"
                          >
                            Accept
                          </button>
                        </div>
                      )}
                      {payment.status !== 'Pending' && (
                        <span className="text-sm text-gray-500">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderTransactionHistory = () => (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-black mb-6">Completed Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAFA]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                  Amount Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                  Net Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#9E9E9E] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                    {transaction.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                    ${transaction.amountReceived.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                    ${transaction.commission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                    ${transaction.netAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212121]">
                    {transaction.paymentDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                      <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPayoutInformation = () => (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-black mb-6">Payout Information</h2>
      <p className="text-gray-600">Payout information will be displayed here.</p>
    </div>
  );

  return (
    <DashboardLayout 
      pageTitle="Earnings"
      pageDescription="View and manage your earnings"
    >
      <div className="bg-[#FAFAFA] min-h-screen">
        <div className="p-6 lg:p-8">
          {/* Header */}
         

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex items-center gap-10">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-lg font-semibold font-urbanist pb-2 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'text-[#012168] border-[#012168]'
                    : 'text-[#BDBDBD] border-transparent'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('transaction-history')}
                className={`text-lg font-semibold font-urbanist pb-2 border-b-2 transition-colors ${
                  activeTab === 'transaction-history'
                    ? 'text-[#012168] border-[#012168]'
                    : 'text-[#BDBDBD] border-transparent'
                }`}
              >
                Transaction History
              </button>
              <button
                onClick={() => setActiveTab('payout-information')}
                className={`text-lg font-semibold font-urbanist pb-2 border-b-2 transition-colors ${
                  activeTab === 'payout-information'
                    ? 'text-[#012168] border-[#012168]'
                    : 'text-[#BDBDBD] border-transparent'
                }`}
              >
                Payout Information
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'transaction-history' && renderTransactionHistory()}
          {activeTab === 'payout-information' && renderPayoutInformation()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EarningsPage;