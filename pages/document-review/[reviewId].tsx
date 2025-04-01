import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import LoadingScreen from '@/components/common/LoadingScreen';

// Define type for document review data
interface DocumentReviewData {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone?: string;
    documentType: string;
    additionalDetails?: string;
    document?: {
        name: string;
        url: string;
        type: string;
        size: number;
    };
    status: string;
    paymentStatus?: string;
    paymentAmount?: number;
    paymentId?: string;
    paymentSourceId?: string;
    createdAt: any;
    updatedAt?: any;
    reviewReport?: string;
    reviewAttachments?: Array<{
        name: string;
        url: string;
        type?: string;
        size?: number;
    }>;
    statusHistory?: Array<{
        status: string;
        timestamp: any;
        note?: string;
    }>;
}

const DocumentReviewDetailPage: NextPage = () => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();
    const { reviewId } = router.query;

    const [review, setReview] = useState<DocumentReviewData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!loading && !currentUser) {
            router.push('/login?redirect=/document-review/' + reviewId);
        }
    }, [currentUser, loading, router, reviewId]);

    useEffect(() => {
        const fetchReview = async () => {
            if (!reviewId || !currentUser) return;

            try {
                setIsLoading(true);
                const reviewDoc = await getDoc(doc(db, 'document-reviews', reviewId as string));

                if (!reviewDoc.exists()) {
                    setError('Document review not found');
                    return;
                }

                const reviewData = {
                    id: reviewDoc.id,
                    ...reviewDoc.data(),
                } as DocumentReviewData;

                // Check if the user has access to this review
                if (reviewData.userId !== currentUser.uid) {
                    setError('You do not have permission to view this document review');
                    return;
                }

                setReview(reviewData);
            } catch (error) {
                console.error('Error fetching document review:', error);
                setError('Failed to load document review details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReview();
    }, [reviewId, currentUser]);

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

    if (!review) {
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
            case 'pending-review':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get payment status badge color
    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format status for display
    const formatStatus = (status: string) => {
        return status
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <>
            <Head>
                <title>Document Review Details | MCS LAW</title>
                <meta name="description" content="View your document review details." />
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
                                <h1 className="text-3xl font-bold text-gray-900">Document Review Details</h1>
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
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Review #{review.id.substring(0, 8)}</h3>
                                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                                Submitted on {formatDate(review.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(review.status)}`}>
                                                {formatStatus(review.status)}
                                            </span>
                                            {review.paymentStatus && (
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(review.paymentStatus)}`}>
                                                    {review.paymentStatus.charAt(0).toUpperCase() + review.paymentStatus.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{review.name}</dd>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{review.email}</dd>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{review.phone || 'Not provided'}</dd>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Document type</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{review.documentType}</dd>
                                            </div>
                                            {review.additionalDetails && (
                                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">Additional details</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                                                        {review.additionalDetails}
                                                    </dd>
                                                </div>
                                            )}

                                            {/* Document section */}
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Document</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {review.document ? (
                                                        <div className="border border-gray-200 rounded-md p-3 flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="ml-2 flex-1 truncate">{review.document.name}</span>
                                                            </div>
                                                            <a href={review.document.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-500">
                                                                Download
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 italic">No document attached</span>
                                                    )}
                                                </dd>
                                            </div>

                                            {/* Payment details */}
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Payment amount</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    ₱{review.paymentAmount ? review.paymentAmount.toFixed(2) : '0.00'}
                                                </dd>
                                            </div>

                                            {/* Review report if available */}
                                            {review.reviewReport && (
                                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">Review report</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        <div className="border border-gray-200 rounded-md p-4 whitespace-pre-line">
                                                            {review.reviewReport}
                                                        </div>
                                                        {review.reviewAttachments && review.reviewAttachments.length > 0 && (
                                                            <div className="mt-4">
                                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Attachments</h4>
                                                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                                                    {review.reviewAttachments.map((attachment, idx) => (
                                                                        <li key={idx} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                                            <div className="w-0 flex-1 flex items-center">
                                                                                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                                                                </svg>
                                                                                <span className="ml-2 flex-1 w-0 truncate">{attachment.name}</span>
                                                                            </div>
                                                                            <div className="ml-4 flex-shrink-0">
                                                                                <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-500">
                                                                                    Download
                                                                                </a>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </dd>
                                                </div>
                                            )}

                                            {/* Status timeline if available */}
                                            {review.statusHistory && review.statusHistory.length > 0 && (
                                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">Status history</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        <div className="flow-root">
                                                            <ul className="-mb-8">
                                                                {/* Use statusHistory as a local variable to ensure TypeScript knows it exists */}
                                                                {(() => {
                                                                    const statusHistory = review.statusHistory!;
                                                                    return statusHistory.map((event, eventIdx) => (
                                                                        <li key={eventIdx}>
                                                                            <div className="relative pb-8">
                                                                                {eventIdx !== statusHistory.length - 1 ? (
                                                                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                                                                ) : null}
                                                                                <div className="relative flex space-x-3">
                                                                                    <div>
                                                                                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(event.status)}`}>
                                                                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                                            </svg>
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                                                        <div>
                                                                                            <p className="text-sm text-gray-500">
                                                                                                {formatStatus(event.status)}
                                                                                                {event.note && <span className="font-medium text-gray-900"> - {event.note}</span>}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                                                            {formatDate(event.timestamp)}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    ));
                                                                })()}
                                                            </ul>
                                                        </div>
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

export default DocumentReviewDetailPage;