'use client';

import type { Ticket } from "@/generated/prisma";
import { getPriorityClass } from "@/utils/ui";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "./LoadingButton";

type TicketItemProps = {
  ticket: Ticket;
};

const TicketItem = ({ ticket }: TicketItemProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isClosed = ticket.status === 'Closed';

  const handleClick = () => {
    if (isClosed) return;
    startTransition(() => {
      router.push(`/tickets/${ticket.id}`);
    });
  };

  return (
    <div
      key={ticket.id}
      className={`flex justify-between items-center bg-white rounded-lg shadow border border-gray-200 p-6 ${
        isClosed ? 'opacity-50' : ''
      }`}
    >
      {/* Left Side */}
      <div>
        <h2 className='text-xl font-semibold text-blue-600'>
          {ticket.subject}
        </h2>
      </div>

      {/* Right Side */}
      <div className='text-right space-y-2'>
        <div className='text-sm text-gray-500'>
          Priority:{' '}
          <span className={getPriorityClass(ticket.priority)}>
            {ticket.priority}
          </span>
        </div>

        <LoadingButton
          loading={isPending}
          onClick={handleClick}
          disabled={isClosed}
          className={`inline-block mt-2 text-sm px-3 py-1 rounded transition text-center ${
            isClosed
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          View Ticket
        </LoadingButton>
      </div>
    </div>
  );
};

export default TicketItem;
