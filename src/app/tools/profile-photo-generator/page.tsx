import { Metadata } from 'next';
import ProfilePhotoGenerator from '@/components/tools/ProfilePhotoGenerator';

export const metadata: Metadata = {
  title: 'Profile Photo Generator | Mark Tools',
  description: 'Hasilkan foto profil untuk cowo atau cewe dengan mudah dan cepat.',
  keywords: ['profile photo', 'generator', 'avatar', 'cowo', 'cewe', 'foto profil'],
  openGraph: {
    title: 'Profile Photo Generator | Mark Tools',
    description: 'Hasilkan foto profil untuk cowo atau cewe dengan mudah dan cepat.',
    url: 'https://marktools.com/tools/profile-photo-generator',
    siteName: 'Mark Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile Photo Generator | Mark Tools',
    description: 'Hasilkan foto profil untuk cowo atau cewe dengan mudah dan cepat.',
  },
};

export default function ProfilePhotoGeneratorPage() {
  return (
    <div className="min-h-screen">
      <ProfilePhotoGenerator />
    </div>
  );
}