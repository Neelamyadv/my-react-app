import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Mail, Phone, X } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { logError, logInfo } from '../../lib/logger';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      // Get messages from backend API
      const response = await fetch('/api/admin/messages', {
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const sortedMessages = (result.data || []).sort((a: ContactMessage, b: ContactMessage) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setMessages(sortedMessages);
      } else {
        throw new Error('Failed to fetch messages from API');
      }
    } catch (error) {
      logError('Error loading messages', { error: error.message });
      toast.error('Failed to load messages');
      
      // Fallback to demo data
      const demoMessages: ContactMessage[] = [
        {
          id: 1,
          name: 'Demo User',
          email: 'demo@example.com',
          message: 'This is a demo message for testing purposes.',
          status: 'unread',
          created_at: new Date().toISOString()
        }
      ];
      setMessages(demoMessages);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    if (!searchTerm) {
      setFilteredMessages(messages);
      return;
    }

    const filtered = messages.filter(message =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.phone.includes(searchTerm) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMessages(filtered);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      try {
        const updatedMessages = messages.filter(m => m.id !== messageId);
        localStorage.setItem('zyntiq_contact_messages', JSON.stringify(updatedMessages));
        setMessages(updatedMessages);
        toast.success('Message deleted successfully');
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const MessageModal = () => {
    if (!selectedMessage) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--admin-card)] rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-[var(--admin-border)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-[var(--admin-text)]">Message Details</h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)] text-2xl transition-colors p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Name</label>
                <p className="text-[var(--admin-text)]">{selectedMessage.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Date</label>
                <p className="text-[var(--admin-text)]">
                  {new Date(selectedMessage.created_at).toLocaleDateString()} at{' '}
                  {new Date(selectedMessage.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Email</label>
              <p className="text-[var(--admin-text)] flex items-center">
                <Mail className="h-4 w-4 mr-2 text-[var(--admin-text-secondary)]" />
                <a href={`mailto:${selectedMessage.email}`} className="text-blue-400 hover:text-blue-300">
                  {selectedMessage.email}
                </a>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Phone</label>
              <p className="text-[var(--admin-text)] flex items-center">
                <Phone className="h-4 w-4 mr-2 text-[var(--admin-text-secondary)]" />
                <a href={`tel:${selectedMessage.phone}`} className="text-blue-400 hover:text-blue-300">
                  {selectedMessage.phone}
                </a>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Message</label>
              <div className="bg-[var(--admin-border)] bg-opacity-30 rounded-lg p-4">
                <p className="text-[var(--admin-text)] whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between mt-6 space-y-3 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Your inquiry&body=Dear ${selectedMessage.name},%0A%0AThank you for contacting us.%0A%0ABest regards,%0AZyntiq Team`}
                className="px-4 py-3 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                Reply via Email
              </a>
              
              <a
                href={`tel:${selectedMessage.phone}`}
                className="px-4 py-3 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </a>
            </div>
            
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-3 md:py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--admin-text)]">Contact Messages</h1>
          <p className="text-[var(--admin-text-secondary)]">View and respond to user inquiries</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="relative mb-4 md:mb-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--admin-text-secondary)]" />
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 border border-[var(--admin-border)] rounded-md leading-5 bg-[var(--admin-card)] placeholder-[var(--admin-text-secondary)] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm w-full md:w-64 text-[var(--admin-text)]"
          />
        </div>
        
        <div className="text-sm text-[var(--admin-text-secondary)]">
          {filteredMessages.length} of {messages.length} messages
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-[var(--admin-card)] shadow-sm overflow-hidden border border-[var(--admin-border)] sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--admin-border)]">
            <thead className="bg-[var(--admin-border)] bg-opacity-30">
              <tr>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Contact Info
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Message Preview
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--admin-card)] divide-y divide-[var(--admin-border)]">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-[var(--admin-border)] hover:bg-opacity-30">
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-[var(--admin-text)]">{message.name}</div>
                      <div className="text-sm text-[var(--admin-text-secondary)]">{message.email}</div>
                      <div className="text-sm text-[var(--admin-text-secondary)]">{message.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-sm text-[var(--admin-text)] max-w-xs truncate">
                      {message.message.length > 100 
                        ? `${message.message.substring(0, 100)}...` 
                        : message.message
                      }
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[var(--admin-text)]">
                    <div>{new Date(message.created_at).toLocaleDateString()}</div>
                    <div className="text-xs text-[var(--admin-text-secondary)]">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewMessage(message)}
                        className="text-blue-400 hover:text-blue-300 flex items-center p-1"
                        title="View Message"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <a
                        href={`mailto:${message.email}`}
                        className="text-green-400 hover:text-green-300 flex items-center p-1"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-red-400 hover:text-red-300 flex items-center p-1"
                        title="Delete Message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {messages.length === 0 
                ? 'No messages received yet.' 
                : 'No messages found matching your search.'
              }
            </p>
          </div>
        )}
      </div>

      {showModal && <MessageModal />}
    </div>
  );
};

export default ContactMessages;
