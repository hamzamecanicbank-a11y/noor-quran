// The teaching layer. Every record here is content ABOUT the Quran, written
// for children and new learners, and every record carries a review status.
// Nothing marked "draft" should be presented as settled scholarship — the UI
// labels it. When this moves to a database, keep the same shape.

export type Bilingual = { en: string; ar: string };

export type ReviewStatus = "reviewed" | "draft";

export type WordNote = {
  /** Root letters, space separated, e.g. "ر ح م" */
  root?: string;
  rootMeaning?: Bilingual;
  kid: Bilingual;
};

export type Media = {
  image?: { src: string; alt: Bilingual; credit?: string };
  video?: { url: string; title: Bilingual };
};

export type AyahLesson = {
  status: ReviewStatus;
  reviewedBy?: string;
  lesson: Bilingual;
  story?: Bilingual;
  didYouKnow?: Bilingual;
  media?: Media;
};

export type SurahIntro = {
  status: ReviewStatus;
  intro: Bilingual;
  theme: Bilingual;
};

const RAHMAH: Bilingual = {
  en: "The root ر ح م is also the word for a mother's womb — the safest, warmest place a person ever lives. That is the kind of care Allah's mercy means.",
  ar: "الجذر ر ح م هو نفسه كلمة «الرَّحِم» حيث يعيش الطفل قبل أن يولد — أكثر مكان دافئ وآمن. هكذا هي رحمة الله.",
};

