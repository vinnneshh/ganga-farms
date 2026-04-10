import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  Edit2, 
  LogOut, 
  X, 
  FileText,
  Calendar,
  User,
  Phone,
  CreditCard,
  MapPin,
  Users,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Booking {
  id: number;
  bookingId: string;
  bookingDate: string;
  checkIn: string;
  checkOut: string;
  customerName: string;
  mobileNumber: string;
  aadharNumber: string;
  address: string;
  eventDate: string;
  pax: number;
  eventType: string;
  rentalAmount: number;
  amountReceived: number;
  paymentDate: string;
  paymentMethod: string;
  upiMethod?: string;
  otherPaymentSource?: string;
  balanceAmount: number;
  securityDeposit: number;
  totalDue: number;
}

const INITIAL_FORM = {
  bookingId: '',
  checkIn: '',
  checkOut: '',
  customerName: '',
  mobileNumber: '',
  aadharNumber: '',
  address: '',
  eventDate: '',
  pax: 0,
  eventType: '',
  rentalAmount: 0,
  amountReceived: 0,
  paymentDate: '',
  paymentMethod: 'UPI',
  upiMethod: 'PhonePe',
  otherPaymentSource: '',
};

const numberToWords = (num: number): string => {
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const numStr = num.toString();
  if (numStr.length > 9) return 'overflow';
  let n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ''; 
  let str = '';
  str += (Number(n[1]) != 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'crore ' : '';
  str += (Number(n[2]) != 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'lakh ' : '';
  str += (Number(n[3]) != 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'thousand ' : '';
  str += (Number(n[4]) != 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'hundred ' : '';
  str += (Number(n[5]) != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) + 'only ' : '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [previewBooking, setPreviewBooking] = useState<Booking | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (['rentalAmount', 'amountReceived'].includes(name)) {
        const rental = Number(updated.rentalAmount) || 0;
        const received = Number(updated.amountReceived) || 0;
        const balance = rental - received;
        return { ...updated, balanceAmount: balance, totalDue: balance + 10000 };
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingBooking ? `/api/bookings/${editingBooking.id}` : '/api/bookings';
    const method = editingBooking ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          ...formData,
          balanceAmount: Number(formData.rentalAmount) - Number(formData.amountReceived),
          totalDue: (Number(formData.rentalAmount) - Number(formData.amountReceived)) + 10000
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingBooking(null);
        setFormData(INITIAL_FORM);
        fetchBookings();
      }
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    console.log('Deleting booking with ID:', id);
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.ok) {
        setPreviewBooking(null);
        await fetchBookings();
        alert('Booking deleted successfully');
      } else {
        const errData = await res.json();
        alert(`Delete failed: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete booking. Check console for details.');
    }
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      const canvas = await html2canvas(invoiceRef.current, { 
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`Ganga-Farms-Invoice-${previewBooking?.bookingId || 'Booking'}.pdf`);
    } catch (err) {
      console.error('PDF Error:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.eventDate.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <FileText className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-serif font-bold">Ganga Farms</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl font-medium">
            <Calendar size={20} /> Dashboard
          </button>
        </nav>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Booking Management</h1>
            <p className="text-gray-500">Manage your farm bookings and invoices</p>
          </div>
          <button 
            onClick={() => {
              setEditingBooking(null);
              setFormData(INITIAL_FORM);
              setIsModalOpen(true);
            }}
            className="bg-accent text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg"
          >
            <Plus size={20} /> New Booking
          </button>
        </div>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, ID or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <span className="text-gray-500 font-medium">Total Bookings</span>
            <span className="text-2xl font-bold text-primary">{bookings.length}</span>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-600">Booking ID</th>
                <th className="px-6 py-4 font-bold text-gray-600">Customer</th>
                <th className="px-6 py-4 font-bold text-gray-600">Event Date</th>
                <th className="px-6 py-4 font-bold text-gray-600">Total Due</th>
                <th className="px-6 py-4 font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Loading bookings...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No bookings found</td></tr>
              ) : filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-accent">{b.bookingId}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary">{b.customerName}</div>
                    <div className="text-xs text-gray-400">{b.mobileNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{b.eventDate}</td>
                  <td className="px-6 py-4 font-bold text-primary">₹{b.totalDue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPreviewBooking(b)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Invoice"
                      >
                        <FileText size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingBooking(b);
                          setFormData({
                            bookingId: b.bookingId,
                            checkIn: b.checkIn,
                            checkOut: b.checkOut,
                            customerName: b.customerName,
                            mobileNumber: b.mobileNumber,
                            aadharNumber: b.aadharNumber,
                            address: b.address,
                            eventDate: b.eventDate,
                            pax: b.pax,
                            eventType: b.eventType,
                            rentalAmount: b.rentalAmount,
                            amountReceived: b.amountReceived,
                            paymentDate: b.paymentDate,
                            paymentMethod: b.paymentMethod,
                            upiMethod: b.upiMethod || 'PhonePe',
                            otherPaymentSource: b.otherPaymentSource || '',
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-serif font-bold text-primary">
                  {editingBooking ? 'Edit Booking' : 'Create New Booking'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-primary">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Booking ID Header */}
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">Booking ID (Manual)</label>
                  <input 
                    type="text" 
                    name="bookingId" 
                    placeholder="Enter Booking ID (e.g. GF-123456)" 
                    value={formData.bookingId} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none font-mono" 
                  />
                </div>

                {/* Customer Info */}
                <div className="space-y-6">
                  <h3 className="font-bold text-accent uppercase tracking-widest text-xs">Customer Information</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" name="customerName" placeholder="Customer Name" required value={formData.customerName} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" name="mobileNumber" placeholder="Mobile Number" required value={formData.mobileNumber} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                    </div>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" name="aadharNumber" placeholder="Aadhar Number" required value={formData.aadharNumber} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                      <textarea name="address" placeholder="Address" required value={formData.address} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none min-h-[100px]" />
                    </div>
                  </div>
                </div>

                {/* Event Info */}
                <div className="space-y-6">
                  <h3 className="font-bold text-accent uppercase tracking-widest text-xs">Event Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Check-In</label>
                        <input type="datetime-local" name="checkIn" required value={formData.checkIn} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Check-Out</label>
                        <input type="datetime-local" name="checkOut" required value={formData.checkOut} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Event Date</label>
                        <input type="date" name="eventDate" required value={formData.eventDate} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                      </div>
                      <div className="relative">
                        <label className="text-xs text-gray-400 block mb-1">PAX</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input type="number" name="pax" placeholder="Guests" required value={formData.pax} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                        </div>
                      </div>
                    </div>
                    <input type="text" name="eventType" placeholder="Event Type (e.g. Wedding, Birthday)" required value={formData.eventType} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                  </div>
                </div>

                {/* Payment Info */}
                <div className="md:col-span-2 space-y-6 pt-4 border-t">
                  <h3 className="font-bold text-accent uppercase tracking-widest text-xs">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Rental Amount</label>
                      <input type="number" name="rentalAmount" required value={formData.rentalAmount} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Amount Received</label>
                      <input type="number" name="amountReceived" required value={formData.amountReceived} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Payment Method</label>
                      <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none">
                        <option value="UPI">UPI</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>

                  {formData.paymentMethod === 'UPI' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">UPI Source</label>
                        <select name="upiMethod" value={formData.upiMethod} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none">
                          <option value="PhonePe">PhonePe</option>
                          <option value="GooglePay">GooglePay</option>
                          <option value="Paytm">Paytm</option>
                          <option value="Other Source">Other Source</option>
                        </select>
                      </div>
                      {formData.upiMethod === 'Other Source' && (
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Specify Other Source</label>
                          <input 
                            type="text" 
                            name="otherPaymentSource" 
                            placeholder="Enter payment source" 
                            value={formData.otherPaymentSource} 
                            onChange={handleInputChange} 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent outline-none" 
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl mt-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 uppercase">Balance</div>
                      <div className="text-xl font-bold text-primary">₹{(Number(formData.rentalAmount) - Number(formData.amountReceived)).toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 uppercase">Security Deposit</div>
                      <div className="text-xl font-bold text-accent">₹10,000</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 uppercase">Total Due</div>
                      <div className="text-2xl font-bold text-primary">₹{((Number(formData.rentalAmount) - Number(formData.amountReceived)) + 10000).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6">
                  <button type="submit" className="w-full bg-primary text-secondary py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-opacity-90 transition-all">
                    {editingBooking ? 'Update Booking' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {previewBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewBooking(null)}
              className="fixed inset-0 bg-primary/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl my-auto"
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                <h2 className="text-2xl font-serif font-bold text-primary">Invoice Preview</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleDelete(previewBooking.id)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                  <button onClick={downloadPDF} className="bg-accent text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                    <Download size={18} /> Download PDF
                  </button>
                  <button onClick={() => setPreviewBooking(null)} className="text-gray-400 hover:text-primary">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-10 bg-white" ref={invoiceRef} style={{ backgroundColor: 'white' }}>
                {/* Invoice Content */}
                <div className="border-4 border-primary p-8 bg-white" style={{ backgroundColor: 'white' }}>
                  <div className="flex flex-col items-center mb-10">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1KHT7XowBlOhagsct544606g0g-D01gcr" 
                      alt="Ganga Farms Logo" 
                      className="h-32 w-auto mb-4 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <h1 className="text-4xl font-serif font-bold text-primary mb-2">GANGA FARMS BOOKING CONFIRMATION</h1>
                    <div className="text-sm font-bold text-accent mb-2">BOOKING ID: {previewBooking.bookingId}</div>
                    <div className="w-24 h-1 bg-accent mx-auto"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-10 mb-10">
                    <div className="space-y-4">
                      <div>
                        <span className="text-accent font-bold">BOOKING DATE:</span> {previewBooking.bookingDate}
                      </div>
                      <div>
                        <span className="text-accent font-bold">BOOKING ID:</span> {previewBooking.bookingId}
                      </div>
                      <div className="pt-4">
                        <div className="flex items-center gap-2 font-bold text-primary mb-1">
                          <CheckCircle2 size={16} className="text-accent" /> CHECK - IN
                        </div>
                        <div className="pl-6">{new Date(previewBooking.checkIn).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-bold text-primary">Customer Name:</span> {previewBooking.customerName}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="pt-12">
                        <div className="flex items-center gap-2 font-bold text-primary mb-1">
                          <CheckCircle2 size={16} className="text-accent" /> CHECK - OUT
                        </div>
                        <div className="pl-6">{new Date(previewBooking.checkOut).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-bold text-primary">Mobile Number:</span> {previewBooking.mobileNumber}
                      </div>
                      <div>
                        <span className="font-bold text-primary">AADHAR NO:</span> {previewBooking.aadharNumber}
                      </div>
                      <div>
                        <span className="font-bold text-primary">ADDRESS:</span> {previewBooking.address}
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="bg-primary text-white px-4 py-2 font-bold mb-4">EVENT / STAY DETAILS</h3>
                    <div className="grid grid-cols-3 gap-4 pl-4">
                      <div><span className="font-bold">DATE:</span> {previewBooking.eventDate}</div>
                      <div><span className="font-bold">PAX:</span> {previewBooking.pax}</div>
                      <div><span className="font-bold">EVENT:</span> {previewBooking.eventType}</div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="bg-primary text-white px-4 py-2 font-bold mb-4">PAYMENT DETAILS</h3>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between border-b py-2">
                        <span className="font-bold">RENTAL AMOUNT</span>
                        <span>₹{previewBooking.rentalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b py-2">
                        <span className="font-bold">AMOUNT RECEIVED ({previewBooking.paymentMethod}{previewBooking.paymentMethod === 'UPI' ? ` - ${previewBooking.upiMethod === 'Other Source' ? previewBooking.otherPaymentSource : previewBooking.upiMethod}` : ''})</span>
                        <span>₹{previewBooking.amountReceived.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b py-2">
                        <span className="font-bold">BALANCE</span>
                        <span>₹{previewBooking.balanceAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b py-2">
                        <span className="font-bold">SECURITY DEPOSIT (REFUNDABLE)</span>
                        <span>₹10,000</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 p-4 mt-4">
                        <span className="text-xl font-bold text-primary">TOTAL DUE</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">₹{previewBooking.totalDue.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 italic">({numberToWords(previewBooking.totalDue)})</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strict Paragraphs */}
                  <div className="space-y-6 text-[10px] leading-relaxed text-gray-700">
                    <div>
                      <h4 className="font-bold text-primary border-b mb-1">Terms & Conditions</h4>
                      <p>
                        (The following are strictly prohibited within the farmhouse premises.
                        1.Foreign/Imported liquor 2.Hookah /Hukka 3.Drugs 4. Any other illegal activities.
                        ✧
                        Single Day Liquor License is must in case liquor is served as per the Telangana Govt approved
                        norms( no liquor will be allowed without obtaining the permission).
                        ✧ For Security purposes, all guests must share aadhar card and Id card before check in.
                        ✧
                        Security Deposit is payable at the villa at the time of Check-in which is 100% refundable , if no
                        damage made. Any damage to the property will be deducted in the security deposit.
                        ✧ Extra checkout time 1000/- per hour for day stays, and 3000/ hour for events.
                        ✧ An additional charge of ₹1000 applies for a campfire if required.
                        ✧
                        In case of power loss we only have generator backup for Villa lights and fans .If the power loss is
                        for more than 2 hrs, extra amount for diesel have to be borne by the guests)
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-primary border-b mb-1">Rules of the House</h4>
                      <p>
                        (Decor & Lighting Organisers shall contact the maintenance manager for the timing.
                        ✧
                        No DJ And No Loud Music after 11pm. No outside guests allowed without prior information. Police
                        Permission for DJ shall be obtained by the Guest.
                        ✧
                        Haldi , Mahndi etc, Colour are strictly not allowed in the swimming pool otherwise 25k Penalty if
                        any pool is damaged due to haldi.
                        ✧
                        Portable generators during events for exterior power for lawns,decocrations,stage ,etc should be
                        arranged by the guests only.
                        ✧
                        In case any illegal activities the guest will be asked to checkout immediately and the amount will
                        not be refunded.
                        ✧ Management is not responsible for any stolen or lost items.
                        ✧ Tip the caretaker for cleaning while checkout.
                        Your cooperation in adhering to these rules is greatly appreciated)
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-primary border-b mb-1">Booking Policy</h4>
                      <p>
                        (Once the payment is processed, please share the screenshot with Booking Manager and we will block
                        the villa for your dates.
                        ✧
                        Token will only soft block the villa for some hours, please pay 50% or the amount advised to book
                        the villa.
                        ✧
                        Once the token is received, the balance 50% payments or the amount discussed as advance has to come
                        in within 24 hours, as the blocking of the property needs 50% advance.
                        ✧
                        Availability can be dynamic so please process and share the payment screenshots ASAP . After that
                        the dates will be blocked)
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-primary border-b mb-1">Cancellation Policy</h4>
                      <p>
                        (In case of cancellation made during the below mentioned period before the Check in by Guests, the
                        following amount shall be deducted from the total Booking Amount.
                        ✧
                        The Advance amount is non refundable in case of rains/cancellation or any other reason-the
                        management is not responsible.
                        ✧
                        Cancellation more than 60 days prior to the check in date- 100% refund of the original booking
                        amount to the Customer.
                        ✧ Cancellation between 30-60 days prior to the check in date - 75% refund.
                        ✧ Cancellation between 15-30 days prior to the check in date - 50% refund.
                        ✧ Cancellation within 15 days of the check in date – No refund to the customer.)
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-between items-end">
                    <div className="text-center border-t border-gray-300 pt-2 w-48">
                      <p className="text-xs font-bold">Guest Signature</p>
                    </div>
                    <div className="text-center border-t border-gray-300 pt-2 w-48">
                      <p className="text-xs font-bold">Authorized Signatory</p>
                      <p className="text-[10px] text-gray-500">Ganga Farms</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
