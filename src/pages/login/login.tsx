import { useRef, useState } from "react";
import axios, { isAxiosError } from "axios";
import { apiUrl } from "@/lib/api";
import CurtainTransition from "@/components/CurtainTransition";
import ParallaxBackground from "@/components/ParallaxBackground";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const tokenRef = useRef<HTMLInputElement | null>(null);

  const [isCredentialWrong, setIsCredentialWrong] = useState<boolean>(false);
  const [isNotFilled, setIsNotFilled] = useState<boolean>(false);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false)
  const [isUnknownError, setIsUnknownError] = useState<boolean>(false)

  const [username, setUsername] = useState<string>("");
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  const removeWarning = () => {
    setIsCredentialWrong(false);
    setIsNotFilled(false);
    setIsVoted(false);
    setIsUnknownError(false)
    setIsRateLimited(false)
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    removeWarning()
    if (!usernameRef.current?.value || !tokenRef.current?.value) {
      setIsNotFilled(true);
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username: usernameRef.current?.value,
        password: `${tokenRef.current?.value}:${usernameRef.current?.value}`,
      });
      const jwt = response.data["token"];
      localStorage.setItem("Authorization", jwt);
      if (response.data.status === "sucess") {
        setToken(jwt);
        setIsClosing(true);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status == 401) {
          setIsVoted(true);
        } else if (err.response?.status == 400) {
          setIsCredentialWrong(true);
        } else if (err.code === "ERR_NETWORK" || err.response?.status === 429) {
          setIsRateLimited(true)
        } else {
          console.log(err)
          setIsUnknownError(true)
        }
      }
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center p-5 font-sans text-white" style={{ backgroundColor: "#2a1a0a" }}>
      <ParallaxBackground className="h-screen w-screen fixed -z-10" />

      {isClosing && (
        <CurtainTransition
          mode="close"
          onClosed={() => {
            try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              const role = payload.role;
              if (role?.toLowerCase() === "admin") {
                navigate("/admin", { replace: true });
              } else {
                navigate("/", { replace: true });
              }
            } catch {
              navigate("/", { replace: true });
            }
          }}
        />
      )}

      <div className="w-full max-w-md rounded-2xl border border-amber-200/25 bg-amber-950/40 backdrop-blur-xl shadow-2xl px-8 py-10 flex flex-col items-center text-center">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs uppercase font-bodoni tracking-[0.25rem] text-amber-100/60">
              Pemilos &bull; AKSA
            </p>
            <h1 className="font-bodoni font-black text-4xl uppercase text-amber-100">
              Masuk
            </h1>
            <hr className="w-24 border-amber-200/30" />
            <p className="text-sm text-amber-100/60">
              Silahkan login sebelum vote
            </p>
          </div>

          <ol className="w-full flex flex-col gap-1.5 rounded-xl border border-amber-200/15 bg-amber-200/[0.04] p-4 text-left">
            <li className="flex gap-2 text-xs text-amber-100/70">
              <span className="font-bold text-amber-200">1.</span>
              Siapkan kertas dari panitia berisi username dan token
            </li>
            <li className="flex gap-2 text-xs text-amber-100/70">
              <span className="font-bold text-amber-200">2.</span>
              Isi username dan token di bawah, lalu tekan 'masuk'
            </li>
            <li className="flex gap-2 text-xs text-amber-100/70">
              <span className="font-bold text-amber-200">3.</span>
              Baca detail tiap kandidat, lalu klik 'vote'
            </li>
            <li className="flex gap-2 text-xs text-amber-100/70">
              <span className="font-bold text-amber-200">4.</span>
              Pilih 1 kandidat OSIS dan 1 kandidat MPK, lalu klik 'kirim'
            </li>
          </ol>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-1.5">
              <label htmlFor="username" className="text-sm text-amber-100/80">
                Username
              </label>
              <input
                onChange={(e) => {
                  removeWarning();
                  setUsername(e.target.value);
                }}
                ref={usernameRef}
                type="text"
                name="username"
                id="username"
                placeholder="contoh: 1234567"
                className="w-full h-10 rounded-lg bg-white/[0.06] border border-white/10 focus:border-amber-200/50 focus:outline-none px-3 text-white placeholder:text-white/25"
              />
              <p className="text-[11px] text-amber-100/40">
                Tulis persis seperti di kertas panitia
              </p>
            </div>

            <div className="flex flex-col items-start gap-1.5">
              <label htmlFor="password" className="text-sm text-amber-100/80">
                Token
              </label>
              <div className="flex flex-row gap-1 justify-between items-center w-full">
                <input
                  onChange={removeWarning}
                  ref={tokenRef}
                  type="text"
                  name="password"
                  id="password"
                  placeholder="contoh: Xx0000"
                  className="w-full h-10 rounded-lg bg-white/[0.06] border border-white/10 focus:border-amber-200/50 focus:outline-none px-3 text-white placeholder:text-white/25"
                />
                <p className="font-sans font-bold text-xl text-amber-100/60">:</p>
                <input
                  readOnly
                  onChange={removeWarning}
                  value={username}
                  type="text"
                  name="password"
                  id="password"
                  className="w-full h-10 rounded-lg bg-white/[0.06] border border-white/10 px-3 text-amber-100/50"
                />
              </div>
              <p className="text-[11px] text-amber-100/40">
                Bagian setelah tanda ":" terisi otomatis, tidak perlu diketik
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {isCredentialWrong && (
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
                  Username atau token tidak valid!
                </p>
              </div>
            )}
            {isNotFilled && (
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
                  Username dan token wajib diisi!
                </p>
              </div>
            )}
            {isRateLimited && (
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
                  Jaringan terbebani, mohon ganti jaringan anda
                </p>
              </div>
            )}
            {isUnknownError && (
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
                  Periksa internet dan coba lagi
                </p>
              </div>
            )}
            {isVoted && (
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
                  Anda sudah vote!
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={isClosing}
              className={`w-full h-11 rounded-full font-bodoni font-bold uppercase tracking-widest transition ${
                isClosing
                  ? "bg-amber-200/25 text-amber-100/40 cursor-not-allowed"
                  : "bg-amber-200 text-amber-950 hover:bg-amber-100"
              }`}
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
