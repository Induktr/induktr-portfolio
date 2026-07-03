"use client";

import { useState, useEffect, type SubmitEvent } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const AdminPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginMutation, user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) router.push("/projects");
  }, [user, router]);

  if (user) return null;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="container flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t("admin.title", "Admin Portal")}</CardTitle>
            <CardDescription>{t("admin.description", "Enter your credentials to access management tools")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder={t("admin.username", "Username")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder={t("admin.password", "Password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t("admin.authenticating", "Authenticating...") : t("admin.login", "Login to Admin")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminPage;
