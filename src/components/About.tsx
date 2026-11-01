"use client";

import { useSettings } from "@/lib/language";

const COPY = {
  en: {
    title: "About Noor",
    p1: "Noor is a free Quran for people who are learning: children, new Muslims, and anyone who does not speak Arabic yet. Every word can be tapped to show its meaning, its root, how to pronounce it, and a simple explanation. Every ayah can be heard, and every ayah has room for a life lesson, a story, pictures and a video.",
    p2: "The Quran text, word-by-word data, translations and recitations come from the Quran.com corpus, served through islamic.app's free API. Noor itself is open source. There are no ads, no accounts, and no tracking.",
    h2: "How the explanations are checked",
    p3: "Three kinds of text appear under each ayah, and they are not equal. The Arabic, the translation and the word-by-word meanings are verified published sources. The “Scholars' explanation” tab is classical tafsir — Ibn Kathir, As-Sa'di, Al-Muyassar, At-Tabari, Al-Qurtubi, Al-Baghawi and Ma'arif al-Qur'an — quoted with attribution; these are the works scholars themselves rely on. The lessons, stories and kid-friendly meanings are written for this app, and each one carries a status: “Reviewed by a teacher” means a qualified person has read and approved it; “Draft” means it has not been reviewed yet, and should be read with that in mind. Nothing here replaces a teacher.",
    h3: "Help build it",
    p4: "Teachers can review drafts. Artists can contribute illustrations to replace the simple themed pictures we start with (no faces of prophets, companions or angels). Parents and teachers can recommend children's videos — nothing is embedded until a person has watched and approved it. Translators can add new languages. Developers can add features. Everything you contribute stays free for everyone.",
    cta: "Contribution guide coming soon",
  },
  ar: {
    title: "عن نور",
    p1: "نور قرآن مجاني للمتعلمين: الأطفال، والمسلمين الجدد، وكل من لا يتقن العربية بعد. يمكن الضغط على أي كلمة لمعرفة معناها وجذرها ونطقها وشرح مبسّط لها. يمكن سماع كل آية، ولكل آية مكان لدرس من الحياة وقصة وصور وفيديو.",
    p2: "نص القرآن وبيانات الكلمات والترجمات والتلاوات من مدونة Quran.com عبر واجهة islamic.app المجانية. نور نفسه مفتوح المصدر. لا إعلانات، لا حسابات، لا تتبّع.",
    h2: "كيف تُراجع الشروح",
    p3: "تحت كل آية ثلاثة أنواع من النصوص، وليست سواء. النص العربي والترجمة ومعاني الكلمات مصادر منشورة موثّقة. تبويب «تفسير العلماء» تفاسير كلاسيكية — ابن كثير والسعدي والميسّر والطبري والقرطبي والبغوي ومعارف القرآن — منقولة بالعزو؛ وهي الكتب التي يعتمدها العلماء أنفسهم. أما الدروس والقصص والمعاني المبسّطة فكُتبت لهذا التطبيق، ولكلٍّ منها حالة: «راجعه معلّم» تعني أن شخصاً مؤهلاً قرأه ووافق عليه؛ «مسودة» تعني أنه لم يُراجع بعد، فاقرأه بهذا الاعتبار. لا شيء هنا يغني عن المعلّم.",
    h3: "ساهم في بنائه",
    p4: "المعلمون يراجعون المسودات. الفنانون يساهمون برسوم تحلّ محل الصور الرمزية البسيطة التي نبدأ بها (دون وجوه للأنبياء أو الصحابة أو الملائكة). الآباء والمعلمون يرشّحون فيديوهات للأطفال — ولا يُعرض أي فيديو حتى يشاهده شخص ويوافق عليه. المترجمون يضيفون لغات. المطورون يضيفون ميزات. كل ما تساهم به يبقى مجانياً للجميع.",
    cta: "دليل المساهمة قريباً",
  },
};

export function About() {
  const { lang } = useSettings();
  const c = COPY[lang];
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 leading-relaxed">
      <h1 className="text-4xl font-extrabold">{c.title}</h1>
      <p className="text-lg">{c.p1}</p>
      <p>{c.p2}</p>
      <h2 className="mt-8 text-2xl font-extrabold">{c.h2}</h2>
      <p>{c.p3}</p>
      <h2 className="mt-8 text-2xl font-extrabold" id="contribute">
        {c.h3}
      </h2>
      <p>{c.p4}</p>
      <p className="rounded-xl bg-teal-soft px-4 py-3 font-bold text-teal">{c.cta}</p>
    </article>
  );
}
