import { motion } from "framer-motion";

export default function Credits({ setShowCredits, paws }) {
    return (
        <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-orange-100
        via-yellow-200
        to-amber-300
        overflow-hidden
        relative
        p-6
      ">
            {/* PAWS */}
            <div className="absolute inset-0 overflow-hidden">
                {paws && paws.map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ y: -100, x: Math.random() * 1200 }}
                        animate={{ y: "120vh" }}
                        transition={{
                            duration: 12 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 4,
                        }}
                        className="absolute text-4xl"
                    >
                        🐾
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="
                bg-white/60
                backdrop-blur-md
                p-8
                rounded-[40px]
                shadow-xl
                max-w-2xl
                w-full
                relative
                z-10
                flex
                flex-col
                items-center
              "
            >
                <h1 className="text-4xl font-black text-center text-orange-800 mb-6 uppercase tracking-wider">
                    KREDIT LENGKAP
                </h1>

                <div className="flex flex-col md:flex-row gap-8 items-center bg-white/50 p-6 rounded-3xl w-full shadow-inner mb-6">
                    <img 
                        src="/foto.png" 
                        alt="Foto Pembuat" 
                        className="w-40 h-40 object-cover rounded-full border-4 border-orange-400 shadow-lg"
                    />
                    <div className="text-orange-900 font-bold text-lg space-y-2 text-center md:text-left">
                        <p><span className="text-orange-700">NRP:</span> 5027231047</p>
                        <p><span className="text-orange-700">Nama:</span> Dzaky Faiq Fayyadhi</p>
                        <p><span className="text-orange-700">Email:</span> dzakyfaiqfayyadhi</p>
                        <p><span className="text-orange-700">Kontak:</span> 085251457996</p>
                    </div>
                </div>

                <div className="bg-orange-100 p-4 rounded-2xl w-full text-center border-2 border-orange-200 mb-8 shadow-sm">
                    <p className="font-bold text-orange-800">Kuliah Pengantar Pengembangan Game ITS 2026</p>
                    <p className="font-semibold text-orange-700 mt-1">Dosen: Imam Kuswardayan, S.Kom, MT.T</p>
                </div>

                <button
                    onClick={() => setShowCredits(false)}
                    className="
                      px-10
                      py-4
                      rounded-3xl
                      bg-orange-500
                      hover:bg-orange-600
                      text-white
                      font-black
                      text-xl
                      shadow-md
                      hover:scale-105
                      transition-transform
                    "
                >
                    ⬅ KEMBALI
                </button>
            </motion.div>
        </div>
    );
}
