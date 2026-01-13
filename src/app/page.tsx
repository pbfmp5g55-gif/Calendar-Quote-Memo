import Home from '@/components/Home';
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  return <Home user={session?.user} />;
}
