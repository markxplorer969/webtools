import { 
  QrCode, 
  KeyRound, 
  FileText, 
  Palette, 
  Paintbrush, 
  ShieldCheck, 
  Link, 
  CaseUpper,
  Image,
  LockKeyhole,
  UserCheck
} from 'lucide-react';

export interface Tool {
  name: string;
  description: string;
  icon: any;
  slug?: string;
}

export interface ToolCategory {
  categoryName: string;
  tools: Tool[];
}

const allToolsData: ToolCategory[] = [
  {
    categoryName: "Generator",
    tools: [
      {
        name: "Generator Kode QR",
        description: "Ubah URL atau teks menjadi Kode QR.",
        icon: QrCode
      },
      {
        name: "Generator Password",
        description: "Buat password yang kuat dan acak.",
        icon: KeyRound
      },
      {
        name: "Generator Lorem Ipsum",
        description: "Hasilkan teks placeholder standar.",
        icon: FileText
      }
    ]
  },
  {
    categoryName: "Maker",
    tools: [
      {
        name: "Pembuat Palet Warna",
        description: "Buat dan ekspor skema palet warna.",
        icon: Palette
      },
      {
        name: "Pembuat Gradien",
        description: "Hasilkan kode CSS untuk gradien indah.",
        icon: Paintbrush
      }
    ]
  },
  {
    categoryName: "Keamanan",
    tools: [
      {
        name: "Multi 2FA Authenticator",
        description: "Kelola banyak kode 2FA dalam satu dashboard real-time.",
        icon: LockKeyhole
      },
      {
        name: "Encoder / Decoder Base64",
        description: "Encode atau decode teks ke Base64.",
        icon: ShieldCheck
      },
      {
        name: "Encoder / Decoder URL",
        description: "Encode string agar aman untuk URL.",
        icon: Link
      }
    ]
  },
  {
    categoryName: "Utilitas & Teks",
    tools: [
      {
        name: "Facebook UID Checker",
        description: "Cek status Facebook UID secara massal dengan batching.",
        icon: UserCheck,
        slug: 'facebook-uid-checker'
      },
      {
        name: "Penghitung Kata",
        description: "Hitung kata, karakter, dan paragraf.",
        icon: FileText
      },
      {
        name: "Pengubah Kapitalisasi",
        description: "Ubah teks menjadi UPPERCASE, lowercase, dll.",
        icon: CaseUpper
      },
      {
        name: "Konverter JPG ke PNG",
        description: "Konversi format gambar dengan cepat.",
        icon: Image
      }
    ]
  }
];

export default allToolsData;