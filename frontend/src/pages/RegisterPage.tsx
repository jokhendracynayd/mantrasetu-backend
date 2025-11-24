import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Loader2 } from 'lucide-react';

import { registerUser } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';

import Logo from '../components/Common/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      await dispatch(
        registerUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        })
      ).unwrap();

      setIsSuccess(true);
      toast.success('Registration successful! Welcome to MantraSetu!');

      setTimeout(() => {
        reset();
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Extract error message from different possible error formats
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error) {
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        } else if (Array.isArray(error.response?.data?.message)) {
          // Handle validation errors array
          errorMessage = error.response.data.message
            .map((err: any) => err.message || err)
            .join(', ');
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    toast.success('Google registration coming soon!');
  };

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordStrength = password ? getPasswordStrength(password) : 0;
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-600',
  ];

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

          <h1 className="text-3xl font-bold text-center text-foreground mb-2 tracking-wide">
            CREATE ACCOUNT
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Join thousands of spiritual seekers
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Success Message */}
            {isSuccess && (
              <div className="bg-green-50 border border-green-500 text-green-700 px-4 py-3 rounded-lg text-center font-medium">
                ✅ Registration successful! Redirecting to dashboard...
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="First Name"
                    className="pl-10"
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                    })}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    className="pl-10"
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                    })}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="pl-10"
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

            {/* Phone */}
            <div className="space-y-2">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-10"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Please enter a valid phone number',
                    },
                    minLength: {
                      value: 10,
                      message: 'Phone number must be at least 10 digits',
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
                      message:
                        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}

              {/* Password Criteria */}
              <div className="text-xs text-muted-foreground space-y-1 mt-1">
                <p className="font-medium">Password must contain:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li className={password && password.length >= 8 ? 'text-green-600' : ''}>
                    At least 8 characters
                  </li>
                  <li className={password && /[a-z]/.test(password) ? 'text-green-600' : ''}>
                    One lowercase letter (a-z)
                  </li>
                  <li className={password && /[A-Z]/.test(password) ? 'text-green-600' : ''}>
                    One uppercase letter (A-Z)
                  </li>
                  <li className={password && /\d/.test(password) ? 'text-green-600' : ''}>
                    One number (0-9)
                  </li>
                  <li className={password && /[@$!%*?&#]/.test(password) ? 'text-green-600' : ''}>
                    One special character (@$!%*?&#)
                  </li>
                </ul>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1 mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength
                            ? strengthColors[passwordStrength - 1]
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      passwordStrength >= 4 ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <Checkbox
                id="acceptTerms"
                {...register('acceptTerms', {
                  required: 'You must accept the terms and conditions',
                })}
                className="mt-1"
              />
              <label
                htmlFor="acceptTerms"
                className="text-sm text-muted-foreground leading-tight cursor-pointer"
              >
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'CREATE ACCOUNT'
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
              🕉️ Register as Pandit Ji
            </Button>

            {/* <Button
              type="button"
              variant="outline"
              onClick={handleGoogleRegister}
              className="w-full h-11 gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                G
              </div>
              Sign up with Google
            </Button> */}

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
