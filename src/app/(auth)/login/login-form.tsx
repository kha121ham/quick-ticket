'use client';

import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginUser } from "@/actions/auth.acions";
import LoadingButton from "@/components/LoadingButton"; 

const LoginForm = () => {
  const router = useRouter();
  const initialState = {
    success: false,
    message: '',
  };

  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(LoginUser, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push('/tickets');
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-blue-50 px-4'>
      <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8 border border-gray-200'>
        <h1 className='text-3xl font-bold mb-6 text-center text-blue-600'>
          Login
        </h1>

        <form
          action={(formData) => {
            startTransition(() => formAction(formData));
          }}
          className='space-y-4 text-gray-700'
        >
          <input
            className='w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            type='email'
            name='email'
            placeholder='Your Email'
            autoComplete='email'
            required
          />
          <input
            className='w-full border border-gray-200 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
            type='password'
            name='password'
            placeholder='Password'
            autoComplete='new-password'
            required
          />

          <LoadingButton
            type='submit'
            loading={isPending}
            className='w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:opacity-50'
          >
            Login
          </LoadingButton>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;