import { useEffect, useState } from "react";

import { motion } from "motion/react";
import type { DetailsType } from "@/schemas/details.schema";
import { Link } from "react-router-dom";
import { apiUrl } from "@/lib/api";
import axios from "axios";
import CurtainTransition from "@/components/CurtainTransition";
import ParallaxBackground from "@/components/ParallaxBackground";
import { detailsMap } from "@/data/candidate";

const osisCandidates: DetailsType[] = [
  detailsMap["OSIS-1"],
  detailsMap["OSIS-2"],
  detailsMap["OSIS-3"],
];

const mpkCandidates: DetailsType[] = [
  detailsMap["MPK-1"],
  detailsMap["MPK-2"],
  detailsMap["MPK-3"],
];

const spring = {
  type: "spring" as const,
  mass: 1,
  stiffness: 100,
  damping: 13,
};

const ListRow = ({
  index,
  html,
}: {
  index: number;
  html: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: false, amount: 0.3 }}
    transition={{ ...spring, delay: 0.1 * index }}
    className="flex items-start gap-2"
  >
    <span className="shrink-0 text-base leading-none">
      <motion.span
        className="inline-block mt-1"
        animate={{ rotate: [0, 18, -18, 0], scale: [1, 1.25, 1, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.1 * index,
        }}
      >
        ⭐
      </motion.span>
    </span>
    <p
      className="opacity-75"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </motion.div>
);

