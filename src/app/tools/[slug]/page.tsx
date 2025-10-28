'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import AnimatedPage from '@/components/AnimatedPage';
import SEO from '@/components/SEO';

// Import all tool components
import TwoFactorAuth from '@/components/tools/TwoFactorAuth';
import FacebookUIDChecker from '@/components/tools/FacebookUIDChecker';
import InstagramUsernameChecker from '@/components/tools/InstagramUsernameChecker';
import TempNotes from '@/components/tools/TempNotes';
import IndoUsernameGen from '@/components/tools/IndoUsernameGen';
import TempEmail from '@/components/tools/TempEmail';

const ToolPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  // Tool configuration with SEO data
  const tools = {
    '2fa-generator': {
      component: TwoFactorAuth,
      title: '2FA Authenticator - Two Factor Authentication Tool',
      description: 'Manage your 2FA tokens with automatic code generation. Import, export, and organize your authentication codes securely.',
    },
    'fb-uid-checker': {
      component: FacebookUIDChecker,
      title: 'Facebook UID Checker - Verify FB Account Status',
      description: 'Check if Facebook UIDs are live or dead. Batch processing with configurable speed and detailed results.',
    },
    'ig-username-checker': {
      component: InstagramUsernameChecker,
      title: 'Instagram Username Checker - Check Availability',
      description: 'Verify if Instagram usernames are available or taken. Fast batch processing with live/dead status.',
    },
    'temp-notes': {
      component: TempNotes,
      title: 'Temp Notes - Mini Spreadsheet with Auto-Save',
      description: 'Online spreadsheet with dynamic rows/columns, auto-save, and Excel export functionality.',
    },
    'username-generator': {
      component: IndoUsernameGen,
      title: 'Indonesian Username Generator - Creative Usernames',
      description: 'Generate creative Indonesian-style usernames with adjectives, slang words, and numbers.',
    },
    'temp-email': {
      component: TempEmail,
      title: 'Temporary Email - Disposable Email Address',
      description: 'Generate disposable email addresses for privacy protection. Auto-refresh inbox and message preview.',
    },
  };

  const tool = tools[slug as keyof typeof tools];

  if (!tool) {
    return (
      <AnimatedPage>
        <SEO 
          title="Tool Not Found - MarkTools" 
          description="The requested tool was not found."
        />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
            <p className="text-gray-600 mb-6">The tool you're looking for doesn't exist or has been moved.</p>
            <a 
              href="/tools" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse All Tools
            </a>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const ToolComponent = tool.component;

  return (
    <AnimatedPage>
      <SEO 
        title={tool.title}
        description={tool.description}
      />
      <ToolComponent />
    </AnimatedPage>
  );
};

export default ToolPage;