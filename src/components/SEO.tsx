import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string;
}

const SEO = ({ 
  title, 
  description, 
  canonical = '', 
  image = '/og-image.jpg', 
  type = 'website' 
}: SEOProps) => {
  // In App Router, SEO is handled through metadata API
  // This component is kept for compatibility but doesn't render anything
  return null;
};

export default SEO;