import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { Separator } from "@/shared/ui/separator";
import { Button } from "@/shared/ui/button";
import { 
  SiReact, 
  SiTypescript, 
  SiJavascript, 
  SiTailwindcss, 
  SiVite, 
  SiFigma, 
  SiGit,
  SiNextdotjs,
  SiNodedotjs,
  SiHtml5,
} from "react-icons/si";
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Globe, 
  CheckCircle2, 
  Award, 
  Target,
  Rocket,
  Download,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import avatarInduktr from "@/shared/assets/images/avatar-induktr.jpg";

import { fadeIn, staggerContainer } from "@/shared/constants/animations/about";
import { useAuth } from "@/shared/hooks/useAuth";
import { useExperience } from "@/shared/hooks/useExperience";
import { ExperienceForm } from "@/entities/Experience/ui/ExperienceForm";
import { useAppDispatch } from "@/shared/lib/store/store";
import { openModal } from "@/shared/lib/store/slices/uiSlice";
import { Loader } from "@/shared/ui/Loader";

export const About = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { MERGED_EXPERIENCE, isLoading, deleteExperienceMutation } = useExperience();
  const dispatch = useAppDispatch();

  const handleDownloadPDF = () => {
    window.print();
  };

  const skills = [
    { name: "React.js", icon: <SiReact className="w-5 h-5 text-blue-400" />, years: "1", level: 90 },
    { name: "JavaScript (ES6+)", icon: <SiJavascript className="w-5 h-5 text-yellow-400" />, years: "1.5", level: 95 },
    { name: "TypeScript", icon: <SiTypescript className="w-5 h-5 text-blue-600" />, years: "1", level: 85 },
    { name: "React UI", icon: <SiTailwindcss className="w-5 h-5 text-cyan-400" />, years: "1.5", level: 90 },
    { name: "Next.js", icon: <SiNextdotjs className="w-5 h-5 text-white" />, years: "0.5", level: 75 }
  ];

  const additionalSkills = [
    { name: "HTML5/CSS3", icon: <SiHtml5 /> },
    { name: "Vite", icon: <SiVite /> },
    { name: "Node.js", icon: <SiNodedotjs /> },
    { name: "Git", icon: <SiGit /> },
    { name: "Figma", icon: <SiFigma /> }
  ];

  const handleDelete = (id: string | number) => {
    if (confirm("Delete this experience entry?")) {
      deleteExperienceMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 print:p-0 print:pt-0">
      <style>{`
        @media print {
          header, footer, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .container {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .Card {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            background: white !important;
          }
          .Badge {
            border: 1px solid #ccc !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .grid {
            display: grid !important;
          }
          .lg\\:grid-cols-3 {
            grid-template-columns: 1fr 2fr !important;
          }
        }
      `}</style>
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-end mb-8 no-print gap-4">
          {user && (
            <Button variant="outline" className="gap-2" onClick={() => dispatch(openModal({ modalName: "experienceForm" }))}>
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          )}
          <Button onClick={handleDownloadPDF} className="gap-2 shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" />
            {t('common.downloadResume')}
          </Button>
        </div>

        {isLoading && <Loader className="min-h-screen flex items-center justify-center" text="Loading Experience..." variant="primary" />}

        <ExperienceForm />

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Sidebar Area: User Info & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div variants={fadeIn}>
              <Card className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary ring-4 ring-primary/10">
                    <img 
                      src={avatarInduktr} 
                      alt="Induktr"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold">Induktr</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {t('about.subtitle')}
                  </CardDescription>
                  <div className="mt-4 flex flex-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {t('about.stats.verified')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>{t('about.stats.location')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span>{t('about.stats.experience')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-green-500">{t('about.stats.salary')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span>{t('about.stats.rate')}</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      {t('about.languages.title')}
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>{t('about.languages.ukrainian')}</p>
                      <p>{t('about.languages.english')}</p>
                      <p>{t('about.languages.russian')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Summary */}
            <motion.section variants={fadeIn} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t('about.title')}</h2>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground italic">
                "{t('about.summary')}"
              </p>
            </motion.section>

            {/* Experience */}
            <motion.section variants={fadeIn} className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t('about.experience.title')}</h2>
              </div>
              
              <div className="space-y-8">
                {MERGED_EXPERIENCE.map((item) => (
                  <div key={item.slug} className="relative pl-6 border-l-2 border-primary/20 space-y-4 group">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{item.role}</h3>
                        <Badge variant="outline" className="mt-1 text-primary border-primary/30">
                          {item.period}
                        </Badge>
                      </div>

                      {user && item.isFromDb && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => dispatch(openModal({ modalName: "experienceForm", editingItem: item }))}>
                             <Pencil className="w-4 h-4" />
                           </Button>
                           <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                             <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>{item.description}</p>
                      {item.catalog && (
                        <div className="bg-accent/30 p-4 rounded-xl border border-border/50">
                          <p className="text-sm italic">{item.catalog}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Achievements */}
            <motion.section variants={fadeIn} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t('about.achievements.title')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(t('about.achievements.list', { returnObjects: true })) && 
                 (t('about.achievements.list', { returnObjects: true }) as string[]).map((achievement, index) => (
                  <Card key={index} className="bg-card/30 border-primary/10 hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <p className="text-sm leading-relaxed">{achievement}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* Expectations */}
            <motion.section variants={fadeIn} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t('about.expectations.title')}</h2>
              </div>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-foreground leading-relaxed">
                    {t('about.expectations.text')}
                  </p>
                </CardContent>
              </Card>
            </motion.section>

            {/* Skills & Progress */}
            <motion.section variants={fadeIn} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">{t('about.skills.title')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 font-medium">
                        {skill.icon}
                        {skill.name}
                      </div>
                      <span className="text-muted-foreground">
                        {skill.years} {skill.years === "1" ? t('about.skills.year') : t('about.skills.years')}
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
              
              <div className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {additionalSkills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-4 py-2 text-sm bg-accent/50 hover:bg-accent border-border transition-colors flex items-center gap-2"
                    >
                      <span className="text-primary">{skill.icon}</span>
                      {skill.name}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="px-4 py-2 text-sm border-dashed border-primary/30 text-primary">
                    + {t('common.moreDetails', 'More')}
                  </Badge>
                </div>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
