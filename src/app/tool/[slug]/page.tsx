import { notFound } from 'next/navigation';
import allToolsData from '@/lib/toolsData';
import FacebookUidChecker from '@/components/tools/FacebookUidChecker';

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const { slug } = params;
  
  // Find the tool by slug
  let tool = null;
  for (const category of allToolsData) {
    const foundTool = category.tools.find(t => t.slug === slug);
    if (foundTool) {
      tool = foundTool;
      break;
    }
  }

  if (!tool) {
    notFound();
  }

  // Render the appropriate component based on slug
  const renderToolComponent = () => {
    switch (slug) {
      case 'facebook-uid-checker':
        return <FacebookUidChecker />;
      default:
        return (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-white mb-4">{tool.name}</h1>
            <p className="text-gray-400 mb-8">{tool.description}</p>
            <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-gray-300">Tool ini sedang dalam pengembangan.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{tool.name}</h1>
          <p className="text-gray-400 text-lg">{tool.description}</p>
        </div>
        
        {renderToolComponent()}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];
  
  for (const category of allToolsData) {
    for (const tool of category.tools) {
      if (tool.slug) {
        paths.push({ slug: tool.slug });
      }
    }
  }
  
  return paths;
}