# 🛠️ WebTools - Koleksi Tools Digital Modern

Koleksi tools digital elegan dan powerful yang dirancang untuk produktivitas, keamanan, dan pengembangan. Dibangun dengan teknologi terkini untuk pengalaman pengguna yang optimal.

## ✨ Teknologi Stack

Proyek ini dibangun dengan teknologi modern dan production-ready:

### 🎯 Framework Inti
- **⚡ Next.js 16** - Framework React terbaru dengan Turbopack untuk performa maksimal
- **📘 TypeScript 5** - JavaScript type-safe untuk pengalaman developer yang lebih baik
- **🎨 Tailwind CSS 4** - Framework CSS utility-first untuk pengembangan UI yang cepat

### 🧩 Komponen UI & Styling
- **🧩 shadcn/ui** - Komponen berkualitas tinggi yang accessible berbasis Radix UI
- **🎯 Lucide React** - Library ikon yang konsisten dan indah
- **🌈 Framer Motion** - Library motion yang production-ready untuk React
- **🎨 Next Themes** - Dark mode sempurna dalam 2 baris kode

### 📋 Form & Validasi
- **🎣 React Hook Form** - Form performan dengan validasi mudah
- **✅ Zod** - Validasi schema dengan TypeScript-first

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - State management yang sederhana dan scalable
- **🔄 TanStack Query** - Sinkronisasi data yang powerful untuk React
- **🌐 Axios** - HTTP client berbasis Promise

### 🗄️ Database & Backend
- **🗄️ Prisma** - ORM Node.js dan TypeScript generasi berikutnya
- **🔐 NextAuth.js** - Solusi autentikasi open-source lengkap

### 🎨 Fitur UI Lanjutan
- **📊 TanStack Table** - Headless UI untuk membangun tabel dan datagrid
- **🖱️ DND Kit** - Toolkit drag and drop modern untuk React
- **📊 Recharts** - Library chart yang didefinisikan ulang dengan React dan D3
- **🖼️ Sharp** - Pemrosesan gambar berperforma tinggi

### 🌍 Internasionalisasi & Utilitas
- **🌍 Next Intl** - Library internasionalisasi untuk Next.js
- **📅 Date-fns** - Library utilitas date JavaScript modern
- **🪝 ReactUse** - Koleksi React hooks esensial untuk pengembangan modern

## 🛠️ Tools Tersedia

### 🔐 Keamanan
- **Password Generator** - Buat password kuat dan unik dengan opsi kustomisasi
- **Multi-2FA Authenticator** - Kelola kode 2FA untuk multiple layanan

### 🎨 Generator
- **Name Generator** - Hasilkan nama unik (Indonesia & Inggris)
- **QR Code Generator** - Buat QR code untuk URL, teks, WiFi, dll
- **Profile Photo Generator** - Hasilkan foto profil untuk cowo/cewe
- **Fake ML Lobby** - Buat fake Mobile Legends lobby dengan avatar kustom

### 📝 Teks & Utilitas
- **Text Analyzer** - Analisis teks untuk readability, word count, dll
- **URL Shortener** - Buat URL pendek yang mudah diingat
- **Temp Notes** - Notes cepat dengan Facebook UID checker terintegrasi
- **Facebook UID Checker** - Cek status Facebook UID (Live/Dead)

## 🎯 Fitur Utama

### 📱 Desain Responsif
- **Mobile-First** - Desain optimal untuk mobile dengan enhancement desktop
- **Breakpoints**: 1 kolom (mobile), 2 kolom (tablet), 3 kolom (desktop), 4 kolom (large)
- **Touch-Friendly** - Target sentuh minimal 44px untuk elemen interaktif

### 🎨 UI/UX Modern
- **Glass Morphism** - Desain dengan efek glass dan backdrop blur
- **Dark Theme** - Tema gelap yang nyaman untuk mata
- **Animasi Halus** - Transisi Framer Motion yang smooth
- **Loading States** - Skeleton dan indikator loading yang jelas

### ⚡ Performa Optimal
- **Turbopack** - Bundler Next.js 16 yang super cepat
- **Smart Caching** - Caching untuk performa API yang lebih baik
- **Optimized Images** - Optimisasi gambar otomatis dengan Sharp
- **Code Splitting** - Splitting kode otomatis untuk load time cepat

### 🔐 Privasi & Keamanan
- **Client-Side Processing** - Data diproses di browser, tidak dikirim ke server
- **No Tracking** - Tidak ada tracking atau pengumpulan data pengguna
- **Secure APIs** - API endpoints yang aman dengan validasi input

## 🔐 Autentikasi & User Management

