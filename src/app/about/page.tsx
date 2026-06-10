"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Heart, Sun, Moon, ShieldCheck, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

type Language = "en" | "ta" | "si";

const content = {
  en: {
    langName: "English",
    header: {
      title: "Youth Callers.",
      greeting: "Assalamu Alaikum Warahmathullahi Wabarakathuhu.",
      subtitle: "Walking Towards Goodness, Together as One Loving Family... 🕊️",
    },
    purpose: {
      title: "Our Pure Purpose",
      body: [
        "Our group is not just a regular WhatsApp community, brother; it is a beautiful family built for our spiritual growth and guidance. As we progress to the next stages of our lives, it is completely natural to have new aspirations, questions about faith, and moments where we look for clear direction.",
        "Youth Callers is here to help everyone in our family gain clarity in faith and achieve the absolute best in life. Without needing to share any of your personal details (100% Anonymous), this is a noble space where you can receive sincere guidance and beautiful advice directly from verified, God-fearing scholars.",
        "There are no accounts or sign-ups required here. Our only goal is to grow together in goodness as one unified family.",
      ],
    },
    works: {
      title: "How Our Family Web Works",
      desc: "Our website is designed to be simple and instantly clear to everyone in our community:",
      steps: [
        {
          title: "01. Share Your Questions Anonymously 📝",
          desc: "You do not need to share your name or any personal information. You can send your queries here via a short text message or through a voice note (Recording.m4a). Our system automatically strips away all your data and only displays a general identifier like User-X. Neither our team nor the answering scholars can ever trace who you are. It is 100% secure.",
        },
        {
          title: "02. Kind Guidance From Scholars 🧠",
          desc: "The questions you send come strictly to our secure admin dashboard. Qualified scholars who are waiting to guide our family will deeply analyze your questions and prepare beautiful, clear solutions in the light of the Quran and Sunnah.",
        },
        {
          title: "03. The Solutions Board 🎯",
          desc: 'All verified answers will be posted directly on our public "Solutions Board". No names or personal identities will ever be displayed—only the question and its official spiritual guidance. This allows everyone else in our family to read, learn, and gain blessings together.',
        },
      ],
    },
    reminders: {
      title: "Daily Family Reminders Bringing Continuous Goodness ✨",
      desc: "To keep all of us consistently connected to faith and positive energy, we have set up these beautiful features on our platform, Insha-Allah:",
      items: [
        {
          icon: Sun,
          title: "Morning Dhikr Triggers",
          desc: "To kickstart every day with blessings and barakah, the essential morning prayers, along with their beautiful specialties and benefits, will be shared as simple visual reminder cards.",
        },
        {
          icon: Moon,
          title: "Evening Quran Reminders",
          desc: "To help everyone build a beautiful habit of reciting at least one page of the Quran daily, clear Quran pages and reflections will be shared in the evening, Insha-Allah. Even those learning to recite can join in beautifully.",
        },
      ],
    },
    promise: {
      title: "Our Core Promise",
      quote:
        '"Your identity remains a closely guarded secret, even within our family."',
      body: "There is a profound beauty in making prayers for someone whose identity is unknown to us. Your privacy is fully protected by our system. Feel free to share your thoughts and questions here without hesitation, brother. May the light of faith bring absolute clarity and peace to your heart.",
    },
  },
  ta: {
    langName: "தமிழ்",
    header: {
      title: "Youth Callers",
      greeting: "அஸ்ஸலாமு அலைக்கும் வரஹ்மத்துல்லாஹி வ பரக்காத்துஹு.",
      subtitle: "நன்மையை நோக்கி ஒன்றாக பயணிக்கும் நம் அன்பான குடும்பம்... 🕊️",
    },
    purpose: {
      title: "Our Pure Purpose / குரூப்பின் நோக்கம்",
      body: [
        "இந்த Youth Callers குரூப் வெறும் ஒரு WhatsApp குரூப் அல்ல மச்சான். இது நம்ம எல்லாரும் சேர்ந்து நன்மையில வளர, மார்க்கத்துல தெளிவு பெற, வாழ்க்கையை சரியான பாதையில் கொண்டு போக உருவாக்கப்பட்ட ஒரு அழகான குடும்பம் மாதிரி இடம்.",
        "வாழ்க்கையில முன்னேறுற போதும், நமக்கு பல சந்தேகங்களும், தேடல்களும், guidance தேவைப்படும் நேரங்களும் வர்றது சாதாரணம் தான். அந்த நேரங்களுக்காக தான் இந்த தளம் இருக்குது.",
        "உங்க தனிப்பட்ட விபரங்கள் எதையும் பகிர வேண்டாம் (Complete Anonymous). குர்ஆன் மற்றும் சுன்னாவின் அடிப்படையில் தகுதியான வழிகாட்டல்களுடன் உங்களுக்கு தெளிவான பதில்கள் கிடைக்கும்.",
        "இங்க sign-up, accounts எதுவும் இல்ல. நம்ம ஒரே நோக்கம் — நன்மையில வளர்ற ஒரு சகோதரத்துவ குடும்பம் உருவாக்குறது.",
      ],
    },
    works: {
      title: "How It Works — செயல்படும் முறை",
      desc: "இது ரொம்ப simple, யாருக்கும் easy-aa புரியுற மாதிரி:",
      steps: [
        {
          title: "01. உங்க கேள்விகளை அனுப்புங்க 📝",
          desc: "பெயர், details எதுவும் தேவையில்லை. Text அல்லது Voice Note (m4a) மூலமா உங்க கேள்விகளை அனுப்பலாம். எல்லாமே anonymous-aa handle பண்ணப்படும்.",
        },
        {
          title: "02. மார்க்க வழிகாட்டல் 🧠",
          desc: "அனுப்பப்பட்ட கேள்விகள் அட்மின் டீமுக்கு போய், குர்ஆன் & சுன்னா அடிப்படையில் தெளிவான, நம்பகமான பதில்கள் தயார் செய்யப்படும்.",
        },
        {
          title: "03. Solutions Board 🎯",
          desc: "அனைத்து பதில்களும் Solutions Board-ல anonymous-aa publish ஆகும். யார் பெயரும் இல்ல. எல்லாருக்கும் benefit ஆகும்.",
        },
      ],
    },
    reminders: {
      title: "அனுதின ஆன்மீக நினைவூட்டல்கள் ✨",
      desc: "நம்ம youth-ஐ நல்ல பாதையில் வைத்திருக்க daily reminders:",
      items: [
        {
          icon: Sun,
          title: "காலை திக்ருகள் 🌅",
          desc: "நாளை barakah-oda start பண்ண morning dhikr reminders & benefits.",
        },
        {
          icon: Moon,
          title: "மாலை குர்ஆன் 🌙",
          desc: "தினமும் குர்ஆன் ஓத encourage பண்ண easy reflections & reminders.",
        },
      ],
    },
    promise: {
      title: "Our Core Promise / எங்களின் உறுதிமொழி",
      quote: '"உங்க அடையாளம் இங்க பாதுகாப்பாகவும் மரியாதையோடும் இருக்கும்."',
      body: "நம்மளோட நோக்கம் உங்களுக்கு உதவுறது மட்டும் தான். உங்க privacy 100% பாதுகாக்கப்படும். தயக்கமில்லாம உங்க கேள்விகளை அனுப்புங்க. InshaAllah நன்மை கிடைக்கும்.",
    },
  },
  si: {
    langName: "සිංහල",
    header: {
      title: "Youth Callers.",
      greeting: "අස්සලාමු අලෛකුම් වරහ්මතුල්ලාහි ව බරකාතුහු.",
      subtitle: "යහපත කරා එක්ව පියනඟන අපගේ ආදරණීය පවුල... 🕊️",
    },
    purpose: {
      title: "Our Pure Purpose",
      body: [
        "මචං, අපේ මේ ගෲප් එක සාමාන්ය වට්ස්ඇප් ගෲප් එකක් විතරක් නෙමෙයි; මේක අපේ ආත්මීය දියුණුව සහ මඟපෙන්වීම වෙනුවෙන් ගොඩනැඟුණු ලස්සන පවුලක් වගෙයි. ජීවිතයේ ඉදිරි පියවරයන් කරා යනකොට, අපිට විවිධ අලුත් සිතුවිලි, ආගමික ගැටලු සහ නිවැරදි මඟපෙන්වීමක් අවශ්ය වෙන අවස්ථා ඇතිවීම සාමාන්ය දෙයක්.",
        "අපේ පවුලේ හැමෝටම දහම පිළිබඳව පැහැදිලි අවබෝධයක් ලබා දීලා, ජීවිතයේ හොඳම තත්ත්වයට පත්වෙන්න උදවු කරන්න තමයි මේ Youth Callers අවකාශය නිර්මාණය කරලා තියෙන්නේ. ඔයාගේ කිසිම පෞද්ගලික තොරතුරක් බාහිර ලෝකයට හෙළි නොකර (100% Anonymous), අල්ලාහ් කෙරෙහි භයභක්තිමත් ධර්ම විද්වතුන්ගෙන් සෘජුවම අවංක මඟපෙන්වීම් සහ උපදෙස් ලබාගත හැකි උතුම් තැනක් තමයි මේ.",
        "මෙහි කිසිදු ලියාපදිංචියක් (No Accounts) අවශ්ය වෙන්නේ නැහැ. අපේ එකම අරමුණ මේ ආදරණීය පවුලක් ලෙස හැමෝම එකතු වෙලා යහපත තුළ ඉදිරියටම යාමයි.",
      ],
    },
    works: {
      title: "How Our Family Web Works",
      desc: "අපේ වෙබ් අඩවිය අපේ පවුලේ හැමෝටම බැලූ බැල්මටම පහසුවෙන් තේරුම් ගත හැකි විදිහටයි නිර්මාණය කරලා තියෙන්නේ:",
      steps: [
        {
          title: "01. ඔයාගේ ගැටලු නිර්නාමිකව අප වෙත යොමු කරන්න 📝",
          desc: "ඔයාගේ නම හෝ පෞද්ගලික තොරතුරු කිසිවක් මෙතැනදී පවසන්න අවශ්ය නැහැ. කෙටි පණිවිඩයකින් (Text) හෝ ඔයාගේ කටහඬින් (Voice Note - Recording.m4a) ඔයාගේ ප්රශ්න මෙතැනට එවන්න පුළුවන්. අපේ සිස්ටම් එක ඔයාගේ සියලුම පෞද්ගලික දත්ත ඉවත් කරලා, User-X වගේ පොදු හැඳුනුම්කාරකයක් විතරයි අපේ ඇඩ්මින් මණ්ඩලයට පෙන්වන්නේ. ඒ නිසා ඔයා කවුද කියලා අපිටවත්, පිළිතුරු දෙන විද්වතුන්ටවත් හොයන්න බැහැ. ඒ තරමටම මෙය 100%ක්ම ආරක්ෂිතයි.",
        },
        {
          title: "02. ධර්ම විද්වතුන්ගේ කරුණාවන්ත මඟපෙන්වීම 🧠",
          desc: "ඔයා එවනු ලබන ප්රශ්න සියල්ලම සෘජුවම පැමිණෙන්නේ අපගේ ආරක්ෂිත ඇඩ්මින් පැනලයට විතරයි. අපේ පවුල වෙනුවෙන් මඟපෙන්වන්න සූදානමින් සිටින සුදුසුකම් ලත් ඉස්ලාමීය විද්වතුන් (Scholars), ඔයාගේ ප්රශ්න හොඳින් අධ්යයනය කරලා, අල්-කුර්ආනය සහ සුන්නහ් ආලෝකයෙන් පැහැදිලි විසඳුම් සකස් කරනවා.",
        },
        {
          title: "03. විසඳුම් පුවරුව (Solutions Board) 🎯",
          desc: 'ලබාදෙන නිල පිළිතුරු සියල්ලම අපේ වෙබ් අඩවියේ ඇති පොදු "Solutions Board" එකේ පළ කරනු ලබනවා. එහි කිසිදු නමක් හෝ අනන්යතාවයක් පෙන්වන්නේ නැහැ—තිබෙන්නේ ප්රශ්නය සහ ඒ සඳහා වන පැහැදිලි ආගමික පිළිතුර විතරයි. මේ නිසා අපේ පවුලේ ඉන්න අනෙක් අයටත් එය කියවා යහපතක් සහ අවබෝධයක් ලබාගන්න පුළුවන්.',
        },
      ],
    },
    reminders: {
      title: "අඛණ්ඩ යහපත ළඟා කර දෙන දෛනික මතක් කිරීම් ✨",
      desc: "අප හැමෝම සැමවිටම දහම සහ ධනාත්මක ශක්තිය සමඟ සම්බන්ධ කර තැබීමට, ඉන්ෂා අල්ලාහ් අපේ වෙබ් අඩවියේ මේ ලස්සන අංගයන්ද ඇතුළත් කර තිබෙනවා:",
      items: [
        {
          icon: Sun,
          title: "උදෑසන දික්ර් මතක් කිරීම් (Morning Dhikr)",
          desc: "සෑම දවසක්ම ආශිර්වාදයෙන් සහ බරකාහ්වලින් ආරම්භ කිරීමට, උදෑසන කියවිය යුතු දික්ර් සහ ඒවායේ ඇති වැදගත්කම සරල කාඩ්පත් (Cards) මඟින් ඔබට මතක් කර දෙනු ලබනවා.",
        },
        {
          icon: Moon,
          title: "සන්ධ්යා කාලීන කුර්ආන් මතක් කිරීම් (Evening Quran)",
          desc: "දිනපතා අවම වශයෙන් කුර්ආන් පිටුවක්වත් කියවීමේ සුන්දර පුරුද්ද ඇති කර ගැනීමට, සවස් කාලයේදී කුර්ආන් පිටු සහ ඒවායේ පැහැදිලි කිරීම් ඉන්ෂා අල්ලාහ් බෙදා ගනු ලබනවා. කුර්ආන් කියවීමට නොදන්නා අයට පවා මෙයට එකතු වී එය පුරුදු විය හැකියි.",
        },
      ],
    },
    promise: {
      title: "Our Core Promise",
      quote: '"ඔයාගේ අනන්යතාවය අපේ පවුල තුළ පවා රහසක්ව පවතිනවා."',
      body: "අප කවුදැයි නොදන්නා කෙනෙකු වෙනුවෙන් අප කරන ප්රාර්ථනාවන්හි (Du'a) අල්ලාහ් ඉදිරියේ විශේෂත්වයක් තිබෙනවා. ඔයාගේ පෞද්ගලිකත්වය (Privacy) මෙහිදී සම්පූර්ණයෙන්ම ආරක්ෂා වෙනවා. මචං, කිසිම පැකිලීමකින් තොරව ඔයාගේ ගැටලු මෙතැනදී බෙදාගන්න. ඉන්ෂා අල්ලාහ්, දහමේ ආලෝකයෙන් ඔයාගේ හදවතට හොඳ පැහැදිලි බවක් සහ සැනසීමක් උදාවේවා!",
    },
  },
};