export const WORD_NOTES: Record<string, WordNote> = {
  // ---- Al-Fatihah ----
  "1:1:1": {
    root: "س م و",
    rootMeaning: { en: "to be high, a name", ar: "العلوّ، الاسم" },
    kid: {
      en: "“In the name of” — we start by saying we are doing this for Allah.",
      ar: "«بسم» — نبدأ بذكر أننا نفعل هذا لله.",
    },
  },
  "1:1:2": {
    kid: {
      en: "Allah — the one true God who made everything.",
      ar: "الله — الإله الواحد الذي خلق كل شيء.",
    },
  },
  "1:1:3": {
    root: "ر ح م",
    rootMeaning: RAHMAH,
    kid: {
      en: "The Most Merciful — Allah is kind to everyone, every single day.",
      ar: "الرحمن — الله رحيم بكل أحد، كل يوم.",
    },
  },
  "1:1:4": {
    root: "ر ح م",
    rootMeaning: RAHMAH,
    kid: {
      en: "The Most Compassionate — Allah is especially gentle with people who love Him.",
      ar: "الرحيم — الله رقيق جداً مع من يحبونه.",
    },
  },
  "1:2:1": {
    root: "ح م د",
    rootMeaning: { en: "to praise, to thank", ar: "المدح والشكر" },
    kid: {
      en: "All praise — every “thank you” and every “well done” really belongs to Allah.",
      ar: "الحمد — كل «شكراً» وكل «أحسنت» في الحقيقة لله.",
    },
  },
  "1:2:2": { kid: { en: "is for Allah.", ar: "لله." } },
  "1:2:3": {
    root: "ر ب ب",
    rootMeaning: { en: "to raise, to care for, to be master of", ar: "التربية والرعاية والملك" },
    kid: {
      en: "Lord — the one who made us and looks after us, like the best caretaker.",
      ar: "ربّ — الذي خلقنا ويرعانا، أفضل راعٍ.",
    },
  },
  "1:2:4": {
    root: "ع ل م",
    rootMeaning: { en: "to know; a sign", ar: "العلم، العلامة" },
    kid: {
      en: "of all the worlds — people, animals, angels, stars, everything there is.",
      ar: "العالمين — الناس والحيوانات والملائكة والنجوم وكل شيء.",
    },
  },
  "1:3:1": { root: "ر ح م", rootMeaning: RAHMAH, kid: { en: "The Most Merciful.", ar: "الرحمن." } },
  "1:3:2": { root: "ر ح م", rootMeaning: RAHMAH, kid: { en: "The Most Compassionate.", ar: "الرحيم." } },
  "1:4:1": {
    root: "م ل ك",
    rootMeaning: { en: "to own, to rule", ar: "الملك والتصرّف" },
    kid: { en: "Master, King — the one in charge.", ar: "مالك — صاحب الأمر كله." },
  },
  "1:4:2": {
    root: "ي و م",
    rootMeaning: { en: "a day", ar: "اليوم" },
    kid: { en: "of the Day", ar: "يوم" },
  },
  "1:4:3": {
    root: "د ي ن",
    rootMeaning: { en: "to repay; religion; judgement", ar: "الجزاء، الدين، الحساب" },
    kid: {
      en: "of Judgement — the day everyone finds out how they did, and Allah is fair to all.",
      ar: "الدين — اليوم الذي يُحاسَب فيه الجميع، والله عادل مع الكل.",
    },
  },
  "1:5:1": {
    kid: { en: "You alone —", ar: "إياك — أنت وحدك" },
  },
  "1:5:2": {
    root: "ع ب د",
    rootMeaning: { en: "to serve, to worship", ar: "العبادة والخدمة" },
    kid: {
      en: "we worship — we pray to You and live for You, nobody else.",
      ar: "نعبد — نصلي لك ونعيش لك، لا لأحد غيرك.",
    },
  },
  "1:5:3": { kid: { en: "and You alone", ar: "وإياك" } },
  "1:5:4": {
    root: "ع و ن",
    rootMeaning: { en: "to help", ar: "العون والمساعدة" },
    kid: {
      en: "we ask for help — when something is hard, we ask Allah first.",
      ar: "نستعين — عندما يصعب شيء، نطلب من الله أولاً.",
    },
  },
  "1:6:1": {
    root: "ه د ي",
    rootMeaning: { en: "to guide, to show the way", ar: "الهداية والدلالة" },
    kid: { en: "Guide us —", ar: "اهدنا —" },
  },
  "1:6:2": {
    root: "ص ر ط",
    rootMeaning: { en: "a wide clear road", ar: "الطريق الواسع الواضح" },
    kid: { en: "to the path", ar: "الصراط" },
  },
  "1:6:3": {
    root: "ق و م",
    rootMeaning: { en: "to stand straight", ar: "الاستقامة" },
    kid: {
      en: "that is straight — the honest, good road that does not twist or trick you.",
      ar: "المستقيم — الطريق الصادق الطيب الذي لا يلتوي ولا يخدعك.",
    },
  },
  "1:7:1": { root: "ص ر ط", kid: { en: "the path", ar: "صراط" } },
  "1:7:2": { kid: { en: "of those", ar: "الذين" } },
  "1:7:3": {
    root: "ن ع م",
    rootMeaning: { en: "blessing, comfort", ar: "النعمة" },
    kid: {
      en: "You have blessed — the prophets and the good people before us.",
      ar: "أنعمت — الأنبياء والصالحون من قبلنا.",
    },
  },
  "1:7:4": { kid: { en: "upon them", ar: "عليهم" } },
  "1:7:5": { kid: { en: "not", ar: "غير" } },
  "1:7:6": {
    root: "غ ض ب",
    rootMeaning: { en: "anger", ar: "الغضب" },
    kid: {
      en: "those who earned anger — people who knew what was right and still chose wrong.",
      ar: "المغضوب — من عرفوا الحق واختاروا الخطأ.",
    },
  },
  "1:7:7": { kid: { en: "upon them", ar: "عليهم" } },
  "1:7:8": { kid: { en: "nor", ar: "ولا" } },
  "1:7:9": {
    root: "ض ل ل",
    rootMeaning: { en: "to lose the way", ar: "الضلال والتيه" },
    kid: {
      en: "those who are lost — people who wandered off the road without knowing it.",
      ar: "الضالين — من ضلّوا الطريق دون أن يعرفوا.",
    },
  },
  // ---- Al-Ikhlas ----
  "112:1:1": { root: "ق و ل", kid: { en: "Say —", ar: "قل —" } },
  "112:1:2": { kid: { en: "He is", ar: "هو" } },
  "112:1:3": { kid: { en: "Allah,", ar: "الله" } },
  "112:1:4": {
    root: "و ح د",
    rootMeaning: { en: "one, single", ar: "الواحد" },
    kid: { en: "One — there is only one God, no partners, no helpers.", ar: "أحد — إله واحد فقط، لا شريك له." },
  },
  "112:2:1": { kid: { en: "Allah", ar: "الله" } },
  "112:2:2": {
    root: "ص م د",
    rootMeaning: { en: "the one everyone depends on", ar: "الذي يُقصد في الحوائج" },
    kid: {
      en: "the Eternal Refuge — everyone needs Him; He needs no one.",
      ar: "الصمد — الكل يحتاجه، وهو لا يحتاج أحداً.",
    },
  },
  "112:3:1": { kid: { en: "He did not", ar: "لم" } },
  "112:3:2": { root: "و ل د", kid: { en: "have children", ar: "يلد" } },
  "112:3:3": { kid: { en: "nor was He", ar: "ولم" } },
  "112:3:4": { root: "و ل د", kid: { en: "born.", ar: "يولد" } },
  "112:4:1": { kid: { en: "And there is not", ar: "ولم" } },
  "112:4:2": { root: "ك و ن", kid: { en: "(is)", ar: "يكن" } },
  "112:4:3": { kid: { en: "for Him", ar: "له" } },
  "112:4:4": {
    root: "ك ف أ",
    rootMeaning: { en: "equal, match", ar: "المثيل والنظير" },
    kid: { en: "anything equal — nothing and nobody is like Allah.", ar: "كفواً — لا شيء ولا أحد يشبه الله." },
  },
  "112:4:5": { root: "و ح د", kid: { en: "anyone.", ar: "أحد." } },
};

