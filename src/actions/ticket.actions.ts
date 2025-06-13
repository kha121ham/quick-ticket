"use server"
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { logEvent } from "@/utils/sentry";


// Create a new ticket
export const createTicket = async (prevState: { success: boolean, message: string }, formData: FormData):
    Promise<{ success: boolean, message: string }> => {
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    try {
        if (!subject || !description || !priority) {
            logEvent(
                'Validation Error: Missing ticket fields',
                'ticket',
                { subject, description, priority },
                'warning'
              );
            return { success: false, message: "All fields are required" };
        }
        const ticket = await prisma.ticket.create({
            data: { subject, description, priority }
        });
        logEvent(
            `Ticket created successfully: ${ticket.id}`,
            'ticket',
            { ticketId: ticket.id },
            'info'
          );
        revalidatePath("/tickets");
        
        return { success: true, message: "Ticket created successfully" };
    } catch (error) {
        logEvent(
            'An error occured while creating the ticket',
            'ticket',
            {
              formData: Object.fromEntries(formData.entries()),
            },
            'error',
            error
          );
        return { success: false, message: "An error occurred while creating the ticket" };   
    }
}

// Get tickets
export const getTickets = async () => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
    })
    logEvent(
      'Fetched ticket list',
      'ticket',
      { count: tickets.length },
      'info'
    );
    return tickets;
  } catch (error) {
    logEvent('Error fetching tickets', 'ticket', {}, 'error', error);

    return [];
  }
}

export const getTicketById = async (id: string) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) }
    });
    if (!ticket) {
      logEvent('Ticket not found', 'ticket', { ticketId: id }, 'warning');
    }

    return ticket;
  } catch (error) {
    logEvent(
      'Error fetching ticket details',
      'ticket',
      { ticketId: id },
      'error',
      error
    );
    return null;
  }
}