export default function About() {
  const [activeLang, setActiveLang] = useState<Language>("en");
  const data = content[activeLang];

  return (
    <div className="flex flex-col items-center py-16 px-4 max-w-5xl mx-auto w-full">
      {/* Language Selector */}
      <div className="mb-12 flex items-center justify-center gap-2 p-1 bg-[var(--color-background)] border border-[var(--color-emerald-border)] rounded-full shadow-lg overflow-x-auto max-w-full hide-scrollbar">
        <Languages className="w-4 h-4 text-[var(--color-emerald-accent)] ml-3 shrink-0 hidden md:block" />
        {(Object.keys(content) as Language[]).map((lang) => (
          <motion.button
            whileTap={{ scale: 0.9 }}
            key={lang}
            onClick={() => setActiveLang(lang)}
            className={cn(
              "px-6 py-3 text-sm font-bold rounded-full transition-all duration-300 whitespace-nowrap",
              activeLang === lang
                ? "bg-[var(--color-emerald-accent)] text-white dark:text-black shadow-md"
                : "text-slate-600 hover:text-[var(--color-foreground)]",
            )}
          >
            {content[lang].langName}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLang}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="w-full space-y-16 md:space-y-24"
        >
          {/* Header Section */}
          <div className="text-center space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-emerald-accent)] to-[var(--color-gold)] tracking-tight">
              {data.header.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-emerald-accent)] font-bold">
              {data.header.greeting}
            </p>
            <p className="text-xl md:text-2xl text-[var(--color-foreground)] font-medium">
              {data.header.subtitle}
            </p>
          </div>

          {/* Our Pure Purpose */}
          <div className="glass p-8 md:p-12 rounded-[2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-emerald-accent)]/10 rounded-bl-full -z-10 blur-2xl" />
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-[var(--color-emerald-accent)]/10 flex items-center justify-center border border-[var(--color-emerald-border)]">
                <Heart className="w-7 h-7 text-[var(--color-emerald-accent)]" />
              </div>
              <h2 className="text-3xl font-black text-[var(--color-foreground)] text-center md:text-left">
                {data.purpose.title}
              </h2>
            </div>
            <div className="space-y-6 text-slate-700 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
              {data.purpose.body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* How Our Family Web Works */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-[var(--color-foreground)] mb-4">
                {data.works.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {data.works.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.works.steps.map((step, idx) => (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={idx}
                  className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group hover:border-[var(--color-emerald-border)] transition-colors"
                >
                  <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-4 leading-snug group-hover:text-[var(--color-emerald-accent)] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Daily Family Reminders */}
          <div className="bg-[var(--color-card)] border border-[var(--color-emerald-border)] rounded-[2rem] p-8 md:p-12 shadow-xl dark:shadow-none">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-[var(--color-gold)] mb-4">
                {data.reminders.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl mx-auto">
                {data.reminders.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.reminders.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left"
                  >
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center border border-[var(--color-gold)]/20">
                      <Icon className="w-8 h-8 text-[var(--color-gold)]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Our Core Promise */}
          <div className="text-center max-w-3xl mx-auto pb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[var(--color-emerald-accent)]/10 border border-[var(--color-emerald-border)] mb-8">
              <ShieldCheck className="w-10 h-10 text-[var(--color-emerald-accent)]" />
            </div>
            <h2 className="text-3xl font-black text-[var(--color-foreground)] mb-6">
              {data.promise.title}
            </h2>
            <blockquote className="text-2xl font-bold text-[var(--color-emerald-accent)] italic mb-8">
              {data.promise.quote}
            </blockquote>
            <p className="text-slate-700 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
              {data.promise.body}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
