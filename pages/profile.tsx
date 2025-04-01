import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required').optional(),
  phone: z.string().min(10, 'Valid phone number is required').optional(),
  address: z.string().optional(),
  company: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage: NextPage = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login?redirect=/profile');
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            
            // Set form default values
            reset({
              name: data.name || currentUser.displayName || '',
              email: data.email || currentUser.email || '',
              phone: data.phone || '',
              address: data.address || '',
              company: data.company || '',
            });
          } else {
            // Create user document if it doesn't exist
            const defaultData = {
              uid: currentUser.uid,
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              createdAt: new Date(),
            };
            setUserData(defaultData);
            reset(defaultData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [currentUser, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!currentUser) return;
    
    try {
      setIsSubmitting(true);
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: data.name,
        phone: data.phone || '',
        address: data.address || '',
        company: data.company || '',
        updatedAt: new Date(),
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Profile | MCS LAW</title>
        <meta name="description" content="Manage your profile information." />
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
              <div className="flex items-center">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Update your personal details and preferences.</p>
                  </div>
                  
                  {submitSuccess && (
                    <div className="mx-4 my-2 bg-green-50 border-l-4 border-green-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">Profile updated successfully!</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Full name</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <input
                              type="text"
                              {...register('name')}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Email address</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <input
                              type="email"
                              disabled
                              value={currentUser.email || ''}
                              className="w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <input
                              type="tel"
                              {...register('phone')}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="+63 XXX XXX XXXX"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Address</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <input
                              type="text"
                              {...register('address')}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Your address"
                            />
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Company</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <input
                              type="text"
                              {...register('company')}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Your company (if applicable)"
                            />
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:px-6">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => router.push('/dashboard')}
                              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                            >
                              {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </dl>
                    </form>
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

export default ProfilePage;