import { NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const Home: NextPage = () => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>MCS LAW - Your Legal Partner for Growth and Innovation</title>
        <meta name="description" content="MCS LAW is a boutique law firm in San Fernando, Pampanga, committed to helping businesses and individuals navigate the legal landscape with confidence." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  {/* Replace with your actual logo */}
                  <span className="text-2xl font-bold text-blue-600">MCS LAW</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="/services" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Services
                </Link>
                <Link href="/about" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  About Us
                </Link>
                <Link href="/contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Contact
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {currentUser ? (
                <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Dashboard
                </Link>
              ) : (
                <div className="flex space-x-4">
                  <Link href="/login" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-3 py-2 text-sm font-medium">
                    Login
                  </Link>
                  <Link href="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Register
                  </Link>
                </div>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link href="/" className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Home
              </Link>
              <Link href="/services" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Services
              </Link>
              <Link href="/about" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                About Us
              </Link>
              <Link href="/contact" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Contact
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {currentUser ? (
                <div>
                  <div className="mt-3 space-y-1">
                    <Link href="/dashboard" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      onClick={() => {/* logout function */}}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-1">
                  <Link href="/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Login
                  </Link>
                  <Link href="/register" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <svg
                className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                fill="currentColor"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="50,0 100,0 50,100 0,100" />
              </svg>

              <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Your Legal Partner for</span>{' '}
                    <span className="block text-blue-600 xl:inline">Growth and Innovation</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    At MCS LAW, we understand that the world is changing—while traditional businesses continue to thrive, the rise of digital enterprises is shaping the future. That's why we provide legal solutions that cater to both, ensuring our clients stay protected and ready for growth.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link href="/consultation" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                        Get Legal Consultation
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link href="/document-review" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                        Document Review
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Our Services</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Comprehensive Legal Solutions
              </p>
              <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
                We offer practical and strategic legal services from family-run corporations to start-ups and emerging enterprises.
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* Online Legal Consultation */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900">Online Legal Consultation</h3>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-base text-gray-500">
                        Legal concerns shouldn't slow you down. At MCS LAW, we're making legal support more efficient and accessible—wherever you are.
                      </p>
                    </div>
                    <div className="mt-6">
                      <Link href="/consultation" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Document Review */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900">Document & Contract Review</h3>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-base text-gray-500">
                        Contracts can be complex, but understanding them shouldn't be. We provide thorough legal review to help you navigate the terms.
                      </p>
                    </div>
                    <div className="mt-6">
                      <Link href="/document-review" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Corporate Law */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900">Corporate Law</h3>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-base text-gray-500">
                        From business formation to mergers and acquisitions, we provide strategic legal guidance for businesses of all sizes.
                      </p>
                    </div>
                    <div className="mt-6">
                      <Link href="/services" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        Explore Services
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">How It Works</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Simple Process, Powerful Results
              </p>
              <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
                Our streamlined process makes it easy to get the legal help you need, when you need it.
              </p>
            </div>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-lg font-medium text-gray-900">Steps</span>
                </div>
              </div>

              <div className="mt-10 max-w-lg mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:max-w-none">
                <div className="relative">
                  <div className="relative flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl font-bold mb-4 mx-auto">
                    1
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center">Submit Your Inquiry</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Fill out our simple online form with your legal concerns.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl font-bold mb-4 mx-auto">
                    2
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center">Receive a Quote</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Get a clear fixed-fee quote for the services you need.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl font-bold mb-4 mx-auto">
                    3
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center">Video Consultation</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Connect with our legal experts from anywhere.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl font-bold mb-4 mx-auto">
                    4
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center">Receive Legal Solutions</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Get tailored legal advice and solutions to move forward with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block">Get your legal matters sorted today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-200">
              Let our experienced team help you navigate the legal landscape with confidence.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link href="/consultation" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                  Get Legal Consultation
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link href="/contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
  <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
    <div className="xl:grid xl:grid-cols-3 xl:gap-8">
      <div className="space-y-8 xl:col-span-1">
        <span className="text-2xl font-bold text-white">MCS LAW</span>
        <p className="text-gray-300 text-base">
          Your legal partner for growth and innovation, providing expert legal services in San Fernando, Pampanga.
        </p>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Facebook</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Instagram</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Twitter</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 xl:mt-0 xl:col-span-2">
        <div className="md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Services</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/consultation" className="text-base text-gray-300 hover:text-white">
                  Legal Consultation
                </Link>
              </li>
              <li>
                <Link href="/document-review" className="text-base text-gray-300 hover:text-white">
                  Document Review
                </Link>
              </li>
            </ul>
          </div>
          <div className="mt-12 md:mt-0">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/about" className="text-base text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
          <ul className="mt-4 space-y-4">
            <li className="flex">
              <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-300">San Fernando, Pampanga</span>
            </li>
            <li className="flex">
              <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-300">+63 123 456 7890</span>
            </li>
            <li className="flex">
              <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-300">info@mcslawofficeph.com</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="mt-12 border-t border-gray-700 pt-8">
      <p className="text-base text-gray-400 xl:text-center">
        &copy; 2025 MCS LAW. All rights reserved.
      </p>
    </div>
  </div>
</footer>
    </>
  );
};

export default Home;