import { FormState, SignupFormSchema } from '@/app/lib/definitions';
import { createSession, deleteSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';

export async function signIn(id: string, password: string) {}

export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    id: formData.get('id'),
    // email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { id, password } = validatedFields.data;
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Library's API
  const data = await db
    .insert(users)
    .values({
      id,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id });

  const user = data[0];

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    };
  }

  // 4. Create user session
  await createSession(user.id);
  // 5. Redirect user
  redirect('/profile');
}

export async function logout() {
  deleteSession();
  redirect('/login');
}
