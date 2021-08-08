import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      fetch("/api/hello");
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        Welcome {user.name}! <Link href="/api/auth/logout">Logout</Link>
      </div>
    );
  }

  return <Link href="/api/auth/login">Login</Link>;
}