const CandidateCard = ({ data }: { data: DetailsType }) => {
  const [indeximg, setIndeximg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndeximg((prev) => (prev + 1) % data.images.length);
    }, 750);

    return () => clearInterval(interval);
  }, [data.images.length]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={spring}
      id={`${data.organization}-${data.number}`}
      className="w-full max-w-[1440px] flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-16 scroll-mt-24"
    >
      <div className="flex flex-col items-center">
        <div className="mt-4 flex flex-col justify-center items-center relative">
          <h1 className="absolute top-0 left-0 text-8xl font-black ml-2 -translate-y-1/3 text-amber-200 font-bodoni z-10">
            0{data.number}
          </h1>
          <h1 className="absolute top-0 right-0 text-3xl font-black mr-4 text-amber-200 font-bodoni z-10">
            {data.organization}
          </h1>
          <div className="flex flex-col justify-center items-center bg-linear-180 from-amber-100/10 to-amber-950/20 border-2 border-amber-200/20 backdrop-brightness-75 p-4 rounded-xl my-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className="relative my-8 mb-2"
              data-guide={
                data.organization === "OSIS" && data.number === 1
                  ? "candidate-1-image"
                  : undefined
              }
            >
              <img
                src={data.background}
                alt=""
                className="w-xs h-md object-contain rounded-2xl contrast-50 brightness-150 border-3 border-amber-950"
              />
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`${data.organization}-${data.number}-${indeximg}`}
                src={data.images[indeximg]}
                alt={data.name}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom scale-125 h-full w-auto max-w-none"
              />
            </motion.div>

            <h1 className="text-xl md:text-3xl font-bodoni font-extrabold p-2 text-center whitespace-nowrap uppercase text-amber-100">
              {data.name}
            </h1>

            <p className="text-xs uppercase font-bodoni text-amber-100/50 tracking-[0.25rem]">
              Candidate for {data.organization}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring}
          data-guide={
            data.organization === "OSIS" && data.number === 1
              ? "osis-1-visi-misi"
              : undefined
          }
          className="bg-amber-800/20 backdrop-brightness-30 border border-amber-200/20 p-6 rounded-xl shadow-lg w-full max-w-96 flex flex-col gap-2"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bodoni text-amber-100">Visi</h3>
            <span>🌟</span>
          </div>
          <hr className="opacity-20" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.75, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ ...spring, delay: 0.1 }}
            className="opacity-75"
            dangerouslySetInnerHTML={{ __html: data.vision }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...spring, delay: 0.1 }}
          className="bg-amber-800/20 backdrop-brightness-30 border border-amber-200/20 p-6 rounded-xl shadow-lg w-full max-w-96 flex flex-col gap-2"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bodoni text-amber-100">Misi</h3>
            <span>🎯</span>
          </div>
          <hr className="opacity-20" />
          <div className="flex flex-col gap-4 mt-1">
            {data.mission.map((misi, idx) => (
              <ListRow key={idx} index={idx} html={misi} />
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...spring, delay: 0.2 }}
          className="bg-amber-800/20 backdrop-brightness-30 border border-amber-200/20 p-6 rounded-xl shadow-lg w-full max-w-96 flex flex-col gap-2"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bodoni text-amber-100">Program Kerja</h3>
            <span>🌈</span>
          </div>
          <hr className="opacity-20" />
          <div className="flex flex-col gap-4">
            {data.programs.map((proker, idx) => (
              <ListRow key={idx} index={idx} html={proker} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
};

const SectionHeader = ({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={spring}
    id={id}
    className="w-full max-w-[1440px] flex flex-col items-center gap-2 pt-8 scroll-mt-24"
  >
    <h2 className="text-4xl md:text-5xl font-bodoni font-black uppercase text-amber-200 text-center">
      {title}
    </h2>
    <p className="text-sm uppercase font-bodoni text-amber-100/50 tracking-[0.25rem] text-center">
      {subtitle}
    </p>
    <hr className="w-24 border-amber-200/30 mt-2" />
  </motion.div>
);

const Home = () => {
  const [showCurtainOpen, setShowCurtainOpen] = useState(true);
  const [checked, setChecked] = useState<boolean>(false);

  const handleCurtainOpenDone = () => {
    setShowCurtainOpen(false);
  };

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
  }, []);

  return (
    <div className="w-screen min-h-screen p-7.5 font-sans text-white flex flex-col items-center text-xs md:text-sm gap-16 pb-32 pt-24">
      {showCurtainOpen && (
        <CurtainTransition mode="open" onClosed={handleCurtainOpenDone} />
      )}

      <ParallaxBackground className="h-screen w-screen fixed -z-10" />

      <nav className="flex gap-2 fixed top-8 z-20 bg-amber-950/60 backdrop-blur border border-amber-200/20 rounded-full px-2 py-1.5">
        <a
          href="#osis"
          className="rounded-full px-5 py-2 font-bodoni uppercase tracking-widest text-amber-100 hover:bg-amber-100/10 transition"
        >
          OSIS
        </a>
        <a
          href="#mpk"
          className="rounded-full px-5 py-2 font-bodoni uppercase tracking-widest text-amber-100 hover:bg-amber-100/10 transition"
        >
          MPK
        </a>
        {checked ? (
          <Link
            to="/form"
            data-guide="nav-vote"
            className="rounded-full px-5 py-2 font-bodoni uppercase tracking-widest bg-amber-200 text-amber-950 hover:bg-amber-100 transition"
          >
            Vote
          </Link>
        ) : (
          <span
            aria-disabled="true"
            title="Voting belum dibuka"
            data-guide="nav-vote-disabled"
            className="rounded-full px-5 py-2 font-bodoni uppercase tracking-widest bg-amber-200/30 text-amber-100/40 cursor-not-allowed select-none"
          >
            ...
          </span>
        )}
      </nav>

      <div className="w-full flex flex-col items-center gap-12">
        <SectionHeader
          id="osis"
          title="Kandidat OSIS"
          subtitle="Scroll kebawah untuk melihat kandidat"
        />
        {osisCandidates.map((data) => (
          <CandidateCard
            key={`${data.organization}-${data.number}`}
            data={data}
          />
        ))}
      </div>

      <div className="w-full flex flex-col items-center gap-12">
        <SectionHeader
          id="mpk"
          title="Kandidat MPK"
          subtitle="Scroll kebawah untuk melihat kandidat"
        />
        {mpkCandidates.map((data) => (
          <CandidateCard
            key={`${data.organization}-${data.number}`}
            data={data}
          />
        ))}
      </div>

      {/* <div className="w-full max-w-96 flex flex-col items-center max-md:fixed max-md:bottom-0 max-md:m-4 max-md:z-20">
        {checked ? (
          <Link
            to="/form"
            className="bg-[#2A303D] border border-white py-2 px-8 text-lg text-center font-bold rounded-xl shadow-lg w-full"
          >
            <p>Pilih Kandidat</p>
          </Link>
        ) : (
          <Button
            disabled={true}
            className="bg-[#2A303D] border border-white py-2 px-8 text-lg text-center font-bold rounded-xl shadow-lg w-full"
          >
            Mohon menunggu...
          </Button>
        )}
      </div> */}
    </div>
  );
};

export default Home;
