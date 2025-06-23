'use client';

import { useActionState, useEffect, useTransition } from 'react';
import { closeTicket } from '@/actions/ticket.actions';
import { toast } from 'sonner';
import LoadingButton from './LoadingButton';

const CloseTicketButton = ({
  ticketId,
  isClosed,
}: {
  ticketId: number;
  isClosed: boolean;
}) => {
  const initialState = {
    success: false,
    message: '',
  };

  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState(closeTicket, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  if (isClosed) return null;

  return (
    <form action={(formData) => {
      startTransition(() => {
        formAction(formData);
      });
    }}>
      <input type='hidden' name='ticketId' value={ticketId} />
      <LoadingButton
        type='submit'
        loading={isPending}
        className='bg-red-500 text-white px-3 py-3 w-full rounded hover:bg-red-600 transition'
      >
        Close Ticket
      </LoadingButton>
    </form>
  );
};

export default CloseTicketButton;
