import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);
      if (err) {
        setError(err.message);

        return;
      }
      navigate("/", { replace: true });
    },
    [email, password, navigate],
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4">
      <h1 className="text-xl font-bold text-foreground">MVP Tracker</h1>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          isRequired
          autoComplete="email"
          label="Email"
          labelPlacement="outside"
          placeholder="seu@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          isRequired
          autoComplete="current-password"
          label="Senha"
          labelPlacement="outside"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <Button color="primary" isLoading={loading} type="submit">
          Entrar
        </Button>
      </form>
    </div>
  );
}
