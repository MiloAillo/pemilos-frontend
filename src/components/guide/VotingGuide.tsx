import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const stepsByRoute: Record<string, DriveStep[]> = {
  "/": [
    {
      element: '[data-guide="candidate-1-image"]',
      popover: {
        title: "Katalog Kandidat",
        description:
          "Ini adalah bagian kandidat. Scroll ke bawah untuk melihat semua kandidat beserta foto, visi, misi, dan program kerja mereka.",
        side: "right",
        align: "center",
      },
    },
    {
      element: '[data-guide="osis-1-visi-misi"]',
      popover: {
        title: "Visi, Misi & Program Kerja",
        description:
          "Setiap kandidat punya kotak seperti ini. Baca dan bandingkan semuanya sebelum menentukan pilihanmu.",
        side: "left",
        align: "center",
      },
    },
    {
      element: () =>
        (document.querySelector('[data-guide="nav-vote"]') ??
          document.querySelector(
            '[data-guide="nav-vote-disabled"]'
          )) as Element,
      popover: {
        title: "Mulai Memilih",
        description:
          "Klik di sini untuk masuk ke halaman pemilihan. Jika voting belum dibuka, tombol akan terlihat redup — kembali lagi nanti.",
        side: "bottom",
        align: "center",
      },
    },
  ],
  "/form": [
    {
      element: '[data-guide="section-osis"]',
      popover: {
        title: "Pilih Kandidat OSIS",
        description:
          "Klik salah satu kartu kandidat OSIS untuk memilihnya. Kartu terpilih akan ditandai.",
        side: "top",
        align: "start",
      },
    },
    {
      element: '[data-guide="section-mpk"]',
      popover: {
        title: "Pilih Kandidat MPK",
        description:
          "Lalu klik salah satu kartu kandidat MPK untuk memilihnya.",
        side: "top",
        align: "start",
      },
    },
    {
      element: '[data-guide="submit-vote"]',
      popover: {
        title: "Kirim Suaramu",
        description:
          "Setelah memilih satu kandidat OSIS dan satu kandidat MPK, klik Kirim untuk mengunci suaramu.",
        side: "top",
        align: "center",
      },
    },
  ],
};

const VotingGuide = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const steps = stepsByRoute[pathname];
    if (!steps) return;

    const available = steps.filter(
      (step) =>
        typeof step.element !== "string" ||
        document.querySelector(step.element) !== null
    );
    if (available.length === 0) return;

    const timer = setTimeout(() => {
      const driverObj = driver({        steps: available,
        showProgress: true,
        allowClose: true,
        nextBtnText: "Lanjut",
        prevBtnText: "Kembali",
        doneBtnText: "Selesai",
        progressText: "{{current}} dari {{total}}",
        popoverClass: "voting-guide-popover",
        onDestroyStarted: () => {
          driverObj.destroy();
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      });
      driverObj.drive();
    }, 900);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default VotingGuide;
