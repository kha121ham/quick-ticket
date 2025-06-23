'use server';
import { prisma } from "@/db/prisma";
import { logEvent } from "@/utils/sentry";
import { signAuthToken, setAuthCookie, removeAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

type ResponseResult = {
    success: boolean;
    message: string,

}
// Register new user
export const registerUser = async (prevState: ResponseResult, formData: FormData): Promise<ResponseResult> => {
    try {
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        
        if(!name || !email || !password) {
            logEvent(
                'Validation error: Missing register fields',
                'auth',
                { name, email },
                'warning'
              )
            return { success: false, message: 'All fields are required' }
        }

        //Check if user exist 
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser) {
            logEvent(
                `Registration failed: User already exists - ${email}`,
                'auth',
                { email },
                'warning'
              );
            return { success: false, message: 'Email already exist' }
        }

        //Hash user password
        const hashedPassword = await bcrypt.hash(password,10);

        //Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        // Sign and set auth token
        const token = await signAuthToken({ userId: user.id });
        await setAuthCookie(token);

        logEvent(
            `User registered succcessfully: ${email}`,
            'auth',
            { userId: user.id, email },
            'info'
          );

        return { success: true, message: 'User created successfuly' }
    } catch (error) {
        logEvent(
      'Unexpected error during registration',
      'auth',
      {},
      'error',
      error
    );
    return {
      success: false,
      message: 'Something went wrong, please try again',
    };
    }
}

//Logout user
export const LogoutUser = async (): Promise<ResponseResult> => {
  try {
    await removeAuthCookie();
    logEvent('User logged out successfully', 'auth', {}, 'info');
    return { success: true, message: 'Logout Successful' };
  } catch (error) {
    logEvent('Unexpected error during logout', 'auth', {}, 'error', error);
    return { success: false, message: 'Logout failed. Please try again' };
  }
}

//Login user 
export const LoginUser = async (prevState: ResponseResult, formData: FormData): Promise<ResponseResult> => {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    if(!email || !password) {
      logEvent('Validation error: Missing login fields', 'auth', { email }, 'warning');
      return { success: false, message: 'All fields are required' };
    }
    const user = await prisma.user.findUnique({
      where: { email }
    })
    if(!user) {
      logEvent('Login failed: User not found', 'auth', { email }, 'warning');
      return { success: false, message: 'Invalid credentials' };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      logEvent('Login failed: Invalid password', 'auth', { email }, 'warning');
      return { success: false, message: 'Invalid credentials' };
    }
    const token = await signAuthToken({ userId: user.id });
    await setAuthCookie(token);
    logEvent('User logged in successfully', 'auth', { userId: user.id, email }, 'info');
    return { success: true, message: 'Login successful' };
  } catch (error) {
    logEvent('Unexpected error during login', 'auth', {}, 'error', error);
    return { success: false, message: 'Login failed. Please try again' };
  }
}