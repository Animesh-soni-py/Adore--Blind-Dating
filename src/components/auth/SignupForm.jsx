import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';
import Input from '../ui/Input';

const schema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'Too short'),
  lastName: yup.string().required('Last name is required').min(2, 'Too short'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: yup.boolean().oneOf([true], 'You must agree to the terms'),
});

export default function SignupForm() {
  const { signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    try {
      setLoading(true);
      const result = await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      if (result?.autoSignedIn) {
        navigate('/dashboard', { replace: true });
      } else {
        setTimeout(() => {
          navigate('/login', { replace: true, state: { justSignedUp: true } });
        }, 3000);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            id="firstName"
            autoComplete="given-name"
            placeholder="Priya"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            name="lastName"
            id="lastName"
            autoComplete="family-name"
            placeholder="Sharma"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
        <Input
          label="Email"
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          id="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            className="mt-1 accent-pink"
            {...register('agreeToTerms')}
          />
          <label htmlFor="agreeToTerms" className="text-base text-white/50 leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-pink underline font-bold">Terms of Service</a> and{' '}
            <a href="#" className="text-pink underline font-bold">Privacy Policy</a>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-pink font-semibold mt-1" role="alert">
            {errors.agreeToTerms.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-6"
        loading={loading}
      >
        Create Account
      </Button>

      <p className="text-center text-base text-white/45 mt-8 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-pink font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
