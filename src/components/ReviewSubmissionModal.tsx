import { useState, useEffect } from 'react';
import { X, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ReviewSubmissionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewSubmissionModal({ onClose, onSuccess }: ReviewSubmissionModalProps) {
  const [step, setStep] = useState<'order' | 'product' | 'review'>('order');
  const [orderNumber, setOrderNumber] = useState('');
  const [validatingOrder, setValidatingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  async function validateOrderNumber() {
    if (!orderNumber.trim()) {
      setOrderError('Please enter an order number');
      return;
    }

    setValidatingOrder(true);
    setOrderError('');

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, order_items(product_id, product_name, products(id, name, slug))')
        .eq('order_number', orderNumber.trim())
        .maybeSingle();

      if (error) {
        setOrderError('An error occurred while checking your order. Please try again.');
        return;
      }

      if (!data) {
        setOrderError('No order with such Order # found');
        return;
      }

      if (data.status !== 'delivered') {
        setOrderError('This order has not been delivered yet. You can only review products after delivery.');
        return;
      }

      if (!data.order_items || data.order_items.length === 0) {
        setOrderError('No products found in this order.');
        return;
      }

      setOrderData(data);
      setStep('product');
    } catch (error) {
      console.error('Error validating order:', error);
      setOrderError('An error occurred while validating your order. Please try again.');
    } finally {
      setValidatingOrder(false);
    }
  }

  function handleProductSelect(productId: string, productName: string) {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setStep('review');
  }

  async function handleSubmitReview() {
    if (!reviewText.trim()) {
      alert('Please write a review');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: selectedProductId,
          order_id: orderData?.id || null,
          order_number: orderData?.order_number || orderNumber,
          user_id: null,
          rating,
          title: title.trim() || null,
          review_text: reviewText.trim(),
          is_verified_purchase: !!orderData,
          is_approved: true
        });

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        paddingTop: '80px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '672px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            borderBottom: '1px solid #e2e8f0',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#38322d', margin: 0 }}>
            Write a Review
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X style={{ width: '20px', height: '20px', color: '#766657' }} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {step === 'order' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                  <p style={{ fontSize: '14px', color: '#5c5145', margin: 0 }}>
                    To ensure review authenticity, please provide your order number
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#38322d', marginBottom: '8px' }}>
                  Order Number *
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., ORD-1234567890"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && validateOrderNumber()}
                />
                {orderError && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontSize: '14px' }}>
                    <AlertCircle style={{ width: '16px', height: '16px' }} />
                    <span>{orderError}</span>
                  </div>
                )}
              </div>

              <button
                onClick={validateOrderNumber}
                disabled={validatingOrder}
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #5c5145, #766657, #473f38)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: validatingOrder ? 'not-allowed' : 'pointer',
                  opacity: validatingOrder ? 0.5 : 1
                }}
              >
                {validatingOrder ? 'Validating...' : 'Continue'}
              </button>
            </div>
          )}

          {step === 'product' && orderData && (
            <div>
              <p style={{ fontSize: '14px', color: '#5c5145', marginBottom: '16px' }}>
                Select the product you want to review from your order:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {orderData.order_items.map((item: any) => (
                  <button
                    key={item.product_id}
                    onClick={() => handleProductSelect(item.product_id, item.product_name)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      textAlign: 'left',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#766657';
                      e.currentTarget.style.backgroundColor = '#f8f7f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <p style={{ fontWeight: 500, color: '#38322d', margin: 0 }}>{item.product_name}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep('order')}
                style={{
                  color: '#766657',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                ← Back to order number
              </button>
            </div>
          )}

          {step === 'review' && (
            <div>
              {selectedProductName && (
                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8f7f5', borderRadius: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#5c5145', marginBottom: '4px' }}>Reviewing:</p>
                  <p style={{ fontWeight: 600, color: '#38322d', margin: 0 }}>{selectedProductName}</p>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#38322d', marginBottom: '8px' }}>
                  Rating *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <Star
                        style={{
                          width: '40px',
                          height: '40px',
                          fill: star <= rating ? '#facc15' : 'none',
                          color: star <= rating ? '#facc15' : '#cbd5e1'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#38322d', marginBottom: '8px' }}>
                  Review Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sum up your experience"
                  maxLength={100}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#38322d', marginBottom: '8px' }}>
                  Your Review *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={6}
                  maxLength={1000}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    fontSize: '16px',
                    resize: 'none'
                  }}
                />
                <p style={{ fontSize: '14px', color: '#92806d', marginTop: '4px' }}>
                  {reviewText.length}/1000 characters
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(orderData ? 'product' : 'order')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid #cbd5e1',
                    borderRadius: '12px',
                    fontWeight: 600,
                    background: 'white',
                    cursor: 'pointer',
                    color: '#38322d'
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={submitting || !reviewText.trim()}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(to right, #5c5145, #766657, #473f38)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: (submitting || !reviewText.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (submitting || !reviewText.trim()) ? 0.5 : 1
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
