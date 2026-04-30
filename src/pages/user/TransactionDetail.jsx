import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { mockTransactions } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  IoArrowBack, 
  IoTrendingUp, 
  IoTrendingDown, 
  IoSwapHorizontal,
  IoCalendar,
  IoTime,
  IoCard,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoTimeOutline,
  IoDownload,
  IoPerson,
  IoBusinessOutline,
  IoDocumentText
} from 'react-icons/io5';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the transaction by ID
  const transaction = mockTransactions.find(t => t.id === id);

  // Generate reference number
  const referenceNumber = `TXN${transaction?.id.toUpperCase().replace('_', '')}${Date.now().toString().slice(-6)}`;

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Header - Blue background with gradient effect
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Decorative circles for logo effect
    doc.setFillColor(37, 99, 235); // Darker blue
    doc.circle(15, 15, 8, 'F');
    doc.setFillColor(96, 165, 250); // Lighter blue
    doc.circle(20, 18, 5, 'F');
    
    // Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('TASKORA', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const receiptTitle = getTransactionTitle(transaction.type);
    doc.text(receiptTitle, pageWidth / 2, 28, { align: 'center' });
    
    // Status Badge
    const statusColor = transaction.status === 'completed' ? [34, 197, 94] : 
                       transaction.status === 'pending' ? [245, 158, 11] : [239, 68, 68];
    doc.setFillColor(...statusColor);
    doc.roundedRect(pageWidth / 2 - 30, 32, 60, 9, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(getStatusText(transaction.status, transaction.type).toUpperCase(), pageWidth / 2, 38, { align: 'center' });
    
    // Amount Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    const amountColor = transaction.amount > 0 ? [34, 197, 94] : [239, 68, 68];
    doc.setTextColor(...amountColor);
    const amountText = `${transaction.amount > 0 ? '+' : ''}${formatCurrency(transaction.amount)}`;
    doc.text(amountText, pageWidth / 2, 65, { align: 'center' });
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const amountLabel = transaction.type === 'withdrawal' ? 'WITHDRAWAL AMOUNT' : 
                       transaction.type === 'deposit' ? 'DEPOSIT AMOUNT' : 'CREDIT AMOUNT';
    doc.text(amountLabel, pageWidth / 2, 75, { align: 'center' });
    
    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 85, pageWidth - 20, 85);
    
    // Transaction Details
    let yPos = 100;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    const detailsTitle = transaction.type === 'withdrawal' ? 'Withdrawal Details' : 
                        transaction.type === 'deposit' ? 'Deposit Details' : 'Credit Details';
    doc.text(detailsTitle, 20, yPos);
    
    yPos += 12;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const dateLabel = transaction.type === 'withdrawal' ? 'Withdrawal Date' : 
                     transaction.type === 'deposit' ? 'Deposit Date' : 'Credit Date';
    
    const details = [
      ['Reference Number', referenceNumber],
      ['Transaction ID', transaction.id],
      ['Description', transaction.description],
      ['Status', getStatusText(transaction.status, transaction.type)],
      [dateLabel, formatDate(transaction.createdAt, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })],
      ...(transaction.completedAt ? [['Completed Date', formatDate(transaction.completedAt, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })]] : [])
    ];
    
    details.forEach(([label, value]) => {
      doc.setTextColor(107, 114, 128);
      doc.text(label, 20, yPos);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(value, 20, yPos + 5);
      doc.setFont('helvetica', 'normal');
      yPos += 15;
    });
    
    // Receiver Information (only for withdrawals)
    if (transaction.type === 'withdrawal') {
      yPos += 5;
      doc.setDrawColor(229, 231, 235);
      doc.line(20, yPos, pageWidth - 20, yPos);
      
      yPos += 15;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Receiver Information', 20, yPos);
      
      yPos += 12;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      const receiverInfo = [
        ['Account Holder Name', transaction.metadata?.accountName || 'Abubakar Ibrahim'],
        ['Bank Name', transaction.metadata?.bankName || 'First Bank of Nigeria'],
        ['Account Number', transaction.metadata?.accountNumber || '1234567890'],
        ...(transaction.metadata?.withdrawalMethod ? [['Payment Method', transaction.metadata.withdrawalMethod]] : [])
      ];
      
      receiverInfo.forEach(([label, value]) => {
        doc.setTextColor(107, 114, 128);
        doc.text(label, 20, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(value, 20, yPos + 5);
        doc.setFont('helvetica', 'normal');
        yPos += 15;
      });
    }
    
    // Footer
    const footerY = pageHeight - 30;
    doc.setFillColor(243, 244, 246);
    doc.rect(0, footerY, pageWidth, 30, 'F');
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.text('Thank you for using Taskora!', pageWidth / 2, footerY + 10, { align: 'center' });
    doc.setFontSize(8);
    doc.text('For support: support@taskora.com', pageWidth / 2, footerY + 18, { align: 'center' });
    
    // Save PDF
    doc.save(`Taskora_Receipt_${referenceNumber}.pdf`);
  };

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-4 text-center">
          <IoAlertCircle size={40} className="mx-auto text-red-500 mb-3" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">
            Transaction Not Found
          </h2>
          <p className="text-gray-600 dark:text-zinc-400 mb-6">
            The transaction you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/transactions')}>
            Back to Transactions
          </Button>
        </Card>
      </div>
    );
  }

  // Get transaction-specific labels
  const getStatusText = (status, type) => {
    if (status === 'completed') {
      if (type === 'withdrawal') return 'Payment Successful';
      if (type === 'earning') return 'Credit Successful';
      if (type === 'deposit') return 'Deposit Successful';
      return 'Completed';
    }
    if (status === 'pending') return 'Pending';
    if (status === 'failed') return 'Failed';
    return status;
  };

  const getTransactionTitle = (type) => {
    if (type === 'withdrawal') return 'Withdrawal Receipt';
    if (type === 'earning') return 'Credit Receipt';
    if (type === 'deposit') return 'Deposit Receipt';
    return 'Transaction Receipt';
  };

  const getTransactionIcon = (type) => {
    const icons = {
      earning: <IoTrendingUp size={20} />,
      withdrawal: <IoTrendingDown size={20} />,
      refund: <IoSwapHorizontal size={20} />,
    };
    return icons[type] || <IoSwapHorizontal size={20} />;
  };

  const getTransactionColor = (type) => {
    const colors = {
      earning: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
      withdrawal: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
      refund: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
    };
    return colors[type] || 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: <IoCheckmarkCircle size={20} />,
      pending: <IoTimeOutline size={20} />,
      failed: <IoAlertCircle size={20} />,
    };
    return icons[status] || <IoTimeOutline size={20} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/transactions')}
            className="flex items-center gap-2"
          >
            <IoArrowBack size={18} />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h1 className="text-sm font-bold text-gray-900 dark:text-white">
            {getTransactionTitle(transaction.type)}
          </h1>
        </div>
      </div>

      {/* Transaction Amount Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 sm:p-6 text-center">
          <p className="text-xs text-gray-600 dark:text-zinc-400 mb-1.5">
            {transaction.type === 'withdrawal' ? 'Withdrawal Amount' : transaction.type === 'deposit' ? 'Deposit Amount' : 'Credit Amount'}
          </p>
          <p className={`text-lg sm:text-xl font-bold mb-3 ${
            transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
          </p>
          <Badge
            variant={
              transaction.status === 'completed' ? 'success' : 
              transaction.status === 'pending' ? 'warning' : 
              'danger'
            }
            className="inline-flex items-center gap-1.5"
          >
            {getStatusIcon(transaction.status)}
            {getStatusText(transaction.status, transaction.type)}
          </Badge>
        </Card>
      </motion.div>

      {/* Transaction Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {transaction.type === 'withdrawal' ? 'Withdrawal Details' : transaction.type === 'deposit' ? 'Deposit Details' : 'Credit Details'}
          </h2>
          <div className="space-y-4">
            {/* Transaction ID */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IoCard size={20} className="text-gray-600 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">Transaction ID</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.id}</p>
                </div>
              </div>
            </div>

            {/* Reference Number */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IoDocumentText size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">Reference Number</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{referenceNumber}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Description</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">
                  {transaction.type === 'withdrawal' ? 'Withdrawal Amount' : transaction.type === 'deposit' ? 'Deposit Amount' : 'Credit Amount'}
                </p>
                <p className={`text-base font-bold ${
                  transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Status</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getStatusText(transaction.status, transaction.type)}
                </p>
              </div>
            </div>

            {/* Date Created */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IoCalendar size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">
                    {transaction.type === 'withdrawal' ? 'Withdrawal Date' : transaction.type === 'deposit' ? 'Deposit Date' : 'Credit Date'}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(transaction.createdAt, { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Date Completed (if applicable) */}
            {transaction.completedAt && (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoTime size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">Completed Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(transaction.completedAt, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Receiver Information - Only for Withdrawals */}
      {transaction.type === 'withdrawal' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <IoBusinessOutline size={20} className="text-gray-600 dark:text-zinc-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Receiver Information
              </h2>
            </div>
            <div className="space-y-3 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-zinc-400">Account Holder Name</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.metadata?.accountName || 'Abubakar Ibrahim'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-zinc-400">Bank Name</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.metadata?.bankName || 'First Bank of Nigeria'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-zinc-400">Account Number</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.metadata?.accountNumber || '1234567890'}
                </span>
              </div>
              {transaction.metadata?.withdrawalMethod && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Payment Method</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {transaction.metadata.withdrawalMethod}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button
          onClick={handleDownloadReceipt}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <IoDownload size={18} />
          Download Receipt
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/transactions')}
          className="flex-1"
        >
          View All Transactions
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default TransactionDetail;
