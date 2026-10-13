export type AboutContent = {
  hero: {
    label: string;
    imageAlt: string;
    intro: string[];
    facts: { value: string; label: string }[];
  };
  history: {
    label: string;
    title: string;
    intro: string;
    milestones: { year: string; title: string; description: string }[];
  };
  purpose: {
    visionLabel: string;
    vision: string;
    missionLabel: string;
    mission: string;
  };
  factories: {
    label: string;
    title: string;
    imageAlt: string;
    locations: {
      name: string;
      details: { label: string; value: string }[];
    }[];
  };
  affiliates: {
    label: string;
    title: string;
    companies: {
      name: string;
      details: { label: string; value: string }[];
    }[];
  };
  network: {
    label: string;
    title: string;
    intro: string;
    imageAlt: string;
    regions: { name: string; markets: string[] }[];
    mixTitle: string;
    mix: { label: string; value: number }[];
    note: string;
  };
  cta: {
    label: string;
    title: string;
    body: string;
    contact: string;
    products: string;
  };
};

export const ABOUT_CONTENT: Record<"en" | "id" | "pt", AboutContent> = {
  en: {
    hero: {
      label: "About Asietex",
      imageAlt: "Asietex textile manufacturing campus in Indonesia",
      intro: [
        "Asietex has been a constant and reassuring presence throughout our business history. Our origins can be traced back to 1985, and we have since evolved into a recognized presence in domestic and international markets.",
        "As an integrated textile company, Asietex manufactures products from yarn to fabric. Cotton and rayon fabrics account for 85% of our fabric topline, with polyester making up the balance.",
        "Our factories combine sophisticated machinery with Asian and European technology, supported by a well-trained workforce. This gives us a competitive advantage and helps us use resources effectively and efficiently.",
        "We are proud to deliver a broad range of high-quality products that meet the needs of the global market.",
      ],
      facts: [
        { value: "1985", label: "The year our textile journey began" },
        { value: "3", label: "Production sites across Java" },
        { value: "85%", label: "Cotton and rayon in the fabric mix" },
      ],
    },
    history: {
      label: "History & milestones",
      title: "Four decades of building an integrated textile operation.",
      intro:
        "From our first circular knitting machines to a broader production and export network, each milestone added capability, reach, or continuity to the business.",
      milestones: [
        {
          year: "1985",
          title: "Karawaci knitting factory",
          description:
            "Opened our first knitting factory in Karawaci, Tangerang, with 40 circular knitting machines.",
        },
        {
          year: "1987",
          title: "Bandung expansion",
          description:
            "Added a second knitting factory in Bandung, West Java, with another 40 circular knitting machines.",
        },
        {
          year: "2002",
          title: "Integrated Cikampek factory",
          description:
            "Consolidated the Karawaci and Bandung knitting operations into an integrated factory in Cikampek, Karawang.",
        },
        {
          year: "2004",
          title: "First European market",
          description:
            "Expanded into Europe through France, followed by Italy in 2005.",
        },
        {
          year: "2007",
          title: "Spinning investment",
          description:
            "Installed a complete spinning line for Rayon OE 30–40s yarn.",
        },
        {
          year: "2009",
          title: "Wider export reach",
          description:
            "Started exporting fabrics to Sri Lanka, Vietnam, Cambodia, the United States, and China.",
        },
        {
          year: "2011",
          title: "Jakarta head office",
          description:
            "Opened an owned head office building on Jalan Biak No. 60 in Jakarta.",
        },
        {
          year: "2016",
          title: "Cikande knitting factory",
          description: "Established a knitting factory in Cikande, Serang.",
        },
        {
          year: "2017",
          title: "New Cikande spinning line",
          description: "Added a new spinning line at the Cikande factory.",
        },
        {
          year: "2017",
          title: "Garment production",
          description: "Started garment production lines in Karawaci, Banten.",
        },
        {
          year: "2017",
          title: "Portugal and Brazil",
          description: "Expanded the market network to Portugal and Brazil.",
        },
        {
          year: "2017",
          title: "Cideng service office",
          description:
            "Opened a new office tower on Cideng Timur No. 36 in Jakarta to strengthen customer service.",
        },
        {
          year: "2020",
          title: "Pemalang knitting factory",
          description:
            "Established a new knitting factory in Pemalang, Central Java.",
        },
      ],
    },
    purpose: {
      visionLabel: "Our vision",
      vision:
        "To become the innovative partner and delivering one stop shopping for a range of textile products.",
      missionLabel: "Our mission",
      mission:
        "To combine technology, innovation, experience, skills and responsibility to ensures customer satisfaction.",
    },
    factories: {
      label: "FACTORY",
      title: "Factories",
      imageAlt: "Asietex factory buildings reflected in the surrounding water",
      locations: [
        {
          name: "MAIN FACTORY",
          details: [
            { label: "Company", value: "PT. Asietex Sinar Indopratama" },
            {
              label: "Address",
              value:
                "Jl. Akses Interchange Dawuan No. 2, Cikampek Pusaka, Cikampek, Karawang, Jawa Barat 41373 - Indonesia",
            },
            { label: "Established", value: "2002" },
            { label: "Size Area", value: "± 200.000 Sqm" },
            { label: "Total Employee", value: "Around 2.000" },
            {
              label: "Capacity",
              value:
                "100 tons/day (Knitted Fabric), 90 tons/day (Dyed Fabric), 65.000m/day (Printed Fabric) and 100 tons/day (Finished Fabric)",
            },
            {
              label: "Major Products",
              value:
                "Cotton, Viscose, Polyester/Rayon, Polyester/Cotton, Nylon, Polyester Spandex, Cotton Spandex, Polar Fleece, Micro Fleece, Velour, Velvet, etc",
            },
            {
              label: "Main Export Buyer",
              value:
                "TARGET, W-MART, H&M, KHOL’S, Mango, Zara, Old Navy, Muji, Adidas, Uniqlo",
            },
            {
              label: "Market",
              value: "Local 65%, Asia 10%, Europe 15%, USA 10%",
            },
          ],
        },
        {
          name: "CIKANDE FACTORY",
          details: [
            { label: "Company", value: "PT. Asietex Sinar Indopratama" },
            {
              label: "Address",
              value:
                "Jl. Raya Cikande - Rangkas Bitung KM 5, Desa Kareo, Kec. Jawilan, Kab. Serang, Banten 42177 - Indonesia",
            },
            { label: "Established", value: "2016" },
            { label: "Size Area", value: "± 300.000 Sqm" },
            { label: "Total Employee", value: "Around 1.000" },
            {
              label: "Capacity",
              value:
                "60 tons/day (Spinning), 25 tons/day (Weaving) and 35 tons/day (Knitting)",
            },
            {
              label: "Products - Greige",
              value:
                "Velour, Polar Fleece, Micro Fleece, Single Jersey, Computer Jaquard, Pique, Rib, Interlock, etc.",
            },
            {
              label: "Products - Yarn",
              value:
                "Cotton, Viscose, Polyester/Rayon, Polyester/Cotton, Nylon, etc.",
            },
          ],
        },
        {
          name: "PEMALANG FACTORY",
          details: [
            { label: "Company", value: "PT. Asietex Sinar Indopratama" },
            {
              label: "Address",
              value:
                "Jl. Pemalang Randu Dongkal KM.11 RT.005/RW.001 No.158, Desa Lenggerong, Kec. Bantar Bolang, Kabupaten Pemalang, Jawa Tengah 52352 - Indonesia",
            },
            { label: "Established", value: "2020" },
            { label: "Size Area", value: "± 7,500 Sqm" },
            { label: "Total Employee", value: "Around 100" },
            { label: "Capacity", value: "12 ton/day" },
            {
              label: "Major Products",
              value: "Jersey, Zacquard, Mini Jack, Ponte, Rib",
            },
            { label: "Market", value: "Domestic 100%" },
          ],
        },
      ],
    },
    affiliates: {
      label: "AFFILIATE COMPANY",
      title: "Affiliate Company",
      companies: [
        {
          name: "XiongYing Knitting And Dyeing (Changshu) CO.,LTd",
          details: [
            {
              label: "Company",
              value: "XiongYing Knitting And Dyeing (Changshu) CO.,LTd",
            },
            {
              label: "Address",
              value: "Guli town ChangShu JiangSu China, Zip Code : 215533",
            },
            { label: "Established", value: "1994" },
            { label: "Size Area", value: "± 200,000 Sqm" },
            { label: "Total Employee", value: "Around 2,000 employee" },
            { label: "Revenue", value: "94 million USD per year" },
            { label: "Capacity", value: "Around 1,800 tons per month" },
            {
              label: "Products",
              value:
                "Velour, Polar Fleece, Micro Fleece, Single Jersey, Computer Jaquard, Pique, Rib, Interlock, etc",
            },
          ],
        },
        {
          name: "PT. Annie Anna Sister Garmindo Utama",
          details: [
            {
              label: "Company",
              value: "PT. Annie Anna Sister Garmindo Utama",
            },
            {
              label: "Address",
              value:
                "Jl. Pemalang Randu Dongkal KM 11, RT.005/RW.001 No.158,\nDesa Lenggerong, Kec. Bantar Bolang, Kabupaten Pemalang\nJawa Tengah 52352 - Indonesia",
            },
            { label: "Established", value: "2020" },
            { label: "Size Area", value: "± 9,720 Sqm" },
            { label: "Total Employee", value: "Around 500 employee" },
            { label: "Capacity", value: "100,000 - 150,000 pcs/month" },
            {
              label: "Major Products",
              value: "Garment (Mens, Ladies, Kids)",
            },
            { label: "Market", value: "Domestic and Export" },
          ],
        },
      ],
    },
    network: {
      label: "International market network",
      title:
        "A production base in Indonesia, connected to buyers across three continents.",
      intro:
        "Our market development began in Europe and expanded through Asia and the Americas. These are the destinations named in Asietex’s company history and operating profile.",
      imageAlt:
        "World map highlighting Asietex markets across Asia, Europe, and the Americas",
      regions: [
        {
          name: "Asia",
          markets: [
            "Indonesia",
            "Sri Lanka",
            "Vietnam",
            "Cambodia",
            "China",
            "Japan",
            "South Korea",
          ],
        },
        { name: "Europe", markets: ["France", "Italy", "Portugal"] },
        { name: "Americas", markets: ["United States", "Brazil"] },
      ],
      mixTitle: "Main factory market mix",
      mix: [
        { label: "Domestic", value: 65 },
        { label: "Europe", value: 15 },
        { label: "Asia", value: 10 },
        { label: "United States", value: 10 },
      ],
      note: "Market shares reflect the operating profile published for the main Cikampek factory.",
    },
    cta: {
      label: "Start a conversation",
      title: "Connect your next textile program to our production network.",
      body: "Talk with our team about products, capacity, samples, or the right starting point for your requirements.",
      contact: "Talk to our team",
      products: "Explore products",
    },
  },
  id: {
    hero: {
      label: "Tentang Asietex",
      imageAlt: "Kawasan manufaktur tekstil Asietex di Indonesia",
      intro: [
        "Asietex selalu hadir secara konsisten dan meyakinkan sepanjang sejarah bisnis kami. Berawal pada 1985, kami berkembang menjadi perusahaan yang dikenal di pasar domestik dan internasional.",
        "Sebagai perusahaan tekstil terintegrasi, Asietex memproduksi berbagai produk mulai dari benang hingga kain. Sebanyak 85% produksi kain kami berbahan katun dan rayon, sedangkan sisanya berbahan polyester.",
        "Pabrik kami menggunakan mesin canggih dengan kombinasi teknologi Asia dan Eropa, didukung tenaga kerja yang terlatih. Kombinasi ini memberi kami keunggulan kompetitif dan membantu menggunakan sumber daya secara efektif dan efisien.",
        "Kami bangga menyediakan beragam produk berkualitas tinggi untuk memenuhi kebutuhan pasar global.",
      ],
      facts: [
        { value: "1985", label: "Awal perjalanan tekstil kami" },
        { value: "3", label: "Lokasi produksi di Pulau Jawa" },
        { value: "85%", label: "Katun dan rayon dalam komposisi kain" },
      ],
    },
    history: {
      label: "Sejarah & milestone",
      title: "Empat dekade membangun operasi tekstil terintegrasi.",
      intro:
        "Dari mesin rajut bundar pertama hingga jaringan produksi dan ekspor yang lebih luas, setiap milestone menambah kapabilitas, jangkauan, atau kesinambungan bisnis.",
      milestones: [
        {
          year: "1985",
          title: "Pabrik rajut Karawaci",
          description:
            "Membuka pabrik rajut pertama di Karawaci, Tangerang, dengan 40 mesin circular knit.",
        },
        {
          year: "1987",
          title: "Ekspansi Bandung",
          description:
            "Menambah pabrik rajut kedua di Bandung, Jawa Barat, dengan 40 mesin circular knit lainnya.",
        },
        {
          year: "2002",
          title: "Pabrik terintegrasi Cikampek",
          description:
            "Menggabungkan operasi rajut Karawaci dan Bandung ke dalam satu pabrik terintegrasi di Cikampek, Karawang.",
        },
        {
          year: "2004",
          title: "Pasar Eropa pertama",
          description:
            "Memasuki pasar Eropa melalui Prancis, dilanjutkan dengan Italia pada 2005.",
        },
        {
          year: "2007",
          title: "Investasi spinning",
          description:
            "Memasang satu lini lengkap mesin spinning untuk memproduksi benang Rayon OE 30–40s.",
        },
        {
          year: "2009",
          title: "Jangkauan ekspor lebih luas",
          description:
            "Mulai mengekspor kain ke Sri Lanka, Vietnam, Kamboja, Amerika Serikat, dan Tiongkok.",
        },
        {
          year: "2011",
          title: "Kantor pusat Jakarta",
          description:
            "Membuka gedung kantor milik sendiri di Jalan Biak No. 60, Jakarta.",
        },
        {
          year: "2016",
          title: "Pabrik rajut Cikande",
          description: "Mendirikan pabrik rajut di Cikande, Serang.",
        },
        {
          year: "2017",
          title: "Lini spinning baru di Cikande",
          description: "Menambah lini spinning baru di pabrik Cikande.",
        },
        {
          year: "2017",
          title: "Produksi garment",
          description: "Memulai lini produksi garment di Karawaci, Banten.",
        },
        {
          year: "2017",
          title: "Portugal dan Brasil",
          description: "Memperluas jaringan pasar ke Portugal dan Brasil.",
        },
        {
          year: "2017",
          title: "Kantor layanan Cideng",
          description:
            "Membuka menara kantor baru di Cideng Timur No. 36, Jakarta, untuk memperkuat layanan pelanggan.",
        },
        {
          year: "2020",
          title: "Pabrik rajut Pemalang",
          description: "Mendirikan pabrik rajut baru di Pemalang, Jawa Tengah.",
        },
      ],
    },
    purpose: {
      visionLabel: "Visi kami",
      vision:
        "Menjadi mitra inovatif yang menyediakan solusi terpadu untuk berbagai kebutuhan produk tekstil.",
      missionLabel: "Misi kami",
      mission:
        "Memadukan teknologi, inovasi, pengalaman, keterampilan, dan tanggung jawab demi menjamin kepuasan pelanggan.",
    },
    factories: {
      label: "PABRIK",
      title: "Pabrik",
      imageAlt:
        "Bangunan pabrik Asietex dengan pantulan pada kolam di sekitarnya",
      locations: [
        {
          name: "PABRIK UTAMA",
          details: [
            { label: "Perusahaan", value: "PT. Asietex Sinar Indopratama" },
            {
              label: "Alamat",
              value:
                "Jl. Akses Interchange Dawuan No. 2, Cikampek Pusaka, Cikampek, Karawang, Jawa Barat 41373 - Indonesia",
            },
            { label: "Didirikan", value: "2002" },
            { label: "Luas Area", value: "± 200.000 m²" },
            { label: "Jumlah Karyawan", value: "Sekitar 2.000" },
            {
              label: "Kapasitas",
              value:
                "100 ton/hari (Kain Rajut), 90 ton/hari (Kain Celup), 65.000 m/hari (Kain Cetak), dan 100 ton/hari (Kain Jadi)",
            },
            {
              label: "Produk Utama",
              value:
                "Katun, Viscose, Poliester/Rayon, Poliester/Katun, Nilon, Poliester Spandeks, Katun Spandeks, Polar Fleece, Micro Fleece, Velour, Velvet, dan lain-lain",
            },
            {
              label: "Pembeli Ekspor Utama",
              value:
                "TARGET, W-MART, H&M, KHOL’S, Mango, Zara, Old Navy, Muji, Adidas, Uniqlo",
            },
            {
              label: "Pasar",
              value: "Lokal 65%, Asia 10%, Eropa 15%, Amerika Serikat 10%",
            },
          ],
        },
        {
          name: "PABRIK CIKANDE",
          details: [
            { label: "Perusahaan", value: "PT. Asietex Sinar Indopratama" },
            {
              label: "Alamat",
              value:
                "Jl. Raya Cikande - Rangkas Bitung KM 5, Desa Kareo, Kec. Jawilan, Kab. Serang, Banten 42177 - Indonesia",
            },
            { label: "Didirikan", value: "2016" },
            { label: "Luas Area", value: "± 300.000 m²" },
            { label: "Jumlah Karyawan", value: "Sekitar 1.000" },
            {
              label: "Kapasitas",
              value:
                "60 ton/hari (Pemintalan), 25 ton/hari (Penenunan), dan 35 ton/hari (Perajutan)",
            },
            {
              label: "Produk - Greige",
              value:
                "Velour, Polar Fleece, Micro Fleece, Single Jersey, Computer Jaquard, Pique, Rib, Interlock, dan lain-lain.",
            },
            {
              label: "Produk - Benang",
              value:
                "Katun, Viscose, Poliester/Rayon, Poliester/Katun, Nilon, dan lain-lain.",
            },
          ],
        },
        {
          name: "PABRIK PEMALANG",
          details: [
            { label: "Perusahaan", value: "PT. Asietex Sinar Indopratama" },
            {
              label: "Alamat",
              value:
                "Jl. Pemalang Randu Dongkal KM.11 RT.005/RW.001 No.158, Desa Lenggerong, Kec. Bantar Bolang, Kabupaten Pemalang, Jawa Tengah 52352 - Indonesia",
            },
            { label: "Didirikan", value: "2020" },
            { label: "Luas Area", value: "± 7.500 m²" },
            { label: "Jumlah Karyawan", value: "Sekitar 100" },
            { label: "Kapasitas", value: "12 ton/hari" },
            {
              label: "Produk Utama",
              value: "Jersey, Zacquard, Mini Jack, Ponte, Rib",
            },
            { label: "Pasar", value: "Domestik 100%" },
          ],
        },
      ],
    },
    affiliates: {
      label: "PERUSAHAAN AFILIASI",
      title: "Perusahaan Afiliasi",
      companies: [
        {
          name: "XiongYing Knitting And Dyeing (Changshu) CO.,LTd",
          details: [
            {
              label: "Perusahaan",
              value: "XiongYing Knitting And Dyeing (Changshu) CO.,LTd",
            },
            {
              label: "Alamat",
              value: "Kota Guli, ChangShu, JiangSu, Tiongkok, Kode Pos: 215533",
            },
            { label: "Didirikan", value: "1994" },
            { label: "Luas Area", value: "± 200.000 m²" },
            { label: "Jumlah Karyawan", value: "Sekitar 2.000 karyawan" },
            { label: "Pendapatan", value: "94 juta USD per tahun" },
            { label: "Kapasitas", value: "Sekitar 1.800 ton per bulan" },
            {
              label: "Produk",
              value:
                "Velour, Polar Fleece, Micro Fleece, Single Jersey, Computer Jaquard, Pique, Rib, Interlock, dan lain-lain",
            },
          ],
        },
        {
          name: "PT. Annie Anna Sister Garmindo Utama",
          details: [
            {
              label: "Perusahaan",
              value: "PT. Annie Anna Sister Garmindo Utama",
            },
            {
              label: "Alamat",
              value:
                "Jl. Pemalang Randu Dongkal KM 11, RT.005/RW.001 No.158,\nDesa Lenggerong, Kec. Bantar Bolang, Kabupaten Pemalang\nJawa Tengah 52352 - Indonesia",
            },
            { label: "Didirikan", value: "2020" },
            { label: "Luas Area", value: "± 9.720 m²" },
            { label: "Jumlah Karyawan", value: "Sekitar 500 karyawan" },
            { label: "Kapasitas", value: "100.000 - 150.000 potong/bulan" },
            {
              label: "Produk Utama",
              value: "Garmen (Pria, Wanita, Anak-anak)",
            },
            { label: "Pasar", value: "Domestik dan Ekspor" },
          ],
        },
      ],
    },
    network: {
      label: "Jaringan pasar internasional",
      title:
        "Basis produksi di Indonesia yang terhubung dengan buyer di tiga benua.",
      intro:
        "Pengembangan pasar kami bermula di Eropa lalu meluas ke Asia dan Amerika. Destinasi berikut tercatat dalam sejarah perusahaan dan profil operasi Asietex.",
      imageAlt:
        "Peta dunia yang menyoroti pasar Asietex di Asia, Eropa, dan Amerika",
      regions: [
        {
          name: "Asia",
          markets: ["Indonesia", "Sri Lanka", "Vietnam", "Kamboja", "Tiongkok"],
        },
        { name: "Eropa", markets: ["Prancis", "Italia", "Portugal"] },
        { name: "Amerika", markets: ["Amerika Serikat", "Brasil"] },
      ],
      mixTitle: "Komposisi pasar pabrik utama",
      mix: [
        { label: "Domestik", value: 65 },
        { label: "Eropa", value: 15 },
        { label: "Asia", value: 10 },
        { label: "Amerika Serikat", value: 10 },
      ],
      note: "Porsi pasar mengikuti profil operasi yang dipublikasikan untuk pabrik utama Cikampek.",
    },
    cta: {
      label: "Mulai percakapan",
      title:
        "Hubungkan program tekstil Anda berikutnya dengan jaringan produksi kami.",
      body: "Diskusikan produk, kapasitas, sampel, atau titik awal yang tepat untuk kebutuhan Anda bersama tim kami.",
      contact: "Hubungi tim kami",
      products: "Jelajahi produk",
    },
  },
  pt: {
    hero: {
      label: "Sobre a Asietex",
      imageAlt: "Complexo de produção têxtil da Asietex na Indonésia",
      intro: [
        "A Asietex tem sido uma presença constante e segura ao longo da nossa história empresarial. As nossas origens remontam a 1985 e, desde então, evoluímos para uma presença reconhecida nos mercados nacional e internacional.",
        "Como empresa têxtil integrada, a Asietex fabrica produtos desde o fio até ao tecido. Os tecidos de algodão e rayon representam 85% do nosso volume de tecidos, sendo o restante composto por poliéster.",
        "As nossas fábricas combinam maquinaria sofisticada com tecnologia asiática e europeia, apoiadas por uma equipa bem formada. Esta combinação dá-nos uma vantagem competitiva e ajuda-nos a utilizar os recursos de forma eficaz e eficiente.",
        "Temos orgulho em fornecer uma ampla gama de produtos de alta qualidade para responder às necessidades do mercado global.",
      ],
      facts: [
        { value: "1985", label: "O início do nosso percurso têxtil" },
        { value: "3", label: "Unidades de produção na ilha de Java" },
        { value: "85%", label: "Algodão e rayon no mix de tecidos" },
      ],
    },
    history: {
      label: "História e marcos",
      title: "Quatro décadas a construir uma operação têxtil integrada.",
      intro:
        "Das primeiras máquinas circulares de malharia a uma rede mais ampla de produção e exportação, cada marco acrescentou capacidade, alcance ou continuidade ao negócio.",
      milestones: [
        {
          year: "1985",
          title: "Fábrica de malharia de Karawaci",
          description:
            "Abrimos a primeira fábrica de malharia em Karawaci, Tangerang, com 40 máquinas circulares.",
        },
        {
          year: "1987",
          title: "Expansão para Bandung",
          description:
            "Acrescentámos uma segunda fábrica de malharia em Bandung, Java Ocidental, com mais 40 máquinas circulares.",
        },
        {
          year: "2002",
          title: "Fábrica integrada de Cikampek",
          description:
            "Consolidámos as operações de Karawaci e Bandung numa fábrica integrada em Cikampek, Karawang.",
        },
        {
          year: "2004",
          title: "Primeiro mercado europeu",
          description:
            "Entrámos na Europa através de França, seguindo-se Itália em 2005.",
        },
        {
          year: "2007",
          title: "Investimento em fiação",
          description:
            "Instalámos uma linha completa de fiação para fio Rayon OE 30–40s.",
        },
        {
          year: "2009",
          title: "Maior alcance de exportação",
          description:
            "Começámos a exportar tecidos para o Sri Lanka, Vietname, Camboja, Estados Unidos e China.",
        },
        {
          year: "2011",
          title: "Sede em Jacarta",
          description:
            "Abrimos um edifício próprio de escritórios na Jalan Biak No. 60, em Jacarta.",
        },
        {
          year: "2016",
          title: "Fábrica de malharia de Cikande",
          description: "Criámos uma fábrica de malharia em Cikande, Serang.",
        },
        {
          year: "2017",
          title: "Nova linha de fiação em Cikande",
          description:
            "Acrescentámos uma nova linha de fiação à fábrica de Cikande.",
        },
        {
          year: "2017",
          title: "Produção de vestuário",
          description:
            "Iniciámos linhas de produção de vestuário em Karawaci, Banten.",
        },
        {
          year: "2017",
          title: "Portugal e Brasil",
          description: "Alargámos a rede comercial a Portugal e ao Brasil.",
        },
        {
          year: "2017",
          title: "Escritório de serviço em Cideng",
          description:
            "Abrimos uma nova torre de escritórios na Cideng Timur No. 36, em Jacarta, para reforçar o serviço ao cliente.",
        },
        {
          year: "2020",
          title: "Fábrica de malharia de Pemalang",
          description:
            "Criámos uma nova fábrica de malharia em Pemalang, Java Central.",
        },
      ],
    },
    purpose: {
      visionLabel: "A nossa visão",
      vision:
        "Tornar-se o parceiro inovador e oferecer uma solução completa para uma vasta gama de produtos têxteis.",
      missionLabel: "A nossa missão",
      mission:
        "Combinar tecnologia, inovação, experiência, competências e responsabilidade para garantir a satisfação do cliente.",
    },
    factories: {
      label: "FÁBRICA",
      title: "Fábricas",
      imageAlt: "Edifícios fabris da Asietex refletidos na água envolvente",
      locations: [
        {
          name: "FÁBRICA PRINCIPAL",
          details: [
            { label: "Empresa", value: "PT. Asietex Sinar Indopratama" },
            {
              label: "Morada",
              value:
                "Jl. Akses Interchange Dawuan No. 2, Cikampek Pusaka, Cikampek, Karawang, Java Ocidental 41373 - Indonésia",
            },
            { label: "Fundação", value: "2002" },
            { label: "Área", value: "± 200.000 m²" },
            { label: "Total de trabalhadores", value: "Cerca de 2.000" },
            {
              label: "Capacidade",
              value:
                "100 toneladas/dia (Tecido de Malha), 90 toneladas/dia (Tecido Tingido), 65.000 m/dia (Tecido Estampado) e 100 toneladas/dia (Tecido Acabado)",
            },
            {
              label: "Produtos principais",
              value:
                "Algodão, Viscose, Poliéster/Rayon, Poliéster/Algodão, Nylon, Poliéster com Elastano, Algodão com Elastano, Polar Fleece, Micro Fleece, Velour, Veludo, etc.",
            },
            {
              label: "Principais compradores de exportação",
              value:
                "TARGET, W-MART, H&M, KHOL’S, Mango, Zara, Old Navy, Muji, Adidas, Uniqlo",
            },
            {
              label: "Mercado",
              value:
                "Mercado local 65%, Ásia 10%, Europa 15%, Estados Unidos 10%",
            },
          ],
        },
        {
          name: "FÁBRICA DE CIKANDE",
          details: [
            { label: "Empresa", value: "PT. Asietex Sinar Indopratama" },
            {
              label: "Morada",
              value:
                "Jl. Raya Cikande - Rangkas Bitung KM 5, Desa Kareo, Kec. Jawilan, Kab. Serang, Banten 42177 - Indonésia",
            },
            { label: "Fundação", value: "2016" },
            { label: "Área", value: "± 300.000 m²" },
            { label: "Total de trabalhadores", value: "Cerca de 1.000" },
            {
              label: "Capacidade",
              value:
                "60 toneladas/dia (Fiação), 25 toneladas/dia (Tecelagem) e 35 toneladas/dia (Malharia)",
            },
            {
              label: "Produtos - Cru",
              value:
                "Velour, Polar Fleece, Micro Fleece, Jersey Simples, Jacquard Computorizado, Piqué, Canelado, Interlock, etc.",
            },
            {
              label: "Produtos - Fios",
              value:
                "Algodão, Viscose, Poliéster/Rayon, Poliéster/Algodão, Nylon, etc.",
            },
          ],
        },
        {
          name: "FÁBRICA DE PEMALANG",
          details: [
            { label: "Empresa", value: "PT. Asietex Sinar Indopratama" },
            {
              label: "Morada",
              value:
                "Jl. Pemalang Randu Dongkal KM.11 RT.005/RW.001 No.158, Desa Lenggerong, Kec. Bantar Bolang, Kabupaten Pemalang, Java Central 52352 - Indonésia",
            },
            { label: "Fundação", value: "2020" },
            { label: "Área", value: "± 7.500 m²" },
            { label: "Total de trabalhadores", value: "Cerca de 100" },
            { label: "Capacidade", value: "12 toneladas/dia" },
            {
              label: "Produtos principais",
              value: "Jersey, Zacquard, Mini Jack, Ponte, Canelado",
            },
            { label: "Mercado", value: "100% mercado nacional" },
          ],
        },
      ],
    },
    affiliates: {
      label: "EMPRESA AFILIADA",
      title: "Empresa Afiliada",
      companies: [
        {
          name: "XiongYing Knitting And Dyeing (Changshu) CO.,LTd",
          details: [
            {
              label: "Empresa",
              value: "XiongYing Knitting And Dyeing (Changshu) CO.,LTd",
            },
            {
              label: "Morada",
              value:
                "Cidade de Guli, ChangShu, JiangSu, China, Código Postal: 215533",
            },
            { label: "Fundação", value: "1994" },
            { label: "Área", value: "± 200.000 m²" },
            {
              label: "Total de trabalhadores",
              value: "Cerca de 2.000 trabalhadores",
            },
            { label: "Receita", value: "94 milhões de USD por ano" },
            {
              label: "Capacidade",
              value: "Cerca de 1.800 toneladas por mês",
            },
            {
              label: "Produtos",
              value:
                "Velour, Polar Fleece, Micro Fleece, Jersey Simples, Jacquard Computorizado, Piqué, Canelado, Interlock, etc.",
            },
          ],
        },
        {
          name: "PT. Annie Anna Sister Garmindo Utama",
          details: [
            {
              label: "Empresa",
              value: "PT. Annie Anna Sister Garmindo Utama",
            },
            {
              label: "Morada",
              value:
                "Jl. Pemalang Randu Dongkal KM 11, RT.005/RW.001 No.158,\nDesa Lenggerong, Kec. Bantar Bolang, Kabupaten Pemalang\nJava Central 52352 - Indonésia",
            },
            { label: "Fundação", value: "2020" },
            { label: "Área", value: "± 9.720 m²" },
            {
              label: "Total de trabalhadores",
              value: "Cerca de 500 trabalhadores",
            },
            {
              label: "Capacidade",
              value: "100.000 - 150.000 peças/mês",
            },
            {
              label: "Produtos principais",
              value: "Vestuário (Homem, Senhora, Criança)",
            },
            { label: "Mercado", value: "Nacional e Exportação" },
          ],
        },
      ],
    },
    network: {
      label: "Rede de mercados internacionais",
      title:
        "Uma base de produção na Indonésia, ligada a compradores em três continentes.",
      intro:
        "O nosso desenvolvimento comercial começou na Europa e alargou-se à Ásia e às Américas. Estes destinos constam da história e do perfil operacional publicados pela Asietex.",
      imageAlt:
        "Mapa-múndi que destaca os mercados da Asietex na Ásia, Europa e Américas",
      regions: [
        {
          name: "Ásia",
          markets: ["Indonésia", "Sri Lanka", "Vietname", "Camboja", "China"],
        },
        { name: "Europa", markets: ["França", "Itália", "Portugal"] },
        { name: "Américas", markets: ["Estados Unidos", "Brasil"] },
      ],
      mixTitle: "Distribuição de mercados da fábrica principal",
      mix: [
        { label: "Mercado nacional", value: 65 },
        { label: "Europa", value: 15 },
        { label: "Ásia", value: 10 },
        { label: "Estados Unidos", value: 10 },
      ],
      note: "As percentagens refletem o perfil operacional publicado para a fábrica principal de Cikampek.",
    },
    cta: {
      label: "Iniciar uma conversa",
      title: "Ligue o seu próximo programa têxtil à nossa rede de produção.",
      body: "Fale com a nossa equipa sobre produtos, capacidade, amostras ou o melhor ponto de partida para as suas necessidades.",
      contact: "Falar com a equipa",
      products: "Explorar produtos",
    },
  },
};
