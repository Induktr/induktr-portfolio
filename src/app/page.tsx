"use client";

import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MissionWheel } from "@/features/writer-mission/MissionWheel";
import { ContactForm } from "@/features/send-app/ContactForm";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <main className="flex-1 overflow-x-hidden">
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('home.greeting')}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t('home.description')}
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/projects">
                    {t('common.viewProjects')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#contact">
                    {t('home.startProject')}
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Mission Wheel Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-16"
            >
              <MissionWheel />
            </motion.div>

            <motion.div
              id="contact"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-20 mb-10"
            >
              <ContactForm />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
