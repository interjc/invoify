import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Types
import { InvoiceType } from '@/types';

// Helpers
import { formatNumberWithCommas, isDataUrl } from '@/lib/helpers';

// Variables
import { DATE_OPTIONS } from '@/lib/variables';

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 140,
    height: 100,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 600,
    color: '#2563eb',
    marginTop: 8,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#1f2937',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  address: {
    fontSize: 12,
    color: '#1f2937',
    textAlign: 'right',
    marginTop: 16,
    lineHeight: 1.4,
  },
  billToSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 20,
  },
  billToTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 4,
  },
  billToName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 8,
  },
  billToAddress: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  dateSection: {
    alignItems: 'flex-end',
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 8,
    width: 200,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1f2937',
    width: 100,
  },
  dateValue: {
    fontSize: 12,
    color: '#6b7280',
    width: 100,
  },
  table: {
    marginTop: 12,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
  },
  tableCell: {
    fontSize: 12,
    color: '#1f2937',
  },
  itemName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1f2937',
  },
  itemDescription: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  col1: { width: '40%' },
  col2: { width: '15%' },
  col3: { width: '20%' },
  col4: { width: '25%', textAlign: 'right' },
  totalsSection: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 8,
    width: 200,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1f2937',
    width: 120,
  },
  totalValue: {
    fontSize: 12,
    color: '#6b7280',
    width: 80,
    textAlign: 'right',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  notesSection: {
    marginTop: 24,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#2563eb',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: '#1f2937',
    marginBottom: 16,
  },
  paymentSection: {
    marginTop: 16,
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 4,
  },
  paymentText: {
    fontSize: 10,
    color: '#1f2937',
    lineHeight: 1.4,
  },
  contactSection: {
    marginTop: 20,
  },
  contactText: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 10,
    fontWeight: 600,
    color: '#1f2937',
  },
  signatureSection: {
    marginTop: 24,
  },
  signatureTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: 8,
  },
  signatureImage: {
    width: 120,
    height: 60,
  },
  signatureText: {
    fontSize: 20,
    color: '#000',
  },
});

const ReactPDFInvoiceTemplate1 = (data: InvoiceType) => {
  const { sender, receiver, details } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {details.invoiceLogo && (
              <Image style={styles.logo} src={details.invoiceLogo} />
            )}
            <Text style={styles.companyName}>{sender.name}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>Invoice #</Text>
            <Text style={styles.invoiceNumber}>{details.invoiceNumber}</Text>
            <Text style={styles.address}>
              {sender.address}{'\n'}
              {sender.zipCode}, {sender.city}{'\n'}
              {sender.country}
            </Text>
          </View>
        </View>

        {/* Bill To Section */}
        <View style={styles.billToSection}>
          <View>
            <Text style={styles.billToTitle}>Bill to:</Text>
            <Text style={styles.billToName}>{receiver.name}</Text>
            <Text style={styles.billToAddress}>
              {receiver.address && receiver.address.length > 0 ? receiver.address : ''}
              {receiver.zipCode && receiver.zipCode.length > 0 ? `, ${receiver.zipCode}` : ''}{'\n'}
              {receiver.city}, {receiver.country}
            </Text>
          </View>
          <View style={styles.dateSection}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Invoice date:</Text>
              <Text style={styles.dateValue}>
                {new Date(details.invoiceDate).toLocaleDateString("en-US", DATE_OPTIONS)}
              </Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Due date:</Text>
              <Text style={styles.dateValue}>
                {new Date(details.dueDate).toLocaleDateString("en-US", DATE_OPTIONS)}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>Item</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Amount</Text>
          </View>
          {details.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.col1}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}
              </View>
              <Text style={[styles.tableCell, styles.col2]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.col3]}>
                {item.unitPrice} {details.currency}
              </Text>
              <Text style={[styles.tableCell, styles.col4]}>
                {item.total} {details.currency}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatNumberWithCommas(Number(details.subTotal))} {details.currency}
            </Text>
          </View>
          
          {details.discountDetails?.amount != undefined && details.discountDetails?.amount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalValue}>
                {details.discountDetails.amountType === "amount"
                  ? `- ${details.discountDetails.amount} ${details.currency}`
                  : `- ${details.discountDetails.amount}%`}
              </Text>
            </View>
          )}
          
          {details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax:</Text>
              <Text style={styles.totalValue}>
                {details.taxDetails.amountType === "amount"
                  ? `+ ${details.taxDetails.amount} ${details.currency}`
                  : `+ ${details.taxDetails.amount}%`}
              </Text>
            </View>
          )}
          
          {details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping:</Text>
              <Text style={styles.totalValue}>
                {details.shippingDetails.costType === "amount"
                  ? `+ ${details.shippingDetails.cost} ${details.currency}`
                  : `+ ${details.shippingDetails.cost}%`}
              </Text>
            </View>
          )}
          
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              {formatNumberWithCommas(Number(details.totalAmount))} {details.currency}
            </Text>
          </View>
          
          {details.totalAmountInWords && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total in words:</Text>
              <Text style={styles.totalValue}>
                {details.totalAmountInWords} {details.currency}
              </Text>
            </View>
          )}
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          {details.additionalNotes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Additional notes:</Text>
              <Text style={styles.notesText}>{details.additionalNotes}</Text>
            </View>
          )}
          
          {details.paymentTerms && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Payment terms:</Text>
              <Text style={styles.notesText}>{details.paymentTerms}</Text>
            </View>
          )}
          
          {details.paymentInformation && (
            <View style={styles.paymentSection}>
              <Text style={styles.paymentTitle}>Please send the payment to this address:</Text>
              <Text style={styles.paymentText}>
                Bank: {details.paymentInformation.bankName}{'\n'}
                Account name: {details.paymentInformation.accountName}{'\n'}
                Account no: {details.paymentInformation.accountNumber}
              </Text>
            </View>
          )}
        </View>

        {/* Contact */}
        <View style={styles.contactSection}>
          <Text style={styles.contactText}>
            If you have any questions concerning this invoice, use the following contact information:
          </Text>
          <Text style={styles.contactInfo}>{sender.email}</Text>
          <Text style={styles.contactInfo}>{sender.phone}</Text>
        </View>

        {/* Signature */}
        {details?.signature?.data && (
          <View style={styles.signatureSection}>
            <Text style={styles.signatureTitle}>Signature:</Text>
            {isDataUrl(details.signature.data) ? (
              <Image style={styles.signatureImage} src={details.signature.data} />
            ) : (
              <Text style={styles.signatureText}>{details.signature.data}</Text>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ReactPDFInvoiceTemplate1;