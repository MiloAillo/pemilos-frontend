import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import type { DetailsType } from "@/schemas/details.schema";
import { Link, useParams } from "react-router-dom";
import { detailsMap } from "@/routes/userRoute";
import { ChevronLeft } from "lucide-react";
import { candidateDisplay } from "@/data/candidate";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api";
import axios from "axios";
import CurtainTransition from "@/components/CurtainTransition";

const Home = () => {
  const { orgz, number } = useParams<{ orgz: string; number: string }>();
  const [orgType, setOrgType] = useState<"OSIS" | "MPK">(
    orgz === "OSIS" ? "OSIS" : "MPK"
  );
  const [candidateIdx, setCandidateIdx] = useState(
    Math.max(0, parseInt(number || "1", 10) - 1)
  );
  const candidates = candidateDisplay[orgType];

  const [showCurtainOpen, setShowCurtainOpen] = useState(true);

  const handleCurtainOpenDone = () => {
    setShowCurtainOpen(false);
  };

  useEffect(() => {
    setOrgType(orgz === "OSIS" ? "OSIS" : "MPK");
    setCandidateIdx(Math.max(0, parseInt(number || "1", 10) - 1));
  }, [orgz, number]);

  const handlePrev = () => {
    if (candidateIdx === 0) {
      const newOrgType = orgType === "OSIS" ? "MPK" : "OSIS";
      setOrgType(newOrgType);
      setCandidateIdx(candidateDisplay[newOrgType].length - 1);
    } else {
      setCandidateIdx((prev) => prev - 1);
    }
  };
  const handleNext = () => {
    if (candidateIdx === candidates.length - 1) {
      const newOrgType = orgType === "OSIS" ? "MPK" : "OSIS";
      setOrgType(newOrgType);
      setCandidateIdx(0);
    } else {
      setCandidateIdx((prev) => prev + 1);
    }
  };

  const dataKey = `${orgType}-${candidateIdx + 1}`;
  const data: DetailsType = detailsMap[dataKey as keyof typeof detailsMap];

  const [indeximg, setIndeximg] = useState(0);
  const [checked, setChecked] = useState<boolean>(false);

  const getToggle = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/vote/status`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `${localStorage.getItem("Authorization")}`,
        },
      });
      setChecked(res.data.data.vote_status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToggle();
    const interval = setInterval(() => {
      setIndeximg((prev) => (prev + 1) % data.images.length);
    }, 750);

    return () => clearInterval(interval);
  }, [data.images.length]);

  return (
    <div className="bg-[linear-gradient(336deg,#46626A_-36.08%,#242633_83.86%)] w-screen min-h-screen p-7.5 font-[Inter] text-white flex justify-center items-center text-xs md:text-sm" style={{ backgroundColor: "#242633" }}>
      {showCurtainOpen && (
        <CurtainTransition mode="open" onClosed={handleCurtainOpenDone} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={candidateIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", mass: 1, stiffness: 100, damping: 13 }}
          className="w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-16"
        >
          <div className="flex flex-col items-center ">
            <h2 className="text-4xl font-semibold bg-gradient-to-r to-[#648f9b] from-[#92D1E1] bg-clip-text text-transparent">
              {data.organization}
            </h2>
            <div className="mt-4 flex flex-col justify-center items-center">
              {data?.quote && (
                <p className="font-bold bg-gradient-to-r from-[#648f9b] to-[#6c7e83] bg-clip-text text-transparent">
                  {data?.quote}
                </p>
              )}
              <h1 className="text-4xl md:text-5xl paslon-name font-extrabold p-2 text-center">
                {data.name}
              </h1>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  mass: 1,
                  stiffness: 100,
                  damping: 13,
                }}
                className="relative "
              >
                <img
                  src={data.background}
                  alt=""
                  className="w-full h-full object-contain"
                />
                <AnimatePresence mode="popLayout">
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={indeximg}
                    src={data.images[indeximg]}
                    alt={data.name}
                    className="absolute bottom-0 right-0 h-full w-auto max-w-none"
                  />
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                mass: 1,
                stiffness: 100,
                damping: 13,
              }}
              className="bg-[#2A303D] p-6 rounded-xl shadow-lg w-full max-w-96 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl">Visi</h3>
                <span>🌟</span>
              </div>
              <hr className="opacity-20" />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.75, y: 0 }}
                transition={{
                  type: "spring",
                  mass: 1,
                  stiffness: 100,
                  damping: 13,
                  delay: 0.1,
                }}
                className="opacity-75"
                dangerouslySetInnerHTML={{ __html: data.vision }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                mass: 1,
                stiffness: 100,
                damping: 13,
                delay: 0.1,
              }}
              className="bg-[#2A303D] p-6 rounded-xl shadow-lg w-full max-w-96 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl">Misi</h3>
                <span>🎯</span>
              </div>
              <hr className="opacity-20" />
              <div className="flex flex-col gap-1">
                {data.mission.map((misi, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 overflow-hidden"
                  >
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: "spring",
                        mass: 1,
                        stiffness: 100,
                        damping: 13,
                        delay: 0.1 * idx + 0.2,
                      }}
                    >
                      ⭐
                    </motion.span>
                    <motion.p
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 0.75, x: 0 }}
                      transition={{
                        type: "spring",
                        mass: 1,
                        stiffness: 100,
                        damping: 13,
                        delay: 0.1 * idx + 0.5,
                      }}
                      className="opacity-75"
                      dangerouslySetInnerHTML={{ __html: misi }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                mass: 1,
                stiffness: 100,
                damping: 13,
                delay: 0.2,
              }}
              className="bg-[#2A303D] p-6 rounded-xl shadow-lg w-full max-w-96 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl">Program Kerja</h3>
                <span>🌈</span>
              </div>
              <hr className="opacity-20" />
              <div className="flex flex-col gap-1">
                {data.programs.map((proker, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 overflow-hidden"
                  >
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: "spring",
                        mass: 1,
                        stiffness: 100,
                        damping: 13,
                        delay: 0.1 * idx + 0.2,
                      }}
                    >
                      ⭐
                    </motion.span>
                    <motion.p
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 0.75, x: 0 }}
                      transition={{
                        type: "spring",
                        mass: 1,
                        stiffness: 100,
                        damping: 13,
                        delay: 0.1 * idx + 0.5,
                      }}
                      className="opacity-75"
                      dangerouslySetInnerHTML={{ __html: proker }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="flex justify-between gap-2 items-center w-full max-w-96 max-lg:mb-12">
              <button
                className="rounded-xl p-3 shadow hover:bg-gray-100/10 flex gap-4 items-center transition"
                onClick={handlePrev}
              >
                <ChevronLeft size={24} />
                <p>Next candidate</p>
              </button>
              <button
                className="rounded-xl p-3 shadow hover:bg-gray-100/10 flex gap-4 items-center transition"
                onClick={handleNext}
              >
                <p>Previous candidate</p>
                <ChevronLeft
                  size={24}
                  style={{ transform: "rotate(180deg)" }}
                />
              </button>
            </div>
            {checked ? (
              <Link
                to="/form"
                className="bg-[#2A303D] border border-white py-2 px-8 text-lg text-center font-bold rounded-xl shadow-lg md:w-full max-w-96 max-md:fixed max-md:bottom-0 max-md:m-4"
              >
                <p>Pilih Kandidat</p>
              </Link>
            ) : (
              <Button
                disabled={true}
                className="bg-[#2A303D] border border-white py-2 px-8 text-lg text-center font-bold rounded-xl shadow-lg md:w-full max-w-96 max-md:fixed max-md:bottom-0 max-md:m-4"
              >
                Mohon menunggu...
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Home;
