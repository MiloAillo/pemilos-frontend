import Aliya from "@/assets/Kandidat/Aliya-1.png";
import Galuh from "@/assets/Kandidat/Galuh-2.png";
import Ravidya from "@/assets/Kandidat/Ravidya-3.png";
import Alvino from "@/assets/Kandidat/Alvino-1.png";
import Raihan from "@/assets/Kandidat/Raihan-2.png";
import Kynanti from "@/assets/Kandidat/Kynanti-3.png";
import type { DetailsType } from "@/schemas/details.schema";

import GenericBackground from "@/assets/CalonBack.png";

export const MPK01Details: DetailsType = {
  number: 1,
  organization: "MPK",
  name: "Alvino Satrio Widigdo Hadikusuma",

  background: GenericBackground,
  images: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="], // transparent 1x1

  vision:
    "Mewujudkan MPK yang “TERBUKA”  Terpercaya, Responsif, dan Terbuka dalam mengawal aspirasi, mengembangkan sistem organisasi, serta membangun komunikasi.",
  mission: [
    "Membangun sistem aspirasi yang terbuka dan bertanggung jawab atas semua aspirasi.",
    "Meningkatkan transparansi dalam kinerja MPK.",
    "Memperkuat komunikasi antara siswa, MPK, OSIS, dan sekolah.",
    "Menjaga dan mengembangkan program kerja yang telah berjalan melalui evaluasi, inovasi, dan dokumentasi."
  ],

  programs: [
    "MPK Transparency and Digital Voice <br/> Membuka perkembangan kinerja aspirasi MPK yang sudah terkumpul serta pengoptimalan media sosial MPK agar menjadi jauh lebih aktif.",
    "Event Evaluation System <br/> Sistem pengembangan dari Survey Pasca Acara dengan MPK sebagai pemberi saran pada kegiatan suatu event.",
    "MPK Track <br/> MPK yang menyediakan sistem aspirasi baru melalui penyebaran pada daerah tertentu di dalam SMK Negeri 8 Semarang."
  ],
};

export const MPK02Details: DetailsType = {
  number: 2,
  organization: "MPK",
  name: "Raihan Yusuf Habibi",

  background: GenericBackground,
  images: [Raihan],

  vision:
    "Mewujudkan MPK SMKN 8 Semarang dengan KITA (Kolaboratif, Integritas, Transparansi, dan Aspirasi).",
  mission: [
    "Membangun dan meningkatkan komunikasi antara MPK dengan seluruh organisasi yang ada di SMKN 8 Semarang",
    "Melaksanakan pengawasan dan peninjauan kegiatan secara objektif",
    "Mengoptimalkan media digital sebagai sarana publikasi dan transparansi tindak lanjut aspirasi siswa SMKN 8 Semarang",
  ],

  programs: [
    "Study Banding <br/> Bertukar wawasan dan pengalaman dengan organisasi sekolah lain",
    "ATLAS <br/> Wadah untuk menampung dan menindaklanjuti aspirasi siswa",
    "Survei Pasca Acara <br/> Mengumpulkan evaluasi dan saran setelah kegiatan untuk perbaikan acara berikutnya",
  ],
};

export const MPK03Details: DetailsType = {
  number: 3,
  organization: "MPK",
  name: "Kynanti Rizky Syafitri",

  background: GenericBackground,
  images: [Kynanti],

  vision:
    'Mewujudkan MPK sebagai lembaga perwakilan siswa yang "SATU": S uara, A spirasi, T ransparansi, U ntuk bersama. Satu bukan berarti satu pendapat, tetapi satu tujuan. Menciptakan MPK yang hadir, terbuka, dan bekerja untuk kepentingan bersama.',
  mission: [
    "Membuka ruang komunikasi yang mudah diakses siswa untuk menyampaikan aspirasi, saran, dan kritik",
    "Mengelola dan mengawal aspirasi secara bertanggung jawab dan transparan",
    "Mengoptimalkan pengawasan dan koreksi MPK berdasarkan AD/ART, musyawarah, keadilan, dan tanggung jawab",
    "Meningkatkan pemahaman siswa terhadap fungsi dan peran MPK",
  ],

  programs: [
    "Suara to Aksi <br/> Mengelola dan mengawal aspirasi agar tidak berhenti setelah diterima, tetapi diproses hingga tindak lanjut",
    "MPK Check & Guard <br/> Mengawal dengan aturan, bukan kepentingan. Mengawasi dan mengevaluasi organisasi berdasarkan AD/ART serta mengawal penyelesaian masalah berdasarkan peraturan",
    "MOV (MPK Open Voice) <br/> Wadah terbuka bagi siswa untuk menyampaikan aspirasi, kritik, saran, keluhan, dan ide dengan mudah",
  ],
};

