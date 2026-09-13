import BackgroundMPK01 from "@/assets/Caketum 1/template-mpk-1.png";
import Alden from "@/assets/Caketum 1/Alden-1.png";
import Alden1 from "@/assets/Caketum 1/Alden-mpk-1.png";
import Alden2 from "@/assets/Caketum 1/Alden-mpk-2.png";
import Alden3 from "@/assets/Caketum 1/Alden-mpk-3.png";
import BackgroundMPK02 from "@/assets/Caketum 2/template-mpk-2.png";
import Seva from "@/assets/Caketum 2/Seva-2.png";
import Seva1 from "@/assets/Caketum 2/Seva-mpk-1.png";
import Seva2 from "@/assets/Caketum 2/Seva-mpk-2.png";
import Seva3 from "@/assets/Caketum 2/Seva-mpk-3.png";
import BackgroundMPK03 from "@/assets/Caketum 3/template-mpk-3.png";
import Attaya from "@/assets/Caketum 3/Attaya-3.png";
import Attaya1 from "@/assets/Caketum 3/Attaya-mpk-1.png";
import Attaya2 from "@/assets/Caketum 3/Attaya-mpk-2.png";
import Attaya3 from "@/assets/Caketum 3/Attaya-mpk-3.png";
import BackgroundOSIS01 from "@/assets/Caketos 1/template-osis-1.png";
import Rafif from "@/assets/Caketos 1/Rafif-1.png";
import Rafif1 from "@/assets/Caketos 1/Rafif-osis-1.png";
import Rafif2 from "@/assets/Caketos 1/Rafif-osis-2.png";
import Rafif3 from "@/assets/Caketos 1/Rafif-osis-3.png";
import BackgroundOSIS02 from "@/assets/Caketos 2/template-osis-2.png";
import Zahra from "@/assets/Caketos 2/Zahra-2.png";
import Zahra1 from "@/assets/Caketos 2/Zahra-osis-1.png";
import Zahra2 from "@/assets/Caketos 2/Zahra-osis-2.png";
import Zahra3 from "@/assets/Caketos 2/Zahra-osis-3.png";
import BackgroundOSIS03 from "@/assets/Caketos 3/template-osis-3.png";
import Laily from "@/assets/Caketos 3/Laily-3.png";
import Laily1 from "@/assets/Caketos 3/Laily-osis-1.png";
import Laily2 from "@/assets/Caketos 3/Laily-osis-2.png";
import Laily3 from "@/assets/Caketos 3/Laily-osis-3.png";
import type { DetailsType } from "@/schemas/details.schema";

import GenericBackground from "@/assets/CalonBack.png";


export const candidateDisplay = {
  MPK: [
    {
      id: 1,
      name: "Alden F. H.",
      img: Alden,
    },
    {
      id: 2,
      name: "Seva A. P.",
      img: Seva,
    },
    {
      id: 3,
      name: "Attaya S. A.",
      img: Attaya,
    },
  ],
  OSIS: [
    {
      id: 1,
      name: "Rafif F. P.",
      img: Rafif,
    },
    {
      id: 2,
      name: "Zahra R. M.",
      img: Zahra,
    },
    {
      id: 3,
      name: "Laily A. A.",
      img: Laily,
    },
  ],
};

export const MPK01Details: DetailsType = {
  number: 1,
  organization: "MPK",
  quote: "Bersama 01, melangkah maju",
  name: "Alden Fathin Hanif",

  background: GenericBackground,
  images: [Alden1, Alden2, Alden3],

  vision:
    "Mewujudkan MPK sebagai lembaga perwakilan siswa yang aspiratif, transparan, dan bertanggung jawab dalam mengawal kinerja OSIS serta membangun budaya sekolah yang aktif, kreatif, dan demokratis",
  mission: [
    "Membangun serta meningkatkan komunikasi antara MPK dengan OSIS",
    "Menampung, mengelola, dan menyampaikan aspirasi siswa secara terbuka dan bertanggung jawab",
    "Memanfaatkan media digital untuk publikasi dan transparansi kinerja MPK",
  ],

  programs: [
    "Studi banding (kegiatan belajar atau bertukar pikiran dengan MPK dari sekolah lain)",
    "Linkspiration (sebuah link berbasis google form/ngl yang dimana link tersebut akan dijadikan sebagai wadah untuk menampung aspirasi)",
    "MPK Goes to class (kegiatan menampung aspirasi dengan cara menyebarkan linkspiration ke setiap kelas melalui mpk dari kelas tersebut, proker ini dilaksanakan setiap setelah kegiatan atau 1 bulan sekali)",
    "Survei pra-acara (sebuah survei yang dilakukan sebelum kegiatan/acara dimulai guna untuk mengetahui apa harapan siswa tentang acara yang akan dilaksanakan)",
    "Buletin MPK (pengoptimalan media sosial MPK demi mewujudkan transparansi tentang kinerja MPK, contoh nya seperti live report)",
  ],
};

