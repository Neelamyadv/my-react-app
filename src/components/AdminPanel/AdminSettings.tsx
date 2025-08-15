import React, { useState, useEffect } from 'react';
import { Save, DollarSign, BookOpen, Users, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { PRICING } from '../../lib/razorpay';
import toast from 'react-hot-toast';

interface PricingData {
  COURSE: {
    price: number;
    originalPrice: number;
    discount: number;
  };
  PREMIUM_PASS: {
    price: number;
    originalPrice: number;
    discount: number;
  };
  LIVE_TRAINING: {
    price: number;
    originalPrice: number;
    discount: number;
  };
  VAC: {
    price: number;
    originalPrice: number;
    discount: number;
  };
  EBOOK: {
    price: number;
    originalPrice: number;
    discount: number;
  };
  EBOOK_BUNDLE: {
    price: number;
    originalPrice: number;
    discount: number;
  };
}

const AdminSettings: React.FC = () => {
  const [pricing, setPricing] = useState<PricingData>(PRICING);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load pricing from localStorage on component mount
  useEffect(() => {
    const savedPricing = localStorage.getItem('zyntiq_pricing');
    if (savedPricing) {
      try {
        const parsedPricing = JSON.parse(savedPricing);
        setPricing(parsedPricing);
      } catch (error) {
        console.error('Error loading pricing:', error);
      }
    }
  }, []);

  const handlePricingChange = (type: keyof PricingData, field: 'price' | 'originalPrice', value: string) => {
    // Handle empty string and non-numeric input
    if (value === '' || value === '-') {
      const newPricing = {
        ...pricing,
        [type]: {
          ...pricing[type],
          [field]: 0
        }
      };
      setPricing(newPricing);
      setHasChanges(true);
      return;
    }

    // Convert string to number, handle invalid input
    const numValue = parseInt(value) || 0;
    
    // Ensure non-negative values
    const finalValue = Math.max(0, numValue);
    
    const newPricing = {
      ...pricing,
      [type]: {
        ...pricing[type],
        [field]: finalValue
      }
    };

    // Recalculate discount
    if (field === 'price' || field === 'originalPrice') {
      const newPrice = field === 'price' ? finalValue : newPricing[type].price;
      const newOriginalPrice = field === 'originalPrice' ? finalValue : newPricing[type].originalPrice;
      const newDiscount = newOriginalPrice > 0 ? Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100) : 0;
      
      newPricing[type] = {
        ...newPricing[type],
        discount: newDiscount
      };
    }

    setPricing(newPricing);
    setHasChanges(true);
  };

  const savePricing = async () => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('zyntiq_pricing', JSON.stringify(pricing));
      
      // Update the global PRICING object (for immediate use)
      Object.assign(PRICING, pricing);
      
      setHasChanges(false);
      toast.success('Pricing updated successfully!');
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Failed to save pricing');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all pricing to default values?')) {
      setPricing(PRICING);
      localStorage.removeItem('zyntiq_pricing');
      setHasChanges(false);
      toast.success('Pricing reset to defaults');
    }
  };

  const PricingCard = ({ 
    title, 
    type, 
    icon: Icon, 
    description 
  }: { 
    title: string; 
    type: keyof PricingData; 
    icon: any; 
    description: string; 
  }) => {
    const data = pricing[type];
    
    return (
      <div className="bg-[var(--admin-card)] rounded-lg shadow-sm p-6 border border-[var(--admin-border)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--admin-text)]">{title}</h3>
            <p className="text-sm text-[var(--admin-text-secondary)]">{description}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">
                Current Price (₹)
              </label>
              <input
                type="number"
                value={data.price}
                onChange={(e) => handlePricingChange(type, 'price', e.target.value)}
                onKeyDown={(e) => {
                  // Allow: backspace, delete, tab, escape, enter, and navigation keys
                  if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true)) {
                    return;
                  }
                  // Allow numbers and decimal point
                  if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 190) {
                    return;
                  }
                  e.preventDefault();
                }}
                className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={data.originalPrice}
                onChange={(e) => handlePricingChange(type, 'originalPrice', e.target.value)}
                onKeyDown={(e) => {
                  // Allow: backspace, delete, tab, escape, enter, and navigation keys
                  if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true)) {
                    return;
                  }
                  // Allow numbers and decimal point
                  if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 190) {
                    return;
                  }
                  e.preventDefault();
                }}
                className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1"
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm font-medium text-green-800">Discount</span>
            <span className="text-lg font-bold text-green-600">{data.discount}% OFF</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-[var(--admin-bg)] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--admin-text)]">Admin Settings</h1>
          <p className="text-[var(--admin-text-secondary)]">Manage your course pricing and system settings</p>
        </div>
        
        <div className="flex gap-3">
          {hasChanges && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">Unsaved changes</span>
            </div>
          )}
          
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Reset to Defaults
          </button>
          
          <button
            onClick={savePricing}
            disabled={loading || !hasChanges}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Course Pricing Management */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--admin-text)]">Course Pricing Management</h2>
            <p className="text-[var(--admin-text-secondary)]">Update your course prices and discounts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PricingCard
            title="Single Course"
            type="COURSE"
            icon={BookOpen}
            description="Price for individual courses (all courses have the same price)"
          />
          
          <PricingCard
            title="Premium Pass"
            type="PREMIUM_PASS"
            icon={Users}
            description="Bundle price for access to all courses"
          />
        </div>
      </div>

      {/* Other Pricing Options */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Other Pricing Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard
            title="Live Training"
            type="LIVE_TRAINING"
            icon={BookOpen}
            description="Live training program pricing"
          />
          
          <PricingCard
            title="VAC Certificate"
            type="VAC"
            icon={BookOpen}
            description="Value-added certificate program"
          />
          
          <PricingCard
            title="eBook Bundle"
            type="EBOOK_BUNDLE"
            icon={BookOpen}
            description="Complete eBook collection"
          />
        </div>
      </div>

      {/* General Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-[var(--admin-card)] rounded-lg shadow-sm p-6 border border-[var(--admin-border)]">
          <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">General Settings</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Site Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]" 
                placeholder="Zyntiq" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Logo URL</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]" 
                placeholder="https://..." 
              />
            </div>
            <button type="button" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Save General Settings
            </button>
          </form>
        </div>

        {/* Payment Settings */}
        <div className="bg-[var(--admin-card)] rounded-lg shadow-sm p-6 border border-[var(--admin-border)]">
          <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Payment Settings</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Payment Gateway Key</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]" 
                placeholder="rzp_test_..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Currency</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]" 
                placeholder="INR" 
              />
            </div>
            <button type="button" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Save Payment Settings
            </button>
          </form>
        </div>
      </div>

      {/* Success Message */}
      {!hasChanges && (
        <div className="mt-6 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">All changes saved successfully!</span>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;