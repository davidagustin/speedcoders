import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to dashboard for authenticated users, or to auth for new users
  redirect('/auth/login');
}