export const MPK02Details: DetailsType = {
  number: 2,
  organization: "MPK",
  name: "Seva Adinda Purwadani",

  background: GenericBackground,
  images: [Seva1, Seva2, Seva3],

  vision:
    "Menjadikan organisasi MPK sebagai wadah untuk menampung dan melaksanakan aspirasi serta inspirasi, dengan memegang teguh nilai BINTANG (Berkompeten, berlandaskan Iman, dan bertanggung jawab)",
  mission: [
    "Mengedepankan iman dan takwa serta tidak lupa menerapkan sopan santun dan etika",
    "Mewujudkan MPK sebagai organisasi teladan dan progresif",
    "Mendengarkan, menyaring, dan mengevaluasi aspirasi dari seluruh warga sekolah",
    "Mengembangkan potensi siswa siswi melalui program yang efektif dan menarik,",
  ],

  programs: [
    "Speak Your Mind Day <br/> Hari khusus bagi siswa untuk menyampaikan aspirasi langsung kepada MPK",
    "Re Action <br/> Menyalurkan aspirasi bukan hanya lewat karya seperti lewat puisi, mural, poster, short movie yang dipajang di sekolah",
    "Review and Reach <br/> MPK membentuk tim evaluasi yang tidak hanya mengecek progres program OSIS, tapi juga turun langsung ke kelas untuk mendengarkan aspirasi dan feedback dari siswa siswi smkn 8 .Hasil dari suara siswa akan dirangkum jadi laporan, lalu disampaikan ke OSIS secara berkala sebagai bahan evaluasi dan perbaikan bersama",
  ],
};

export const MPK03Details: DetailsType = {
  number: 3,
  organization: "MPK",
  name: "Attaya Sahasika Arif",

  background: GenericBackground,
  images: [Attaya1, Attaya2, Attaya3],

  vision:
    "Mewujudkan MPK yang bergerak dengan AKSI: aktif, kritis, solutif, dan integritas, untuk mendukung terciptanya siswa siswi yang berkarakter, mandiri, serta berlandaskan nilai demokrasi di lingkungan sekolah",
  mission: [
    "Menampung dan menyalurkan aspirasi seluruh siswa dengan adil dan bertanggung jawab",
    "Melakukan pengawasan terhadap kinerja OSIS agar berjalan sesuai aturan, program, dan nilai yang telah disepakati",
    "Membangun komunikasi yang harmonis antara siswa, MPK dan OSIS, serta seluruh warga sekolah",
    "Menumbuhkan budaya musyawarah, keterbukaan, dan kedisiplinan di lingkungan sekolah"
  ],

  programs: [
    "Aksi Tindak Lanjut Aspirasi (ATLAS) <br/> Menindaklanjuti aspirasi siswa-siswi yang sudah terkumpul dan mempublikasikan progres penanganan aspirasi lewat mading/medsos MPK",
    "Student Voice Forum <br/> Forum diskusi terbuka antar siswa perwakilan kelas, MPK, dan OSIS membahas isu sekolah, seperti perihal kedisiplinan, fasilitas dan kegiatan ekstrakurikuler",
    "Studi Banding Kreatif <br/> Kolaborasi dengan MPK dari sekolah lain, bertukar ilmu, ide, dan sharing pengalaman",
    "Mengoptimalkan sosial media MPK sebagai sarana pendekatan MPK kepada siswa-siswi. Contohnya dengan membuat Monthly Recap, Behind the scene, dan MPK Semarang Creative Post yang berisi quotes motivasi, tips belajar, dan fun fact tentang SMKN 8"
  ],
};

export const OSIS01Details: DetailsType = {
  number: 1,
  organization: "OSIS",
  name: "Rafif Firza Putra",

  background: GenericBackground,
  images: [Rafif1, Rafif2, Rafif3],

  vision:
    "Mendorong OSIS dan siswa di SMKN 8 Semarang menjadi lebih KARSA ( KOLABORATIF, AMANAH, RUKUN, SINERGI, AKTIF ) dan memiliki etos kerja yang tinggi dan memiliki daya saing tinggi.",
  mission: [
    "Berkolaborasi, membantu, mengawasi,seluruh kegiatan ekstrakurikuler dan organisasi",
    "Memberikan tempat berkembang bagi seluruh siswa yang memiliki potensi dalam bidang akademik dan non akademik",
    "Membangun lingkungan yang inklusif dan nyaman untuk seluruh siswa berkembang",
    "Mewujudkan sekolah go green dan bebas dari sampah, dengan mSeva Adinda Purwadanielaksanakan kebersihan sebulan sekali",
  ],

  programs: [
    "Melanjutkan program kerja yang telah ada dari Angkatan sebelumnya",
    "Memaksimalkan grup koordinator ekstrakurikuler dan organisasi untuk bertukar informasi tentang lomba",
    "Mengadakan kegiatan pertemuan dengan koordinator ekstrakurikuler untuk berkoordinasi tentang program kerja yang akan terlaksana 1 tahun kedepan",
    "Melaksanakan pertemuan dengan waka kurikulum untuk membentuk jadwal event untuk seluruh organisasi dan ekstrakurikuler",
    "Mengadakan kegiatan bersih bersih setiap sebulan sekali yang diikuti semua siswa guru dan seluruh warga sekolah",
  ],
};

