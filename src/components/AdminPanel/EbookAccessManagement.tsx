import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, UserCheck, UserX, BookOpen, Download, Eye, Lock, Unlock } from 'lucide-react';
import { useAuth } from '../../lib/auth';

interface EbookAccess {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  ebookId: string;
  ebookTitle: string;
  accessType: 'purchased' | 'manual' | 'premium';
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

interface EbookData {
  id: string;
  title: string;
  category: string;
  price: number;
}

// Mock eBook data
const ebookData: EbookData[] = [
  { id: 'web-development-ebook', title: 'Web Development Fundamentals', category: 'Programming', price: 299 },
  { id: 'python-ebook', title: 'Python Programming Mastery', category: 'Programming', price: 299 },
  { id: 'java-ebook', title: 'Java Development Complete', category: 'Programming', price: 299 },
  { id: 'ui-ux-ebook', title: 'UI/UX Design Principles', category: 'Design', price: 299 },
  { id: 'graphic-design-ebook', title: 'Graphic Design Mastery', category: 'Design', price: 299 },
  { id: 'digital-marketing-ebook', title: 'Digital Marketing Strategy', category: 'Business', price: 299 },
  { id: 'business-analytics-ebook', title: 'Business Analytics & Insights', category: 'Business', price: 299 },
  { id: 'mobile-development-ebook', title: 'Mobile App Development', category: 'Programming', price: 299 },
  { id: 'cybersecurity-ebook', title: 'Cybersecurity Fundamentals', category: 'Programming', price: 299 }
];

// Mock access data
const mockAccessData: EbookAccess[] = [
  {
    id: '1',
    userId: 'user1',
    userEmail: 'john@example.com',
    userName: 'John Doe',
    ebookId: 'web-development-ebook',
    ebookTitle: 'Web Development Fundamentals',
    accessType: 'purchased',
    grantedBy: 'system',
    grantedAt: '2024-01-15T10:30:00Z',
    isActive: true
  },
  {
    id: '2',
    userId: 'user2',
    userEmail: 'jane@example.com',
    userName: 'Jane Smith',
    ebookId: 'python-ebook',
    ebookTitle: 'Python Programming Mastery',
    accessType: 'manual',
    grantedBy: 'admin',
    grantedAt: '2024-01-20T14:15:00Z',
    expiresAt: '2024-12-31T23:59:59Z',
    isActive: true
  },
  {
    id: '3',
    userId: 'user3',
    userEmail: 'bob@example.com',
    userName: 'Bob Johnson',
    ebookId: 'ui-ux-ebook',
    ebookTitle: 'UI/UX Design Principles',
    accessType: 'premium',
    grantedBy: 'system',
    grantedAt: '2024-01-10T09:00:00Z',
    isActive: true
  }
];

const EbookAccessManagement = () => {
  const { user } = useAuth();
  const [accessData, setAccessData] = useState<EbookAccess[]>(mockAccessData);
  const [filteredData, setFilteredData] = useState<EbookAccess[]>(mockAccessData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'purchased' | 'manual' | 'premium'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedEbook, setSelectedEbook] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState<EbookAccess | null>(null);

  // Filter data based on search and filters
  const filterData = useCallback(() => {
    let filtered = accessData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(access =>
        access.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        access.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        access.ebookTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Access type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(access => access.accessType === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(access => 
        filterStatus === 'active' ? access.isActive : !access.isActive
      );
    }

    setFilteredData(filtered);
  }, [accessData, searchTerm, filterType, filterStatus]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const handleGrantAccess = () => {
    if (!selectedUser || !selectedEbook) {
      alert('Please select both user and eBook');
      return;
    }

    const ebook = ebookData.find(e => e.id === selectedEbook);
    if (!ebook) return;

    const newAccess: EbookAccess = {
      id: Date.now().toString(),
      userId: selectedUser,
      userEmail: 'user@example.com', // In real app, get from user data
      userName: 'User Name', // In real app, get from user data
      ebookId: selectedEbook,
      ebookTitle: ebook.title,
      accessType: 'manual',
      grantedBy: user?.email || 'admin',
      grantedAt: new Date().toISOString(),
      isActive: true
    };

    setAccessData(prev => [...prev, newAccess]);
    setShowGrantModal(false);
    setSelectedUser('');
    setSelectedEbook('');
  };

  const handleRevokeAccess = (accessId: string) => {
    setAccessData(prev => prev.map(access => 
      access.id === accessId ? { ...access, isActive: false } : access
    ));
  };

  const getAccessTypeColor = (type: string) => {
    switch (type) {
      case 'purchased': return 'bg-green-100 text-green-800';
      case 'manual': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessTypeIcon = (type: string) => {
    switch (type) {
      case 'purchased': return <Download className="w-4 h-4" />;
      case 'manual': return <UserCheck className="w-4 h-4" />;
      case 'premium': return <BookOpen className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">eBook Access Management</h2>
          <p className="text-gray-600">Manage user access to eBooks and learning materials</p>
        </div>
        <button
          onClick={() => setShowGrantModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          Grant Access
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Access</p>
              <p className="text-2xl font-bold text-gray-900">{accessData.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Access</p>
              <p className="text-2xl font-bold text-green-600">{accessData.filter(a => a.isActive).length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Purchased</p>
              <p className="text-2xl font-bold text-blue-600">{accessData.filter(a => a.accessType === 'purchased').length}</p>
            </div>
            <Download className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Manual Grants</p>
              <p className="text-2xl font-bold text-purple-600">{accessData.filter(a => a.accessType === 'manual').length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by user name, email, or eBook title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="purchased">Purchased</option>
              <option value="manual">Manual</option>
              <option value="premium">Premium</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Access Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  eBook
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Granted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((access) => (
                <tr key={access.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{access.userName}</div>
                      <div className="text-sm text-gray-500">{access.userEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{access.ebookTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessTypeColor(access.accessType)}`}>
                      {getAccessTypeIcon(access.accessType)}
                      <span className="ml-1 capitalize">{access.accessType}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {access.grantedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(access.grantedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      access.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {access.isActive ? (
                        <>
                          <Unlock className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {access.isActive ? (
                      <button
                        onClick={() => handleRevokeAccess(access.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setAccessData(prev => prev.map(a => 
                            a.id === access.id ? { ...a, isActive: true } : a
                          ));
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Access Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grant eBook Access</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email
                </label>
                <input
                  type="email"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  placeholder="Enter user email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  eBook
                </label>
                <select
                  value={selectedEbook}
                  onChange={(e) => setSelectedEbook(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an eBook</option>
                  {ebookData.map((ebook) => (
                    <option key={ebook.id} value={ebook.id}>
                      {ebook.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowGrantModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGrantAccess}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Grant Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbookAccessManagement;