import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';

import { loginUser } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';

import Logo from '../components/Common/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      await dispatch(loginUser(data)).unwrap();

      setIsSuccess(true);
      toast.success('Login successful!');

      setTimeout(() => {
        reset();
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gradient-to-br from-orange-500 to-orange-400">
      {/* Left Section - Logo */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ff6b3520_1px,transparent_1px)] [background-size:20px_20px] animate-[float_20s_ease-in-out_infinite]" />
        <div className="text-center z-10 relative">
          <Logo size="extra-large" />
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <Logo size="medium" />
          </div>

          <h1 className="text-3xl font-bold text-center text-foreground mb-8 tracking-wide">
            LOGIN
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Success Message */}
            {isSuccess && (
              <div className="bg-green-50 border border-green-500 text-green-700 px-4 py-3 rounded-lg text-center font-medium">
                ✅ Login successful! Redirecting to dashboard...
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="pl-10 h-11"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 h-11"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'LOGIN'
              )}
            </Button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border" />
              <span className="flex-shrink mx-4 text-sm text-muted-foreground font-medium">
                OR
              </span>
              <div className="flex-grow border-t border-border" />
            </div>

            {/* Alternative Buttons */}
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/pandit-onboarding')}
              className="w-full font-semibold h-11"
            >
              🕉️ Join as Pandit Ji
            </Button>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground pt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