export const OSIS02Details: DetailsType = {
  number: 2,
  organization: "OSIS",
  name: "Zahra Rizky Megasaputri",

  background: GenericBackground,
  images: [Zahra1, Zahra2, Zahra3],

  vision:
    "Mewujudkan OSIS SMK Negeri 8 Semarang sebagai organisasi aktif, kreatif, dan inovatif melalui kegiatan yang positif dan juga berdampak bagi siswa siswi. Untuk membentuk siswa siswi yang berkarakter, berprestasi, dan berjiwa sosial",
  mission: [
    "Menyediakan wadah bagi siswa siswi SMK Negeri 8 Semarang untuk memberi inpirasi dan edukasi melalui konten kreatif di media sosial (Snapan Talk)",
    "Menumbuhkan kepedulian sosial dan kesadaran lingkungan melalui kegiatan yang kreatif, edukatif, serta ramah lingkungan (Ecocraft)",
    "Mengembangkan program kerja OSIS sebelumnya, agar tercipta kesinambungan organisasi",
    "Menjadi fasilitator dalam membangun perilaku positif di sekolah, baik dalam aspek akademik maupun non-akademik",
  ],

  programs: [
    "<span className='font-bold'>Snapan Talk</span> adalah sebuah konten yang akan memanfaatkan platform media sosial. Dengan mengundang siswa siswi berprestasi di bidang akademik maupun non-akademik. Snapan Talk juga akan membahas topik seputar anak sekolah atau remaja, yang pastinya konten Snapan Talk akan memberi inspirasi, edukasi, dan menarik pada setiap episode nya",
    "<span className='font-bold'>EcoCraft (Karya Ramah Lingkungan)</span> adalah kegiatan membuat kerajinan tangan dengan memanfaatkan barang bekas yang dapat diolah atau di daur ulang, agar nantinya dapat digunakan kembali menjadi barang yang lebih bermanfaat dan memiliki nilai jual",
    "Melanjutkan program kerja yang sudah ada dan sudah berjalan dari Angkatan sebelumnya",
  ],
};

export const OSIS03Details: DetailsType = {
  number: 3,
  organization: "OSIS",
  name: "Laily Artika Azkianingrum",

  background: GenericBackground,
  images: [Laily1, Laily2, Laily3],

  vision:
    "Menjadikan OSIS sebagai teladan dalam membangun perilaku positif, integritas, dan tanggung jawab, sekaligus mengembangkan potensi siswa-siswi SMKN 8 Semarang yang berjiwa profil pelajar pancasila, peduli sosial, dan menjadi generasi unggul serta inspiratif",
  mission: [
    "Mengutamakan nilai nilai religius ke dalam segala aspek yang berdasarkan kepada ketuhanan yang maha Esa",
    "Meningkatkan kesadaran siswa siswi SMKN 8 Semarang akan pentingnya peduli terhadap lingkungan dan sosial",
    "Mengoptimalkan peran media sosial, untuk Menjadi Wadah Aspirasi Siswa-siswi SMKN 8 Semarang",
    "Menyediakan wadah bagi siswa dalam menyalurkan ide, bakat, kreativitas, dan inovasi",
  ],

  programs: [
    "Mengadakan evaluasi osis kurang lebih 2 bulan sekali guna memastikan bahwa program kerja berjalan dengan baik dan mengevaluasi tentang kedisiplinan, bertanggungjawab, dan perilaku teladan",
    "Penggalangan donasi pakaian layak pakai untuk masyarakat yang membutuhkan",
    "Pengelolaan sampah plastik menjadi barang yang bermanfaat dan mengoptimalkan platform media sosial untuk melakukan kampanye kepedulian lingkungan",
    "Memanfaatkan media sosial guna membagikan konten edukatif, inspiratif, dan memotivasi Siswa-siswi SMKN 8 Semarang, dan Menjadikan Sarana Aspirasi siswa siswi SMKN 8 semarang",
    "Mading kreatif, Menjadi wadah bagi Siswa-siswi SMKN 8 Semarang untuk menyalurkan informasi, ide, dan kreativitas",
    "Study Banding untuk Menambah wawasan dan pengalaman baru melalui pertukaran ide organisasi dengan sekolah lain",
  ],
};

export const detailsMap = {
  "MPK-1": MPK01Details,
  "MPK-2": MPK02Details,
  "MPK-3": MPK03Details,
  "OSIS-1": OSIS01Details,
  "OSIS-2": OSIS02Details,
  "OSIS-3": OSIS03Details,
};
