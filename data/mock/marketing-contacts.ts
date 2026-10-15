import type { Locale } from "@/lib/i18n";

export type MarketingContact = {
  name: string;
  role: string;
  language: string;
  phone: string;
  phoneHref: string;
  email: string;
};

const contacts: MarketingContact[] = [
  {
    name: "Oki Haryanto",
    role: "In-House Marketing Manager (Garment & Uniform Division)",
    language: "Indonesian",
    phone: "(+62) 822-1018-0344",
    phoneHref: "+6282210180344",
    email: "oki.haryanto@asietex.com",
  },
  {
    name: "Dias Riski Yandi",
    role: "Group A Marketing Manager (Motif & Voile)",
    language: "Indonesian",
    phone: "(+62) 857-1755-5253",
    phoneHref: "+6285717555253",
    email: "dias.riski@asietex.com",
  },
  {
    name: "Yudi Prahmana",
    role: "Group B Marketing Manager (Cotton Spdx Enzym & Striped)",
    language: "Indonesian",
    phone: "(+62) 857-8094-8007",
    phoneHref: "+6285780948007",
    email: "yudhi.prahmana@asietex.com",
  },
  {
    name: "Yuni Elpiyanti",
    role: "Group C Marketing Manager (Woven AJL & WJL)",
    language: "Indonesian, English",
    phone: "(+62) 852-1677-1919",
    phoneHref: "+6285216771919",
    email: "yuni.elpiyanti@asietex.com",
  },
  {
    name: "Nurdjanah",
    role: "Group D Marketing Manager (Woven WJL Bellano & Velvet)",
    language: "Indonesian, English",
    phone: "(+62) 822-9700-4135",
    phoneHref: "+6282297004135",
    email: "nurdjanah@asietex.com",
  },
  {
    name: "Hendra Wijaya",
    role: "Marketing Manager (Printing)",
    language: "Indonesian, English",
    phone: "(+62) 818-0886-2111",
    phoneHref: "+6281808862111",
    email: "hendra.wijaya@asietex.com",
  },
  {
    name: "Nia Komalasari",
    role: "Fabric Marketing",
    language: "Indonesian",
    phone: "(+62) 822-1902-4589",
    phoneHref: "+6282219024589",
    email: "nia.komalasari@asietex.com",
  },
  {
    name: "Nadia Hermawan",
    role: "Export Import",
    language: "Indonesian, English",
    phone: "(+62) 895-3933-75890",
    phoneHref: "+62895393375890",
    email: "nadia.hernawan@asietex.com",
  },
  {
    name: "Ajeng Rena Sari",
    role: "Garment Marketing",
    language: "Indonesian",
    phone: "(+62) 822-0067-10849",
    phoneHref: "+62822006710849",
    email: "marketing@ptsgu.co.id",
  },
  {
    name: "Ali Burhan",
    role: "Italy Division Manager",
    language: "Indonesian, English, Mandarin, Italian",
    phone: "(+39) 388-376-6525",
    phoneHref: "+393883766525",
    email: "aliburhan_79@yahoo.com",
  },
  {
    name: "Lucia Wang",
    role: "Italy Office Manager",
    language: "English, Mandarin, Italian",
    phone: "(+39) 327-341-7660",
    phoneHref: "+393273417660",
    email: "luci.wang88@yahoo.com",
  },
  {
    name: "Priscillia Boissenin",
    role: "France Division Manager",
    language: "Indonesian, English, Mandarin, French",
    phone: "(+33) 630-864-465",
    phoneHref: "+33630864465",
    email: "prisboissenin@outlook.fr",
  },
  {
    name: "Gabriela Maia / Bruno",
    role: "Portugal Fabric, Yarn & Fiber Marketing",
    language: "Portuguese, English",
    phone: "(+351) 913-296-231",
    phoneHref: "+351913296231",
    email: "comercial@atlantidragao.pt",
  },
  {
    name: "Arif Kurnia",
    role: "Marketing Lace / Brocade",
    language: "Indonesian",
    phone: "(+62) 813-2303-3433",
    phoneHref: "+6281323033433",
    email: "arifkurnia@asietex.com",
  },
  {
    name: "Bambang Sihono",
    role: "Customer Service/Complaints",
    language: "Indonesian, English, Mandarin",
    phone: "",
    phoneHref: "",
    email: "bambangsihono@hotmail.com",
  },
];

export const marketingContactsByLocale: Record<Locale, MarketingContact[]> = {
  en: contacts,
  id: contacts,
  pt: contacts,
};
