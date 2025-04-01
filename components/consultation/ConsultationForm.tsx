import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Form validation schema
const consultationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  companyName: z.string().optional(),
  inquiry: z.string().min(50, 'Please provide at least 50 characters explaining your legal inquiry'),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the data privacy policy' }),
  }),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const ConsultationForm = () => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: currentUser?.displayName || '',
      email: currentUser?.email || '',
      // No default value for privacyConsent
    },
  });

  const privacyConsent = watch('privacyConsent');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
      setFiles(validFiles);
    }
  };

  const uploadFiles = async () => {
    const fileUrls = [];
    
    for (const file of files) {
      const fileId = uuidv4();
      const fileRef = ref(storage, `consultation-documents/${currentUser?.uid}/${fileId}-${file.name}`);
      
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      
      fileUrls.push({
        name: file.name,
        url: downloadUrl,
        type: file.type,
        size: file.size,
      });
    }
    
    return fileUrls;
  };

  const onSubmit = async (data: ConsultationFormData) => {
    try {
      setIsSubmitting(true);
      
      // Upload files if any
      const documentUrls = files.length > 0 ? await uploadFiles() : [];
      
      // Save consultation request to Firestore
      const consultationRef = await addDoc(collection(db, 'consultations'), {
        userId: currentUser?.uid || 'guest',
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName || '',
        inquiry: data.inquiry,
        documents: documentUrls,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      
      // Send confirmation email (this would typically be handled by a Cloud Function)
      // For this example, we'll assume the email is sent
      
      setSubmissionSuccess(true);
      setCurrentStep(4); // Move to confirmation step
    } catch (error) {
      console.error('Error submitting consultation:', error);
      alert('An error occurred while submitting your consultation request. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Online Legal Consultation</h2>
      
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-300'
              }`}>
                {step}
              </div>
              <span className="text-xs mt-2 text-gray-500">
                {step === 1 && 'Privacy Consent'}
                {step === 2 && 'Personal Details'}
                {step === 3 && 'Legal Inquiry'}
                {step === 4 && 'Confirmation'}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="h-1 w-full bg-gray-200 rounded"></div>
          </div>
          <div className="relative flex justify-between">
            <div className={`h-1 bg-blue-600 rounded`} style={{ width: `${(currentStep - 1) * 33.33}%` }}></div>
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
                By proceeding with MCS LAW's online legal services, you agree to the collection, use, and processing 
                of your personal data in accordance with the Data Privacy Act of 2012 (RA 10173). Your information 
                is securely stored, kept confidential, and used only for legal services. You may contact us at 
                info@mcslawofficeph.com for inquiries. By clicking 'Continue to Consultation,' you confirm your consent.
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
                Continue to Consultation
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Personal Details */}
        {currentStep === 2 && (
          <div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+63 XXX XXX XXXX"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>
              
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name (Optional)</label>
                <input
                  id="companyName"
                  type="text"
                  {...register('companyName')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next: Submit Legal Inquiry
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Legal Inquiry */}
        {currentStep === 3 && (
          <div>
            <div className="space-y-4">
              <div>
                <label htmlFor="inquiry" className="block text-sm font-medium text-gray-700">
                  Inquiry Details * (Minimum 50 characters)
                </label>
                <textarea
                  id="inquiry"
                  rows={6}
                  {...register('inquiry')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your legal concern in detail..."
                />
                {errors.inquiry && <p className="mt-1 text-sm text-red-600">{errors.inquiry.message}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Characters: {watch('inquiry')?.length || 0}/50 minimum
                </p>
              </div>
              
              <div>
                <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                  Upload Supporting Documents (Optional, Max 10MB per file)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG up to 10MB</p>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Confirmation */}
        {currentStep === 4 && submissionSuccess && (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Thank you for submitting your inquiry</h3>
            <p className="mt-2 text-sm text-gray-600">
              Our legal team will review your request and respond within 24 hours. 
              We'll reach out to you via email or phone to discuss your case further.
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
    </div>
  );
};

export default ConsultationForm;