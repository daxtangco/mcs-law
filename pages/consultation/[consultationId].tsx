import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import LoadingScreen from '@/components/common/LoadingScreen';

// Define type for consultation data
interface ConsultationData {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  inquiry: string;
  documents?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  status: string;
  notes?: string;
  createdAt: any;
  scheduledDate?: any;
  videoConferenceId?: string;
}

const ConsultationDetailPage: NextPage = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const { consultationId } = router.query;
  
  const [consultation, setConsultation] = useState<ConsultationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !currentUser) {
      router.push('/login?redirect=/consultation/' + consultationId);
    }
  }, [currentUser, loading, router, consultationId]);

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!consultationId || !currentUser) return;
      
      try {
        setIsLoading(true);
        const consultationDoc = await getDoc(doc(db, 'consultations', consultationId as string));
        
        if (!consultationDoc.exists()) {
          setError('Consultation not found');
          return;
        }
        
        const consultationData = {
          id: consultationDoc.id,
          ...consultationDoc.data(),
        } as ConsultationData;
        
        // Check if the user has access to this consultation
        if (consultationData.userId !== currentUser.uid) {
          setError('You do not have permission to view this consultation');
          return;
        }
        
        setConsultation(consultationData);
      } catch (error) {
        console.error('Error fetching consultation:', error);
        setError('Failed to load consultation details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultation();
  }, [consultationId, currentUser]);

  if (loading || !currentUser) {
    return <LoadingScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return <LoadingScreen />;
  }

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head>
        <title>Consultation Details | MCS LAW</title>
        <meta name="description" content="View your consultation details." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/">
                    <span className="text-2xl font-bold text-blue-600">MCS LAW</span>
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Consultation Details</h1>
                <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Consultation #{consultation.id.substring(0, 8)}</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Submitted on {formatDate(consultation.createdAt)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                      {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{consultation.name}</dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{consultation.email}</dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{consultation.phone}</dd>
                      </div>
                      {consultation.companyName && (
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Company</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{consultation.companyName}</dd>
                        </div>
                      )}
                      <div className={`${consultation.companyName ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                        <dt className="text-sm font-medium text-gray-500">Legal inquiry</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                          {consultation.inquiry}
                        </dd>
                      </div>
                      
                      {consultation.scheduledDate && (
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Consultation scheduled</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {formatDate(consultation.scheduledDate)}
                          </dd>
                        </div>
                      )}
                      
                      {consultation.documents && consultation.documents.length > 0 && (
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                              {consultation.documents.map((document, idx) => (
                                <li key={idx} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                  <div className="w-0 flex-1 flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-2 flex-1 w-0 truncate">{document.name}</span>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <a href={document.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-500">
                                      Download
                                    </a>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      )}
                      
                      {/* Notes or updates section */}
                      {consultation.notes && (
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Notes</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                            {consultation.notes}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ConsultationDetailPage;