import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FirebaseError } from 'firebase/app';

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Valid email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(8, 'Password confirmation is required'),
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the privacy policy' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Firebase error messages mapping to user-friendly messages
const getErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please try logging in or use a different email';
    case 'auth/invalid-email':
      return 'The email address is invalid';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support';
    case 'auth/weak-password':
      return 'The password is too weak. Please choose a stronger password';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection';
    default:
      return 'An error occurred during registration. Please try again';
  }
};

const RegisterPage: NextPage = () => {
  const { register: registerUser, signInWithGoogle, currentUser } = useAuth();
  const router = useRouter();
  const { redirect } = router.query;
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGoogleRegistering, setIsGoogleRegistering] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      privacyPolicy: true
    }
  });

  useEffect(() => {
    // If user is already logged in, redirect
    if (currentUser) {
      router.push(typeof redirect === 'string' ? redirect : '/dashboard');
    }
  }, [currentUser, redirect, router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      setIsRegistering(true);
      await registerUser(data.email, data.password, data.name);
      router.push(typeof redirect === 'string' ? redirect : '/dashboard');
    } catch (error) {
      setIsRegistering(false);
      if (error instanceof FirebaseError) {
        setError(getErrorMessage(error));
      } else {
        setError('Failed to create an account. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsGoogleRegistering(true);
      await signInWithGoogle();
      router.push(typeof redirect === 'string' ? redirect : '/dashboard');
    } catch (error) {
      setIsGoogleRegistering(false);
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
          setError('Sign-in popup was closed. Please try again.');
        } else {
          setError(getErrorMessage(error));
        }
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    }
  };

  return (
    <>
      <Head>
        <title>Register | MCS LAW</title>
        <meta name="description" content="Create a new account with MCS LAW to access our legal services." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/">
            <div className="flex justify-center">
              <span className="text-3xl font-bold text-blue-600">MCS LAW</span>
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    {...register('name')}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600" id="name-error">{errors.name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register('email')}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600" id="email-error">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    {...register('password')}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.password ? (
                    <p className="mt-1 text-sm text-red-600" id="password-error">{errors.password.message}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters with at least one uppercase letter, one number, and one special character.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                    {...register('confirmPassword')}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600" id="confirmPassword-error">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="privacyPolicy"
                  type="checkbox"
                  aria-invalid={errors.privacyPolicy ? "true" : "false"}
                  aria-describedby={errors.privacyPolicy ? "privacy-error" : undefined}
                  {...register('privacyPolicy')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="privacyPolicy" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.privacyPolicy && (
                <p className="mt-1 text-sm text-red-600" id="privacy-error">{errors.privacyPolicy.message}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isRegistering || isGoogleRegistering}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isRegistering ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : 'Create account'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isRegistering || isGoogleRegistering}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  {isGoogleRegistering ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing up with Google...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                      </svg>
                      <span>Sign up with Google</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;