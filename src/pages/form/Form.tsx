import Confirmation, {
  type SelectedCandidate,
} from "@/components/FormConfirmation";
import MpkCard, { mpkImage } from "@/components/mpkCard";
import OsisCard, { osisImage } from "@/components/OsisCard";
import ParallaxBackground from "@/components/ParallaxBackground";
import { voteSummary } from "@/data/voteSummary";
import { apiUrl } from "@/lib/api";
import axios, { isAxiosError } from "axios";
import { BadgeCheck, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

interface LoaderCandidate {
  _id: string;
  name: string;
  number: number;
  label: string;
}

const Form = () => {
  const navigate = useNavigate();
  const data = useLoaderData() as
    | Array<{ mpkData: LoaderCandidate[]; osisData: LoaderCandidate[] }>
    | undefined;

  const [osisValue, setOsisValue] = useState<string | null>(null);
  const [mpkValue, setMpkValue] = useState<string | null>(null);
  const [filled, setFilled] = useState<boolean | null>(null);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isVoteNotAllowed, setIsVoteNotAllowed] = useState<boolean>(false);
  const [isNotAuthorized, setIsNotAuthorized] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isShrunk, setIsShrunk] = useState<boolean>(false);

  const topBarRef = useRef<HTMLDivElement | null>(null);
  const osisHeaderRef = useRef<HTMLHeadingElement | null>(null);
  const expandedHeightRef = useRef<number>(0);

  useEffect(() => {
    const updateExpandedHeight = () => {
      if (!isShrunk && topBarRef.current) {
        expandedHeightRef.current = topBarRef.current.offsetHeight;
      }
    };

    updateExpandedHeight();

    const handleScroll = () => {
      const osisHeader = osisHeaderRef.current;
      if (!osisHeader) return;

      const triggerHeight = (expandedHeightRef.current || topBarRef.current?.offsetHeight || 0) + 16;
      const rect = osisHeader.getBoundingClientRect();
      setIsShrunk(rect.top <= triggerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => {
      updateExpandedHeight();
      handleScroll();
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isShrunk]);

  const mpkData = data?.[0]?.mpkData ?? [];
  const osisData = data?.[0]?.osisData ?? [];

  const toSelected = (
    list: LoaderCandidate[],
    id: string | null,
    org: "OSIS" | "MPK"
  ): SelectedCandidate | null => {
    const found = list.find((c) => c._id === id);
    if (!found) return null;
    return {
      org,
      name: found.name,
      number: found.number,
      image:
        org === "OSIS" ? osisImage(found.number) : mpkImage(found.number),
      summary: voteSummary[`${org}-${found.number}`] ?? "",
    };
  };

  const selectedOsis = toSelected(osisData, osisValue, "OSIS");
  const selectedMpk = toSelected(mpkData, mpkValue, "MPK");

  const step: 1 | 2 | 3 = success ? 3 : confirmation ? 2 : 1;

  const vote = async () => {
    if (!localStorage.getItem("Authorization")) {
      navigate("/");
      return;
    }
    if (!osisValue || !mpkValue) {
      setFilled(false);
      setConfirmation(false);
      return;
    }
    setIsVoteNotAllowed(false);
    setIsNotAuthorized(false);
    setSubmitError(null);
    try {
      setIsSent(true);
      await axios.post(
        `${apiUrl}/vote`,
        {
          osis: osisValue,
          mpk: mpkValue,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `${localStorage.getItem("Authorization")}`,
          },
        }
      );
      localStorage.removeItem("Authorization");
      setIsSent(false);
      setConfirmation(false);
      setSuccess(true);
    } catch (err) {
      setIsSent(false);
      if (isAxiosError(err)) {
        if (err.response?.status === 401) setIsVoteNotAllowed(true);
        else if (err.response?.status === 400) setIsNotAuthorized(true);
        else setSubmitError("Gagal mengirim suara. Periksa koneksi lalu coba lagi.");
      } else {
        setSubmitError("Gagal mengirim suara. Periksa koneksi lalu coba lagi.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    navigate("/login");
  };

  useEffect(() => {
    setFilled(null);
    setSubmitError(null);
  }, [osisValue, mpkValue]);

  return (
    <div className="relative w-screen min-h-dvh font-sans text-white flex justify-center">
      <ParallaxBackground className="h-dvh w-screen fixed -z-10" />
      <div
        ref={topBarRef}
        className={`fixed top-0 left-0 right-0 z-30 bg-amber-950/30 backdrop-blur-xl border-b border-amber-200/10 flex justify-center transition-all duration-300 ${
          isShrunk ? "py-2.5 rounded-b-2xl shadow-lg shadow-black/20" : "py-4 rounded-b-4xl"
        }`}
      >
        <div className="w-full max-w-6xl px-5 flex flex-col items-center">
          <div
            className={`flex flex-col items-center gap-3 w-full transition-all duration-300 overflow-hidden ${
              isShrunk
                ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none mb-0"
                : "max-h-48 opacity-100 translate-y-0 mb-3"
            }`}
          >
            <p className="text-[11px] sm:text-xs uppercase font-bodoni text-amber-100/60 tracking-[0.25rem]">
              Pemilos &bull; AKSA
            </p>
            <p className="font-bodoni font-black text-2xl sm:text-4xl md:text-5xl uppercase text-amber-100 text-center">
              Pilih Maestromu
            </p>
            <hr className="w-24 border-amber-200/30" />
          </div>
          <ol className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
            {["Pilih", "Konfirmasi", "Selesai"].map((label, i) => {
              const n = (i + 1) as 1 | 2 | 3;
              const active = step === n;
              const done = step > n;
              return (
                <li key={label} className="flex items-center gap-1 sm:gap-2">
                  <span
                    className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border ${
                      active
                        ? "bg-amber-200 text-amber-950 border-amber-200"
                        : done
                          ? "bg-amber-200/20 text-amber-100 border-amber-200/40"
                          : "text-white/40 border-white/20"
                    }`}
                  >
                    {n}
                  </span>
                  <span
                    className={`${active ? "text-amber-100" : "text-white/40"} ${active ? "" : "hidden min-[400px]:inline"}`}
                  >
                    {label}
                  </span>
                  {i < 2 && <span className="text-white/25 mx-0.5 sm:mx-1">/</span>}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-6xl px-5 pt-40 md:pt-48 pb-10 flex flex-col gap-10">
        {confirmation && (
          <Confirmation
            osis={selectedOsis}
            mpk={selectedMpk}
            vote={vote}
            setConfirmation={setConfirmation}
            isSent={isSent}
            isVoteNotAllowed={isVoteNotAllowed}
            isNotAuthorized={isNotAuthorized}
            submitError={submitError}
            isTopBarShrunk={isShrunk}
          />
        )}

        {success && (
          <div
            className={`fixed inset-0 bg-black/70 z-50 flex justify-center p-3 sm:p-5 transition-all duration-300 ${
              isShrunk
                ? "items-center pt-16 pb-4 overflow-y-auto"
                : "items-center pt-44 md:pt-48 pb-4 overflow-y-auto"
            }`}
          >
            <div className="bg-[#1c1f2b] w-full max-w-lg max-h-[85dvh] overflow-y-auto h-fit p-6 rounded-2xl border border-amber-200/25 flex flex-col items-center text-center gap-5 shadow-2xl">
              <span className="flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-amber-300/15 border-2 border-amber-300">
                <BadgeCheck
                  className="w-9 h-9 sm:w-[52px] sm:h-[52px] text-amber-300"
                  strokeWidth={2}
                />
              </span>
              <p className="font-bodoni font-black text-2xl sm:text-4xl uppercase text-amber-100">
                Suaramu Tercatat
              </p>
              <hr className="w-24 border-amber-200/30" />
              <p className="text-white/75 max-w-md">
                Terima kasih telah berpartisipasi dalam Pemilos AKSA. Satu suara
                darimu menentukan nahkoda OSIS dan MPK berikutnya.
              </p>
              <button
                onClick={handleLogout}
                className="mt-2 w-full sm:w-auto px-10 py-3 rounded-full font-bodoni font-bold uppercase tracking-widest bg-amber-200 text-amber-950 hover:bg-amber-100 transition"
              >
                Keluar
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8 sm:gap-12">
          <section className="flex flex-col gap-4">
            <h2
              ref={osisHeaderRef}
              className="font-bodoni font-black text-2xl sm:text-3xl uppercase text-amber-200 scroll-mt-28"
            >
              OSIS
            </h2>
            <div
              data-guide="section-osis"
              className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full"
            >
              {osisData.map((candidate) => (
                <OsisCard
                  key={candidate._id}
                  id={candidate._id}
                  name={candidate.name}
                  number={candidate.number}
                  osisVoteHandler={setOsisValue}
                  osisValue={osisValue}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="font-bodoni font-black text-2xl sm:text-3xl uppercase text-amber-200">
              MPK
            </h2>
            <div
              data-guide="section-mpk"
              className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full"
            >
              {mpkData.map((candidate) => (
                <MpkCard
                  key={candidate._id}
                  id={candidate._id}
                  name={candidate.name}
                  number={candidate.number}
                  mpkVoteHandler={setMpkValue}
                  mpkValue={mpkValue}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3">
          {filled === false && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-xl border-2 border-red-500/60 bg-red-500/15 p-4"
            >
              <TriangleAlert
                className="text-red-400 shrink-0"
                size={22}
                strokeWidth={2.5}
              />
              <p className="text-sm font-bold text-red-100">
                Pilih satu kandidat MPK dan satu kandidat OSIS terlebih dahulu.
              </p>
            </div>
          )}
          <button
            disabled={!osisValue || !mpkValue}
            onClick={() => {
              setConfirmation(true);
            }}
            data-guide="submit-vote"
            className={`w-full h-11 sm:h-12 -mb-4 font-bodoni font-bold uppercase tracking-widest text-lg sm:text-xl rounded-full transition ${
              !osisValue || !mpkValue
                ? "bg-amber-200/25 text-amber-100/40 cursor-not-allowed"
                : "bg-amber-200 text-amber-950 hover:bg-amber-100"
            }`}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
