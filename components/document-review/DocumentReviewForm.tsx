import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { createPaymentIntent, createPaymentSource } from '@/lib/paymongo';

// Form validation schema
const documentReviewSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required').optional(),
  documentType: z.enum(['Business Agreement', 'Lease', 'Employment Contract', 'Other'], {
    errorMap: () => ({ message: 'Please select a document type' }),
  }),
  additionalDetails: z.string().optional(),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the data privacy policy' }),
  }),
});

type DocumentReviewFormData = z.infer<typeof documentReviewSchema>;

const DocumentReviewForm = () => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'gcash' | 'grab_pay'>('card');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<DocumentReviewFormData>({
    resolver: zodResolver(documentReviewSchema),
    defaultValues: {
      name: currentUser?.displayName || '',
      email: currentUser?.email || '',
      // No default value for privacyConsent
    },
  });

  const privacyConsent = watch('privacyConsent');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size <= 10 * 1024 * 1024) { // 10MB limit
        setFile(selectedFile);
      } else {
        alert('File size exceeds 10MB limit');
      }
    }
  };

  const uploadFile = async () => {
    if (!file) return null;
    
    const fileId = uuidv4();
    const fileRef = ref(storage, `document-review/${currentUser?.uid}/${fileId}-${file.name}`);
    
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    
    return {
      name: file.name,
      url: downloadUrl,
      type: file.type,
      size: file.size,
    };
  };

  const initiateCardPayment = async () => {
    try {
      setIsSubmitting(true);
      
      // Create a payment intent for card payments
      const paymentIntent = await createPaymentIntent({
        amount: 500, // PHP 500
        currency: 'PHP',
        description: 'Document Review Service',
        returnUrl: `${window.location.origin}/payment-callback`,
        metadata: {
          documentType: watch('documentType'),
          userEmail: watch('email'),
          userId: currentUser?.uid || 'guest',
        },
      });
      
      // In a real implementation, you would use the returned client_key 
      // to initialize the Paymongo JS SDK for card payment collection
      // For now, we'll simulate a successful payment
      
      setTimeout(() => {
        processSubmission(paymentIntent.id);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const initiateEWalletPayment = async (type: 'gcash' | 'grab_pay') => {
    try {
      setIsSubmitting(true);
      
      // Create a payment source for e-wallet payments
      const source = await createPaymentSource(
        500, // PHP 500
        type,
        `${window.location.origin}/payment-success`,
        `${window.location.origin}/payment-failure`
      );
      
      // For e-wallets, redirect to the checkout URL
      if (source && source.attributes && source.attributes.redirect && source.attributes.redirect.checkout_url) {
        // Save source ID to Firebase for reference
        await addDoc(collection(db, 'payment-sources'), {
          sourceId: source.id,
          userId: currentUser?.uid || 'guest',
          documentType: watch('documentType'),
          createdAt: serverTimestamp(),
        });
        
        // Redirect to checkout page
        window.location.href = source.attributes.redirect.checkout_url;
      } else {
        throw new Error('Invalid payment source response');
      }
    } catch (error) {
      console.error('E-wallet payment error:', error);
      alert('Payment processing failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const initiatePayment = async () => {
    if (selectedPaymentMethod === 'card') {
      await initiateCardPayment();
    } else {
      await initiateEWalletPayment(selectedPaymentMethod);
    }
  };

  const processSubmission = async (paymentId: string) => {
    try {
      // Upload file if any
      const documentUrl = file ? await uploadFile() : null;
      
      if (!documentUrl) {
        alert('Please upload a document for review');
        setIsSubmitting(false);
        return;
      }
      
      // Get form data
      const formData = watch();
      
      // Save document review request to Firestore
      await addDoc(collection(db, 'document-reviews'), {
        userId: currentUser?.uid || 'guest',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        documentType: formData.documentType,
        additionalDetails: formData.additionalDetails || '',
        document: documentUrl,
        status: 'pending',
        paid: true,
        paymentId,
        paymentAmount: 500,
        paymentMethod: selectedPaymentMethod,
        createdAt: serverTimestamp(),
      });
      
      setSubmissionSuccess(true);
      setShowPaymentModal(false);
      setCurrentStep(5); // Move to confirmation step
    } catch (error) {
      console.error('Error submitting document review:', error);
      alert('An error occurred while submitting your document review request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: DocumentReviewFormData) => {
    if (currentStep === 4) {
      if (!file) {
        alert('Please upload a document for review');
        return;
      }
      
      // Show payment modal
      setShowPaymentModal(true);
    } else {
      nextStep();
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !privacyConsent) {
      return; // Don't proceed if privacy consent is not given
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Document & Contract Review</h2>
      
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-300'
              }`}>
                {step}
              </div>
              <span className="text-xs mt-2 text-gray-500">
                {step === 1 && 'Privacy'}
                {step === 2 && 'Details'}
                {step === 3 && 'Document'}
                {step === 4 && 'Review'}
                {step === 5 && 'Confirmation'}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="h-1 w-full bg-gray-200 rounded"></div>
          </div>
          <div className="relative flex justify-between">
            <div className={`h-1 bg-blue-600 rounded`} style={{ width: `${(currentStep - 1) * 25}%` }}></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Data Privacy Consent */}
        {currentStep === 1 && (
          <div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4 h-64 overflow-y-auto">
              <h3 className="font-semibold mb-2">Data Privacy Policy</h3>
              <p className="text-sm text-gray-600">
                By proceeding with MCS LAW's document review services, you agree to the collection, use, and processing 
                of your personal data in accordance with the Data Privacy Act of 2012 (RA 10173). Your information 
                is securely stored, kept confidential, and used only for legal services. You may contact us at 
                info@mcslawofficeph.com for inquiries. By clicking 'Continue to Document Review,' you confirm your consent.
              </p>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('privacyConsent')}
                  className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">I have read and agree to the Data Privacy Policy.</span>
              </label>
              {errors.privacyConsent && (
                <p className="mt-1 text-sm text-red-600">{errors.privacyConsent.message}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                disabled={!privacyConsent}
                className={`px-6 py-2 rounded-md ${
                  privacyConsent ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Document Review
              </button>
            </div>
          </div>
        )}
        
        {/* Steps 2, 3, and 4 remain unchanged */}
        {/* ... */}
        
        {/* Step 5: Confirmation */}
        {currentStep === 5 && submissionSuccess && (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Your document has been submitted successfully</h3>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for choosing MCS LAW for your document review needs. Our team of legal experts will carefully 
              analyze your document and provide insights within 48 hours. You will receive a notification via email 
              once the review is complete.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </form>
      
      {/* Payment Modal with Paymongo Integration */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Document Review Fee</span>
                <span className="font-medium">₱500.00</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₱500.00</span>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Select Payment Method</h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('card')}
                  className={`py-2 px-3 text-sm font-medium rounded-md text-center ${
                    selectedPaymentMethod === 'card'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('gcash')}
                  className={`py-2 px-3 text-sm font-medium rounded-md text-center ${
                    selectedPaymentMethod === 'gcash'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  GCash
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('grab_pay')}
                  className={`py-2 px-3 text-sm font-medium rounded-md text-center ${
                    selectedPaymentMethod === 'grab_pay'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  GrabPay
                </button>
              </div>
            </div>
            
            {/* Card Details Form (only shown for card payments) */}
            {selectedPaymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Payment Button */}
            <div className="flex justify-end">
              <button
                onClick={initiatePayment}
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? 'Processing...' : (
                  selectedPaymentMethod === 'card' ? 'Pay ₱500.00' : 
                  selectedPaymentMethod === 'gcash' ? 'Pay with GCash' : 'Pay with GrabPay'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentReviewForm;