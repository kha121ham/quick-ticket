"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setAuthCookie } from '@/lib/auth';

const useTokenReceiver = () => {
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (token) {
      setAuthCookie(token);

     
      router.replace("/", undefined, { shallow: true });
    }
  }, []);
};

export default useTokenReceiver;
