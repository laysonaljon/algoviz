import type { AppProps } from 'next/app';
import Head from 'next/head';
import './globals.css';

import React, { useState } from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';

function MyApp({ Component, pageProps }: AppProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      <Head>
        <title>Algorithm Visualizer</title>
        <meta name="description" content="Visualize algorithms in action to understand them better. Learn about sorting and searching algorithms with interactive demonstrations." />
        <meta name="keywords" content="algorithm, visualizer, sorting, searching, javascript, react, nextjs, education, learning" />
        <meta name="author" content="Aljon Layson" />
        <link rel="icon" href="/logo.svg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aljonlayson.com" />
        <meta property="og:title" content="Algorithm Visualizer" />
        <meta property="og:description" content="Visualize algorithms in action to understand them better." />
        <meta property="og:image" content="/logo.svg" />
        <meta property="og:locale" content="en_US" />
      </Head>

      <div className="flex flex-col h-screen">
        <Header onMenuToggle={handleMobileMenuToggle} />

        <div className="flex flex-grow overflow-hidden">
          <Sidebar
            isMobileOpen={isMobileOpen}
            onMobileClose={handleMobileSidebarClose}
          />
          <div
            className={`flex flex-col flex-grow
              pt-16 my-2 transition-all duration-300 ease-in-out
            `}
          >
            <main
              className={`flex-grow overflow-y-auto
       
                mx-2 mb-2
              `}
            >
              <Component {...pageProps} />
            </main>
            <Footer /> 
          </div>
        </div>
      </div>
    </>
  );
}

export default MyApp;