import { Tool } from './types';
import { 
  Shield, 
  Key, 
  UserSquare,
  Type,
  QrCode,
  Link,
  Facebook,
  Image,
  DatabaseZap,
  Users
} from 'lucide-react';

export const allToolsData: Tool[] = [
  // Live Tools Only
  {
    slug: 'name-generator',
    name: 'Name Generator',
    description: 'Hasilkan nama unik (Indonesia & Inggris) dengan nama depan dan belakang.',
    category: 'Generator',
    icon: UserSquare,
    is_live: true,
    layout_size: '1x1',
    tags: ['Name', 'Generator', 'Indonesia', 'English'],
    url: '/tools/name-generator'
  },
  {
    slug: 'multi-2fa-authenticator',
    name: 'Multi-2FA Authenticator',
    description: 'Generate and manage 2FA codes for multiple services in one secure place.',
    category: 'Security',
    icon: Shield,
    is_live: true,
    layout_size: '2x1',
    tags: ['2FA', 'Authentication', 'Security'],
    url: '/tools/multi-2fa-authenticator'
  },
  {
    slug: 'temp-notes-spreadsheet',
    name: 'TempNotes (Spreadsheet)',
    description: 'Notes cepat dengan checker FB UID Live/Dead dan deteksi duplikat terintegrasi.',
    category: 'Utility',
    icon: DatabaseZap,
    is_live: true,
    layout_size: '2x1',
    tags: ['Spreadsheet', 'Notes', 'Facebook', 'UID', 'Checker', 'Utility'],
    url: '/tools/temp-notes-spreadsheet'
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Create strong, unique passwords with customizable options.',
    category: 'Security',
    icon: Key,
    is_live: true,
    layout_size: '1x1',
    tags: ['Password', 'Security', 'Generator'],
    url: '/tools/password-generator'
  },
  {
    slug: 'text-analyzer',
    name: 'Text Analyzer',
    description: 'Analyze text for readability, word count, and sentiment.',
    category: 'Text',
    icon: Type,
    is_live: true,
    layout_size: '1x1',
    tags: ['Analysis', 'Text', 'Writing'],
    url: '/tools/text-analyzer'
  },
  {
    slug: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, and more.',
    category: 'Utility',
    icon: QrCode,
    is_live: true,
    layout_size: '1x1',
    tags: ['QR', 'Generator', 'Utility'],
    url: '/tools/qr-generator'
  },
  {
    slug: 'url-shortener',
    name: 'URL Shortener',
    description: 'Create short, memorable URLs for long links.',
    category: 'Utility',
    icon: Link,
    is_live: true,
    layout_size: '1x1',
    tags: ['URL', 'Shortener', 'Utility'],
    url: '/tools/url-shortener'
  },
  {
    slug: 'facebook-uid-checker',
    name: 'Facebook UID Checker',
    description: 'Check Facebook UID status (Live/Dead) with real-time verification.',
    category: 'Utility',
    icon: Facebook,
    is_live: true,
    layout_size: '1x1',
    tags: ['Facebook', 'UID', 'Checker', 'Social Media', 'Verification'],
    url: '/tools/facebook-uid-checker'
  },
  {
    slug: 'profile-photo-generator',
    name: 'Profile Photo Generator',
    description: 'Hasilkan foto profil untuk cowo atau cewe.',
    category: 'Generator',
    icon: Image,
    is_live: true,
    layout_size: '2x1',
    tags: ['Profile', 'Photo', 'Generator', 'Avatar', 'Gender'],
    url: '/tools/profile-photo-generator'
  },
  {
    slug: 'fake-ml',
    name: 'Fake ML Lobby',
    description: 'Buat fake Mobile Legends lobby dengan avatar dan username kustom.',
    category: 'Generator',
    icon: Users,
    is_live: true,
    layout_size: '1x1',
    tags: ['Fake', 'ML', 'Mobile Legends', 'Lobby', 'Generator'],
    url: '/tools/fake-ml'
  }
];

export const categories = [
  { name: 'Semua', count: allToolsData.length },
  { name: 'Security', count: allToolsData.filter(tool => tool.category === 'Security').length },
  { name: 'Generator', count: allToolsData.filter(tool => tool.category === 'Generator').length },
  { name: 'Text', count: allToolsData.filter(tool => tool.category === 'Text').length },
  { name: 'Utility', count: allToolsData.filter(tool => tool.category === 'Utility').length }
];