### 🎯 Fitur Login
- **Google OAuth** - Login dengan akun Google (Demo Mode)
- **Session Management** - Sesi user tersimpan di localStorage
- **User Profile** - Informasi user ditampilkan di header
- **Logout** - Keluar dari sistem dengan aman

### 📱 Komponen Autentikasi
- **Login Page** - Halaman login modern dengan animasi
- **User Menu** - Dropdown menu dengan informasi user
- **Auth Context** - Context management untuk state autentikasi
- **Protected Routes** - Proteksi halaman yang memerlukan login (coming soon)

### 🔐 Status Saat Ini
- ✅ **Login Page**: `/login` - Berfungsi dengan email/password & Google OAuth
- ✅ **User Menu**: Avatar dan dropdown menu
- ✅ **Auth Context**: State management global
- ✅ **Session Storage**: localStorage untuk persistensi
- 🔄 **Demo Mode**: Berfungsi penuh, Firebase siap diintegrasikan

### 🔐 Cara Menggunakan
1. Kunjungi `/login` untuk halaman login
2. Pilih metode login:
   - **Google OAuth**: Klik "Masuk dengan Google"
   - **Email/Password**: Masuk email dan password, lalu klik "Masuk"
   - **Sign Up**: Isi form pendaftaran untuk akun baru
3. User akan muncul di header setelah login berhasil
4. Klik avatar user untuk menu dropdown
5. Pilih "Keluar" untuk logout

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi berjalan.

## 📁 Struktur Proyek

```
src/
├── app/                    # Next.js App Router pages
│   ├── tools/              # Halaman tools
│   │   ├── password-generator/
│   │   ├── qr-generator/
│   │   ├── facebook-uid-checker/
│   │   └── ...
│   ├── api/                # API routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css          # Global styles
├── components/              # Reusable React components
│   ├── ui/                 # shadcn/ui components
│   ├── tools/               # Tool-specific components
│   └── ads/                # Ad components
├── lib/                    # Utility functions & configs
│   ├── toolsData.ts         # Data tools
│   ├── db.ts                # Database config
│   └── utils.ts             # Helper functions
├── hooks/                   # Custom React hooks
└── types/                   # TypeScript type definitions
```

## 🎨 Komponen Tersedia

### 🧩 UI Components (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Badge, Avatar, Calendar

### 📊 Fitur Data Lanjutan
- **Tables**: Tabel data powerful dengan sorting, filtering, pagination (TanStack Table)
- **Charts**: Visualisasi indah dengan Recharts
- **Forms**: Form type-safe dengan React Hook Form + Zod validation

### 🎨 Fitur Interaktif
- **Animations**: Mikro-interaksi smooth dengan Framer Motion
- **Drag & Drop**: Fungsionalitas drag-and-drop modern dengan DND Kit
- **Theme Switching**: Dukungan dark/light mode built-in

### 🔐 Integrasi Backend
- **Authentication**: Flow autentikasi siap pakai dengan NextAuth.js
- **Database**: Operasi database type-safe dengan Prisma
- **API Client**: Request HTTP dengan Axios + TanStack Query
- **State Management**: Sederhana dan scalable dengan Zustand

## 🔧 Development Scripts

```bash
npm run dev          # Start development server dengan hot reload
npm run build        # Build untuk production
npm run start        # Start production server
npm run lint         # Run ESLint untuk cek kode
npm run db:push      # Push schema Prisma ke database
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run database migrations
```

## 🌍 Environment Variables

Buat file `.env.local` untuk konfigurasi environment:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# API Keys (optional)
# API_KEY="your-api-key"
```

## 📱 Responsive Design

Proyek ini menggunakan pendekatan mobile-first dengan breakpoints:

- **Mobile** (< 640px): 1 kolom grid
- **Tablet** (640px - 768px): 2 kolom grid  
- **Desktop** (768px - 1024px): 3 kolom grid
- **Large** (> 1024px): 4 kolom grid

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build image
docker build -t webtools .

# Run container
docker run -p 3000:3000 webtools
```

### Manual
```bash
# Build
npm run build

# Start production server
npm start
```

## 🤝 Kontribusi

Kontribusi sangat welcome! Silakan:

1. Fork proyek ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🔗 Links

- **Live Demo**: [https://webtools.vercel.app](https://webtools.vercel.app)
- **Documentation**: [Wiki](https://github.com/markxplorer969/webtools/wiki)
- **Issues**: [GitHub Issues](https://github.com/markxplorer969/webtools/issues)

---

Dibangun dengan ❤️ untuk komunitas developer. Powered by Next.js 16 🚀