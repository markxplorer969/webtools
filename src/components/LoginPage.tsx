'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast.success('Login berhasil!');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error(error.message || 'Gagal login dengan Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Email dan password harus diisi');
      return;
    }

    try {
      setIsLoading(true);
      
      if (isLoginMode) {
        await signInWithEmail(email, password);
        toast.success('Login berhasil!');
      } else {
        await signUpWithEmail(email, password);
        toast.success('Pendaftaran berhasil!');
        setIsLoginMode(true); // Switch back to login mode after successful signup
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('Email tidak ditemukan');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Password salah');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Email sudah digunakan');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password terlalu lemah (minimal 6 karakter)');
      } else {
        toast.error(error.message || 'Gagal autentikasi');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <motion.div variants={cardVariants} className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Selamat Datang
          </h1>
          <p className="text-gray-400">
            Masuk untuk mengakses semua tools WebTools
          </p>
        </motion.div>

        {/* Login Form Card */}
        <motion.div variants={cardVariants}>
          <Card className="glass border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center">
                {isLoginMode ? 'Login' : 'Daftar'}
              </CardTitle>
              <CardDescription className="text-gray-400 text-center">
                {isLoginMode 
                  ? 'Masuk dengan akun yang sudah ada atau buat akun baru'
                  : 'Buat akun baru untuk menggunakan semua tools'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-10 pl-10"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isLoginMode ? 'Masuk...' : 'Mendaftar...'}
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      {isLoginMode ? 'Masuk' : 'Daftar'}
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">atau</span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Masuk dengan Google...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.09-1.53-.26-2.22l-2.2.16-4.3-.38-.57-.82-1.09-.82-1.79V5c0-1.11.89-2 2-2h4.7c1.99 0 3.56.89 3.56 2v1.95c0 1.11-.89 2-2 2H5.83c-1.11 0-2-.89-2-2V7.07c0-1.11.89-2 2-2h1.95l2.2-2.2c.78-.17 1.46-.44 2.22-.26l4.3 4.3c.57.82 1.09.82 1.79V19c0 1.11-.89 2-2 2h-4.7c-1.99 0-3.56-.89-3.56-2v-1.95c0-1.11-.89-2 2-2h-1.95z"
                      />
                    </svg>
                    Masuk dengan Google
                  </>
                )}
              </Button>

              {/* Toggle Login/Signup */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  {isLoginMode ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
                  <button 
                    className="text-blue-400 hover:text-blue-300 underline"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                  >
                    {isLoginMode ? 'Daftar sekarang' : 'Masuk'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div variants={cardVariants} className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Dengan login, Anda setuju dengan{' '}
            <button className="text-blue-400 hover:text-blue-300 underline">
              Syarat & Ketentuan
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;