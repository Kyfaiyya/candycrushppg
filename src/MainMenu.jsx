import { motion } from "framer-motion";

export default function MainMenu({
    levels,
    setLevel,
    setGameStarted,
    paws,
}) {

    return (
        <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-amber-100
      via-orange-200
      to-yellow-300
      overflow-hidden
      relative
      p-6
    ">

            {/* FLOATING PAWS */}
            <div className="absolute inset-0 overflow-hidden">

                {paws.map((_, index) => (

                    <motion.div
                        key={index}

                        initial={{
                            y: -100,
                            x: Math.random() * 1200,
                        }}

                        animate={{
                            y: "120vh",
                        }}

                        transition={{
                            duration: 12 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}

                        className="absolute text-3xl"
                    >
                        🐾
                    </motion.div>

                ))}

            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}

                className="
          bg-white/40
          backdrop-blur-md
          p-10
          rounded-[40px]
          shadow-lg
          w-full
          max-w-xl
          relative
          z-10
        "
            >

                <h1 className="
          text-6xl
          font-black
          mb-4
          text-center
          text-orange-700
        ">
                    🐱 Cat Kingdom 🐱
                </h1>

                <p className="
          text-center
          text-orange-700/80
          mb-8
        ">
                    Cozy cat puzzle adventure ✨
                </p>

                <div className="space-y-4">

                    {levels.map((lvl, idx) => (

                        <motion.button
                            key={idx}

                            whileHover={{
                                scale: 1.02,
                            }}

                            whileTap={{
                                scale: 0.98,
                            }}

                            onClick={() => {
                                setLevel(idx);
                                setGameStarted(true);
                            }}

                            className="
                w-full
                p-5
                rounded-3xl
                bg-white/50
                text-left
                shadow-md
              "
                        >

                            <div className="
                text-2xl
                font-black
                text-orange-700
              ">
                                {lvl.title}
                            </div>

                            <div className="
                text-orange-700/80
                mt-1
              ">
                                {lvl.story}
                            </div>

                            <div className="
                mt-2
                font-bold
                text-orange-700
              ">
                                🎯 Target: {lvl.target}
                            </div>

                        </motion.button>

                    ))}

                </div>

            </motion.div>

        </div>
    );
}