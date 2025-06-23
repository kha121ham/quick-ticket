'use client';
import { useActionState, useEffect } from "react";
import { LogoutUser } from "@/actions/auth.acions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogoutButton = () => {
  const router = useRouter();
  const initialState = {
    success: false,
    message: '',
  };
  const [state, formAction] = useActionState(LogoutUser, initialState);
  useEffect(()=> {
    if(state.success) {
      toast.success(state.message);
      router.push('/login');
    } else if(state.message) {
      toast.error(state.message);
    }
  }, [state,router])
    return ( 
        <form action={formAction}>
      <button
        type='submit'
        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition'
      >
        Logout
      </button>
    </form>
     );
}
 
export default LogoutButton;