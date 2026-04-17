import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAccess() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        setAllowed(false);
        return;
      }

      if (!adminOnly) {
        setAllowed(true);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setAllowed(data?.role === "admin");
    }

    checkAccess();
  }, [adminOnly]);

  if (allowed === null) return <p>Checking access...</p>;
  if (!allowed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}