export const AYAH_LESSONS: Record<string, AyahLesson> = {
  "1:1": {
    status: "draft",
    lesson: {
      en: "Start everything with Allah's name. Before you eat, before a test, before you help a friend — say Bismillah. It is a tiny habit that turns ordinary moments into something special.",
      ar: "ابدأ كل شيء باسم الله. قبل الأكل، قبل الامتحان، قبل مساعدة صديق — قل بسم الله. عادة صغيرة تجعل اللحظات العادية مميزة.",
    },
    story: {
      en: "Imagine a key that opens every door in a huge house. Bismillah is like that key: Muslims say it when they wake up, when they start a journey, even when they open a book. The Prophet Muhammad ﷺ taught that beginning with Allah's name brings blessing to what we do.",
      ar: "تخيل مفتاحاً يفتح كل أبواب بيت كبير. «بسم الله» مثل هذا المفتاح: يقولها المسلم عند الاستيقاظ، وعند السفر، وحتى عند فتح كتاب. علّمنا النبي ﷺ أن البدء باسم الله يجلب البركة فيما نفعل.",
    },
    didYouKnow: {
      en: "This line appears at the start of 113 of the 114 surahs of the Quran.",
      ar: "تأتي هذه الآية في بداية 113 سورة من 114 سورة في القرآن.",
    },
  },
  "1:2": {
    status: "draft",
    lesson: {
      en: "Thank Allah for everything — big and small. Your eyes, your breakfast, your family, the rain. Grateful hearts are happy hearts.",
      ar: "اشكر الله على كل شيء، الكبير والصغير. عيناك، فطورك، عائلتك، المطر. القلب الشاكر قلب سعيد.",
    },
    story: {
      en: "A boy once counted the things he was thankful for before bed: his warm blanket, his sister's jokes, the taste of oranges. He fell asleep smiling. “Alhamdulillah” is that feeling, said out loud.",
      ar: "عدّ طفل ذات ليلة الأشياء التي يشكر الله عليها: غطاؤه الدافئ، ضحكات أخته، طعم البرتقال. نام مبتسماً. «الحمد لله» هو هذا الشعور عندما نقوله بصوت مسموع.",
    },
  },
  "1:3": {
    status: "draft",
    lesson: {
      en: "Allah's mercy is bigger than any mistake. When you do something wrong, you can always say sorry to Him — He loves to forgive.",
      ar: "رحمة الله أكبر من أي خطأ. عندما تخطئ، يمكنك دائماً أن تعتذر لله — فهو يحب أن يغفر.",
    },
  },
  "1:4": {
    status: "draft",
    lesson: {
      en: "One day everything will be made fair. Nobody gets away with being unkind, and nobody's good deed is ever forgotten — not even a smile.",
      ar: "سيأتي يوم يكون فيه كل شيء عادلاً. لا يفلت أحد بظلمه، ولا يُنسى عمل طيب أبداً — ولا حتى ابتسامة.",
    },
  },
  "1:5": {
    status: "draft",
    lesson: {
      en: "When something is hard — a test, a fear, a fight with a friend — ask Allah for help first. You are never doing it alone.",
      ar: "عندما يصعب شيء — امتحان، خوف، خلاف مع صديق — اطلب العون من الله أولاً. لست وحدك أبداً.",
    },
    didYouKnow: {
      en: "The word for “we” is used here, not “I”. Muslims pray this together, as one big family all over the world.",
      ar: "الآية تقول «نعبد» و«نستعين» بصيغة الجماعة، لا المفرد. المسلمون يقرؤونها معاً كعائلة واحدة كبيرة حول العالم.",
    },
  },
  "1:6": {
    status: "draft",
    lesson: {
      en: "Every day has many little roads: tell the truth or hide it, share or keep, be gentle or be rough. Ask Allah to show you the straight one — and then walk on it.",
      ar: "في كل يوم طرق صغيرة كثيرة: تقول الحق أو تخفيه، تشارك أو تمنع، تلين أو تقسو. اطلب من الله أن يريك الطريق المستقيم — ثم امشِ فيه.",
    },
  },
  "1:7": {
    status: "draft",
    lesson: {
      en: "Good company matters. Walk with people who are kind and honest, and you will become like them.",
      ar: "الصحبة الطيبة مهمة. امشِ مع الطيبين الصادقين، تصبح مثلهم.",
    },
  },
  "112:1": {
    status: "draft",
    lesson: {
      en: "There is one God, and He made everything. The sun, the sea, you — all from one Creator. That is the first and biggest truth in Islam.",
      ar: "الله واحد، وهو خلق كل شيء. الشمس والبحر وأنت — كلكم من خالق واحد. هذه أول وأكبر حقيقة في الإسلام.",
    },
    didYouKnow: {
      en: "The Prophet ﷺ said this short surah is worth a third of the Quran, because it teaches who Allah is.",
      ar: "قال النبي ﷺ إن هذه السورة القصيرة تعدل ثلث القرآن، لأنها تعلّمنا من هو الله.",
    },
  },
};

export const SURAH_INTROS: Record<number, SurahIntro> = {
  1: {
    status: "draft",
    intro: {
      en: "Al-Fatihah means “The Opening”. It is the first surah in the Quran and the one Muslims say in every single prayer — at least 17 times a day. It is a conversation with Allah: we praise Him, we promise to worship only Him, and we ask Him to guide us.",
      ar: "الفاتحة هي أول سورة في القرآن، ويقرؤها المسلم في كل صلاة — 17 مرة في اليوم على الأقل. هي حوار مع الله: نحمده، ونعده أن نعبده وحده، ونطلب منه أن يهدينا.",
    },
    theme: { en: "Praise, trust, and asking for guidance", ar: "الحمد والتوكّل وطلب الهداية" },
  },
  112: {
    status: "draft",
    intro: {
      en: "Al-Ikhlas means “Sincerity” or “Purity”. In just four short lines it explains who Allah is: One, needed by all, with no parents, no children, and nothing like Him.",
      ar: "الإخلاص سورة قصيرة من أربع آيات تشرح من هو الله: واحد، يحتاجه الجميع، لا والد له ولا ولد، ولا شيء يشبهه.",
    },
    theme: { en: "Who Allah is", ar: "من هو الله" },
  },
};