export const OSIS01Details: DetailsType = {
  number: 1,
  organization: "OSIS",
  name: "Aliya Bunga Fatima",

  background: GenericBackground,
  images: [Aliya],

  vision:
    "Mewujudkan OSIS SMKN 8 Semarang yang komunikatif, terbuka, dan inklusif sebagai wadah berkembangnya potensi siswa serta membangun OSIS yang dekat, responsif, dan mampu memberikan dampak positif bagi seluruh siswa.",
  mission: [
    "Membangun komunikasi yang terbuka dan baik dalam kepengurusan OSIS",
    "Memberikan ruang bagi setiap anggota OSIS untuk berpendapat, mencoba hal baru, dan mengembangkan potensinya",
    "Mendekatkan OSIS dengan siswa melalui komunikasi yang terbuka dan keterlibatan dalam kegiatan sekolah",
    "Mengembangkan kegiatan yang sesuai dengan kebutuhan dan minat siswa serta membangun lingkungan sekolah yang nyaman dan saling menghargai",
  ],

  programs: [
    "Melanjutkan Proker <br/> Melanjutkan program kerja yang telah berjalan dari kepengurusan sebelumnya dengan melakukan penyesuaian dan pengembangan sesuai kebutuhan",
    "Study Banding <br/> Menambah wawasan dan pengalaman pengurus OSIS melalui pertukaran ide dan sistem kerja dengan OSIS dari sekolah lain",
    "Student Choice <br/> Melibatkan siswa dalam menentukan pilihan pada aspek tertentu dalam kegiatan OSIS melalui beberapa pilihan yang telah disiapkan",
    "Pembiasaan 5S <br/> Membudayakan Senyum, Salam, Sapa, Sopan, dan Santun melalui edukasi dan pembiasaan di lingkungan sekolah",
    "Evaluasi OSIS <br/> Mengetahui kendala dalam pelaksanaan program kerja dan menentukan perbaikan untuk kegiatan selanjutnya",
  ],
};

export const OSIS02Details: DetailsType = {
  number: 2,
  organization: "OSIS",
  name: "Galuh Kirana Anindya Putri",

  background: GenericBackground,
  images: [Galuh],

  vision:
    "Mewujudkan OSIS sebagai wadah yang interaktif, ekspresif, dan berkarakter dalam menciptakan lingkungan sekolah yang harmonis, serta peduli terhadap siswa.",
  mission: [
    "Mengasah wawasan umum siswa secara interaktif melalui media sosial OSIS",
    "Menyediakan ruang terbuka untuk penyaluran ide kreatif sebagai sarana relaksi pasca ujian",
    "Menumbuhkan budaya saling sapa, ramah, dan penuh kehangatan di lingkungan sekolah",
    "Menyiapkan sistem reward dan wadah pameran karya secara berkala guna mengapresiasi keaktifan serta bakat siswa",
  ],

  programs: [
    "Flash Pop-Up Quiz <br/> Kuis seru berhadiah voucher kantin yang diadakan 1 bulan sekali di akun media sosial OSIS",
    "Art & Expressive Day <br/> Sesi melukis, menggambar, atau membuat kerajinan bersama di area terbuka sekolah (lapangan atau aula) saat akhir semester untuk meredakan ketegangan ujian",
    "PAHAT (Sapaan Hangat) <br/> Setiap pagi, pengurus OSIS bergantian berada di depan lobby untuk menyapa siswa/i dengan senyuman atau mengajak mereka untuk melakukan high-five (tos)",
  ],
};

export const OSIS03Details: DetailsType = {
  number: 3,
  organization: "OSIS",
  name: "Ravidya Satrio Adi",

  background: GenericBackground,
  images: [Ravidya],

  vision:
    "Mewujudkan OSIS yang berlandaskan Pancasila & AD/ART, mengayomi seluruh organisasi dan ekstrakurikuler, berkarakter 5S serta berwawasan kebangsaan, dan aktif mewadahi prestasi seluruh siswa.",
  mission: [
    "Landasan Kokoh: Berpedoman penuh pada nilai Pancasila dan AD/ART",
    "Mengayomi & Bersinergi: Mendampingi seluruh organisasi dan ekstrakurikuler untuk maju bersama",
    "Karakter & Kebangsaan: Membangun kepribadian beretika melalui budaya 5S dan jiwa nasionalisme",
    "Wadah Prestasi: Menjadi ruang kolaborasi yang adil untuk mengembangkan potensi siswa",
  ],

  programs: [
    "Kalender Event <br/> Sinkronisasi jadwal kegiatan sekolah melalui kalender terpusat",
    "Gerakan 5S Action <br/> Morning greeting interaktif di gerbang sekolah",
    "Ruang Kreasi Nusantara (RKN) <br/> Lomba kreatif modern bertema wawasan kebangsaan",
    "Jejak Prestasi <br/> Website untuk mendokumentasikan pencapaian siswa",
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
