import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allToolsData } from '@/lib/toolsData';
import Multi2FA from '@/app/tools/multi-2fa-authenticator/page';
import FacebookUidChecker from '@/components/tools/FacebookUidChecker';

// Generate metadata for SEO (Pilar 12)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = allToolsData.find(t => t.slug === params.slug);
  
  if (!tool) {
    return {
      title: 'Tool Not Found | Mark Tools',
      description: 'The requested tool could not be found.',
    };
  }

  return {
    title: `${tool.name} | Mark Tools`,
    description: tool.description,
    keywords: [...tool.tags || [], 'Mark Tools', 'digital tools', 'minimalist'],
    openGraph: {
      title: `${tool.name} | Mark Tools`,
      description: tool.description,
      url: `https://marktools.com/tools/${tool.slug}`,
      siteName: 'Mark Tools',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} | Mark Tools`,
      description: tool.description,
    },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = allToolsData.find(t => t.slug === params.slug);

  if (!tool) {
    notFound();
  }

  // Render Tool (Arsitektur Switch)
  switch (tool.slug) {
    case 'multi-2fa-authenticator':
      return <Multi2FA />;
    case 'facebook-uid-checker':
      return <FacebookUidChecker />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Tool tidak ditemukan</h1>
            <p className="text-gray-400">Tool yang Anda cari tidak tersedia.</p>
          </div>
        </div>
      );
  }
}