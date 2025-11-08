import { Tool } from './types';
import { 
  Shield, 
  Key, 
  Lock, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Code, 
  Palette, 
  Calculator, 
  Clock, 
  Calendar,
  MapPin,
  Camera,
  Mic,
  Wifi,
  Database,
  DatabaseZap,
  Cloud,
  Smartphone,
  Monitor,
  Globe,
  Mail,
  MessageSquare,
  Users,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Heart,
  Star,
  TrendingUp,
  BarChart,
  PieChart,
  Activity,
  Target,
  Award,
  Bookmark,
  Share,
  Link,
  Scissors,
  Type,
  Hash,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  Search,
  Filter,
  Grid,
  List,
  Layers,
  Package,
  Box,
  Archive,
  Trash,
  Edit,
  Copy,
  Clipboard,
  Save,
  Printer,
  QrCode,
  Fingerprint,
  Eye,
  EyeOff,
  Facebook,
  CaseUpper,
  UserSquare
} from 'lucide-react';

export const allToolsData: Tool[] = [
  // Tool MVP - Live Tool
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
    description: 'Notes cepat DENGAN checker FB UID Live/Dead dan deteksi duplikat terintegrasi.',
    category: 'Utilitas',
    icon: DatabaseZap,
    is_live: true,
    layout_size: '2x1',
    tags: ['Spreadsheet', 'Notes', 'Facebook', 'UID', 'Checker', 'Utility'],
    url: '/tools/temp-notes-spreadsheet'
  },
  
  // Additional Live Tools
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
    category: 'Productivity',
    icon: QrCode,
    is_live: true,
    layout_size: '1x1',
    tags: ['QR', 'Generator', 'Productivity'],
    url: '/tools/qr-generator'
  },
  {
    slug: 'url-shortener',
    name: 'URL Shortener',
    description: 'Create short, memorable URLs for long links.',
    category: 'Productivity',
    icon: Link,
    is_live: true,
    layout_size: '1x1',
    tags: ['URL', 'Shortener', 'Productivity'],
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
  
  // Security Tools (Coming Soon)
  {
    slug: 'file-encryptor',
    name: 'File Encryptor',
    description: 'Encrypt and decrypt your files with military-grade security.',
    category: 'Security',
    icon: Lock,
    is_live: false,
    layout_size: '1x2',
    tags: ['Encryption', 'Files', 'Security']
  },
  
  // Text Tools (Coming Soon)
  {
    slug: 'markdown-editor',
    name: 'Markdown Editor',
    description: 'Write and preview markdown with live formatting.',
    category: 'Text',
    icon: FileText,
    is_live: false,
    layout_size: '2x1',
    tags: ['Markdown', 'Editor', 'Writing']
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between different case formats instantly.',
    category: 'Text',
    icon: RefreshCw,
    is_live: false,
    layout_size: '1x1',
    tags: ['Text', 'Converter', 'Format']
  },
  
  // Media Tools (Coming Soon)
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images without losing quality.',
    category: 'Media',
    icon: Image,
    is_live: false,
    layout_size: '1x2',
    tags: ['Image', 'Compression', 'Optimization']
  },
  {
    slug: 'video-converter',
    name: 'Video Converter',
    description: 'Convert videos between different formats.',
    category: 'Media',
    icon: Video,
    is_live: false,
    layout_size: '2x2',
    tags: ['Video', 'Converter', 'Format']
  },
  {
    slug: 'audio-editor',
    name: 'Audio Editor',
    description: 'Edit and enhance audio files with professional tools.',
    category: 'Media',
    icon: Music,
    is_live: false,
    layout_size: '2x1',
    tags: ['Audio', 'Editor', 'Music']
  },
  
  // Development Tools (Coming Soon)
  {
    slug: 'code-formatter',
    name: 'Code Formatter',
    description: 'Format and beautify your code with multiple language support.',
    category: 'Development',
    icon: Code,
    is_live: false,
    layout_size: '1x1',
    tags: ['Code', 'Formatter', 'Development']
  },
  {
    slug: 'color-palette',
    name: 'Color Palette Generator',
    description: 'Generate beautiful color palettes for your projects.',
    category: 'Development',
    icon: Palette,
    is_live: false,
    layout_size: '1x1',
    tags: ['Color', 'Palette', 'Design']
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data.',
    category: 'Development',
    icon: Database,
    is_live: false,
    layout_size: '1x1',
    tags: ['JSON', 'Formatter', 'Data']
  },
  
  // Utility Tools (Coming Soon)
  {
    slug: 'calculator',
    name: 'Advanced Calculator',
    description: 'Scientific calculator with advanced functions.',
    category: 'Utility',
    icon: Calculator,
    is_live: false,
    layout_size: '1x1',
    tags: ['Calculator', 'Math', 'Utility']
  },
  {
    slug: 'world-clock',
    name: 'World Clock',
    description: 'Track time across multiple time zones.',
    category: 'Utility',
    icon: Clock,
    is_live: false,
    layout_size: '1x2',
    tags: ['Time', 'Clock', 'World']
  },
  {
    slug: 'calendar-generator',
    name: 'Calendar Generator',
    description: 'Generate custom calendars for any month and year.',
    category: 'Utility',
    icon: Calendar,
    is_live: false,
    layout_size: '2x1',
    tags: ['Calendar', 'Generator', 'Date']
  },
  
  // Productivity Tools (Coming Soon)
  {
    slug: 'task-tracker',
    name: 'Task Tracker',
    description: 'Track and manage your daily tasks efficiently.',
    category: 'Productivity',
    icon: CheckCircle,
    is_live: false,
    layout_size: '2x1',
    tags: ['Tasks', 'Tracker', 'Productivity']
  },
  
  // Design Tools (Coming Soon)
  {
    slug: 'gradient-generator',
    name: 'Gradient Generator',
    description: 'Create beautiful CSS gradients with live preview.',
    category: 'Design',
    icon: Palette,
    is_live: false,
    layout_size: '1x1',
    tags: ['Gradient', 'CSS', 'Design']
  },
  {
    slug: 'shadow-generator',
    name: 'Shadow Generator',
    description: 'Generate CSS box shadows with visual editor.',
    category: 'Design',
    icon: Layers,
    is_live: false,
    layout_size: '1x1',
    tags: ['Shadow', 'CSS', 'Design']
  },
  {
    slug: 'font-pairing',
    name: 'Font Pairing Tool',
    description: 'Find perfect font combinations for your projects.',
    category: 'Design',
    icon: Type,
    is_live: false,
    layout_size: '2x1',
    tags: ['Font', 'Typography', 'Design']
  }
];

export const categories = [
  { name: 'Semua', count: allToolsData.length },
  { name: 'Security', count: allToolsData.filter(tool => tool.category === 'Security').length },
  { name: 'Text', count: allToolsData.filter(tool => tool.category === 'Text').length },
  { name: 'Media', count: allToolsData.filter(tool => tool.category === 'Media').length },
  { name: 'Development', count: allToolsData.filter(tool => tool.category === 'Development').length },
  { name: 'Utility', count: allToolsData.filter(tool => tool.category === 'Utility').length },
  { name: 'Utilitas', count: allToolsData.filter(tool => tool.category === 'Utilitas').length },
  { name: 'Productivity', count: allToolsData.filter(tool => tool.category === 'Productivity').length },
  { name: 'Design', count: allToolsData.filter(tool => tool.category === 'Design').length },
  { name: 'Generator', count: allToolsData.filter(tool => tool.category === 'Generator').length }
];