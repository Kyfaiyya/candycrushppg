import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Credits from "./Credits";

export default function App() {

  const width = 8;

  // =========================================
  // CAT TYPES
  // =========================================

  const catTypes = [
    "🐱",
    "🐈",
    "🦁",
    "🐯",
    "🐹",
    "🐼",
  ];

  // =========================================
  // LEVELS
  // =========================================

  const levels = [
    {
      title: "☕ Cat Cafe",
      target: 100,
      moves: 20,
    },
    {
      title: "🌙 Midnight Alley",
      target: 180,
      moves: 18,
    },
    {
      title: "👑 Meow Castle",
      target: 260,
      moves: 16,
    },
  ];

  // =========================================
  // STATES
  // =========================================

  const [level, setLevel] = useState(0);

  const [board, setBoard] = useState([]);

  const [selected, setSelected] =
    useState(null);

  const [score, setScore] = useState(0);

  const [movesLeft, setMovesLeft] =
    useState(levels[0].moves);

  const [gameStarted, setGameStarted] =
    useState(false);

  const [showCredits, setShowCredits] = useState(false);

  const [showVictory, setShowVictory] =
    useState(false);

  const [showLose, setShowLose] =
    useState(false);

  const [comboChain, setcomboChain] = useState(0);

  const [floatingTexts, setFloatingTexts] =
    useState([]);

  const [bombs, setBombs] = useState([]);

  // =========================================
  // TILE IDs FOR ANIMATION
  // =========================================

  const idCounter = useRef(0);
  const nextId = () => { idCounter.current += 1; return idCounter.current; };
  const [tileIds, setTileIds] = useState(() =>
    Array.from({ length: 64 }, () => { idCounter.current += 1; return idCounter.current; })
  );

  // =========================================
  // BOSS SYSTEM
  // =========================================

  const [bossHp, setBossHp] = useState(300);
  const [bossMode, setBossMode] = useState(true);
  const [bossAttackText, setBossAttackText] = useState("");

  // =========================================
  // COMBO FX
  // =========================================

  const [bigComboText, setBigComboText] = useState("");

  // =========================================
  // SCREEN SHAKE
  // =========================================

  const [screenShake, setScreenShake] = useState(false);

  // =========================================
  // FEVER MODE
  // =========================================

  const [feverMode, setFeverMode] = useState(false);

  const paws = useMemo(
    () => Array.from({ length: 12 }),
    []
  );

  // =========================================
  // RANDOM CAT
  // =========================================

  const randomCat = () =>
    catTypes[
    Math.floor(Math.random() * catTypes.length)
    ];

  // =========================================
  // CREATE BOARD
  // =========================================

  function createBoard() {

    let newBoard = [];

    for (let i = 0; i < width * width; i++) {
      newBoard.push(randomCat());
    }

    return newBoard;
  }

  // =========================================
  // START GAME
  // =========================================

  useEffect(() => {

    if (gameStarted) {
      setBoard(createBoard());
    }

  }, [gameStarted]);

  // =========================================
  // WIN / LOSE
  // =========================================

  useEffect(() => {

    if (
      score >= levels[level].target
    ) {
      setShowVictory(true);
    }

  }, [score]);

  useEffect(() => {

    if (
      movesLeft <= 0 &&
      score < levels[level].target
    ) {
      setShowLose(true);
    }

  }, [movesLeft]);

  // =========================================
  // FLOATING TEXT
  // =========================================

  const showText = (text) => {

    const id = Math.random();

    setFloatingTexts((prev) => [
      ...prev,
      { id, text },
    ]);

    setTimeout(() => {

      setFloatingTexts((prev) =>
        prev.filter((x) => x.id !== id)
      );

    }, 1200);
  };

  // =========================================
  // DAMAGE BOSS
  // =========================================

  const damageBoss = (damage) => {
    if (!bossMode) return;
    setBossHp((prev) => {
      const next = prev - damage;
      if (next <= 0) {
        showText("👑 BOSS DEFEATED!");
        setShowVictory(true);
        setBossMode(false);
        return 0;
      }
      return next;
    });
  };

  // =========================================
  // BOSS ATTACK
  // =========================================

  const bossAttack = (currentBoard) => {
    const attacks = [
      "😾 LOCKED TILE",
      "🔥 FIRE ROW",
      "💀 SLIME SPREAD",
    ];
    const randomAttack = attacks[Math.floor(Math.random() * attacks.length)];
    setBossAttackText(randomAttack);
    showText(randomAttack);
    if (randomAttack === "😾 LOCKED TILE") {
      const randomIndex = Math.floor(Math.random() * 64);
      currentBoard[randomIndex] = "🔒";
    }
    if (randomAttack === "🔥 FIRE ROW") {
      const row = Math.floor(Math.random() * 8);
      for (let i = 0; i < 8; i++) {
        currentBoard[row * 8 + i] = "";
      }
      gravity(currentBoard);
    }
  };

  // =========================================
  // TRIGGER COMBO FX
  // =========================================

  const triggerComboFx = (combo) => {
    if (combo >= 3) {
      setBigComboText(`🔥 COMBO x${combo}`);
      setTimeout(() => setBigComboText(""), 1200);
    }
    if (combo >= 5) showText("😻 INSANE!");
    if (combo >= 7) showText("👑 GODLIKE!");
  };

  // =========================================
  // SCREEN SHAKE
  // =========================================

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);
  };

  // =========================================
  // FEVER MODE
  // =========================================

  const activateFever = () => {
    setFeverMode(true);
    showText("🌈 CAT FEVER!");
    setTimeout(() => setFeverMode(false), 10000);
  };

  // =========================================
  // SPAWN RAINBOW CAT
  // =========================================

  const spawnRainbowCat = (index, currentBoard) => {
    currentBoard[index] = "🌈";
    showText("🌈 RAINBOW CAT!");
  };

  // =========================================
  // GRAVITY
  // =========================================

  const gravity = (currentBoard, currentIds) => {

    for (let col = 0; col < width; col++) {

      let colVals = [];
      let colIds = [];

      for (let row = 0; row < width; row++) {
        const index = row * width + col;
        if (currentBoard[index] !== "") {
          colVals.push(currentBoard[index]);
          if (currentIds) colIds.push(currentIds[index]);
        }
      }

      while (colVals.length < width) {
        colVals.unshift(randomCat());
        if (currentIds) colIds.unshift(nextId());
      }

      for (let row = 0; row < width; row++) {
        const index = row * width + col;
        currentBoard[index] = colVals[row];
        if (currentIds) currentIds[index] = colIds[row];
      }
    }
  };

  // =========================================
  // BOMB EXPLOSION
  // =========================================

  const explodeBomb = (
    index,
    currentBoard
  ) => {

    const area = [
      index,
      index - 1,
      index + 1,
      index - width,
      index + width,
    ];

    area.forEach((i) => {

      if (
        i >= 0 &&
        i < currentBoard.length
      ) {
        currentBoard[i] = "";
      }

    });

    showText("💥 BOOM");
  };

  // =========================================
  // MATCHES
  // =========================================

  const destroyMatches = (
    currentBoard,
    comboChainChain
  ) => {

    let matched = false;

    // =====================================
    // MATCH 5
    // =====================================

    for (let i = 0; i < 64; i++) {

      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
      ];

      const invalid = [
        4, 5, 6, 7,
        12, 13, 14, 15,
        20, 21, 22, 23,
        28, 29, 30, 31,
        36, 37, 38, 39,
        44, 45, 46, 47,
        52, 53, 54, 55,
        60, 61, 62, 63,
      ];

      if (invalid.includes(i)) continue;

      const decided = currentBoard[i];

      if (
        decided &&
        row.every(
          (sq) => currentBoard[sq] === decided
        )
      ) {

        row.forEach((sq) => {
          currentBoard[sq] = "";
        });

        // SPAWN RAINBOW CAT on match-5
        spawnRainbowCat(i + 2, currentBoard);

        const scoreMultiplier = feverMode ? 2 : 1;
        setScore((prev) => prev + (30 + comboChain * 5) * scoreMultiplier);

        setcomboChain((prev) => prev + 1);

        showText("🌈 SUPER MATCH!");

        matched = true;
      }
    }

    // =====================================
    // MATCH 4 -> BOMB
    // =====================================

    for (let i = 0; i < 64; i++) {

      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
      ];

      const invalid = [
        5, 6, 7,
        13, 14, 15,
        21, 22, 23,
        29, 30, 31,
        37, 38, 39,
        45, 46, 47,
        53, 54, 55,
        61, 62, 63,
      ];

      if (invalid.includes(i)) continue;

      const decided = currentBoard[i];

      if (
        decided &&
        row.every(
          (sq) => currentBoard[sq] === decided
        )
      ) {

        row.forEach((sq) => {
          currentBoard[sq] = "";
        });

        currentBoard[i + 1] = "💣";

        setBombs((prev) => [...prev, i + 1]);

        const scoreMultiplier = feverMode ? 2 : 1;
        setScore((prev) => prev + (20 + comboChain * 4) * scoreMultiplier);

        setcomboChain((prev) => prev + 1);

        showText("💣 BOMB CAT!");

        matched = true;
      }
    }

    // =====================================
    // MATCH 3
    // =====================================

    for (let i = 0; i < 64; i++) {

      const row = [
        i,
        i + 1,
        i + 2,
      ];

      const invalid = [
        6, 7,
        14, 15,
        22, 23,
        30, 31,
        38, 39,
        46, 47,
        54, 55,
        62, 63,
      ];

      if (invalid.includes(i)) continue;

      const decided = currentBoard[i];

      if (
        decided &&
        row.every(
          (sq) => currentBoard[sq] === decided
        )
      ) {

        row.forEach((sq) => {
          currentBoard[sq] = "";
        });

        const scoreMultiplierRow = feverMode ? 2 : 1;
        setScore((prev) => prev + (10 + comboChain * 2) * scoreMultiplierRow);

        setcomboChain((prev) => prev + 1);

        showText(`🐾 COMBO x${comboChain + 1}`);

        matched = true;
      }
    }

    // COLUMN 3

    for (let i = 0; i <= 47; i++) {

      const column = [
        i,
        i + width,
        i + width * 2,
      ];

      const decided = currentBoard[i];

      if (
        decided &&
        column.every(
          (sq) => currentBoard[sq] === decided
        )
      ) {

        column.forEach((sq) => {
          currentBoard[sq] = "";
        });

        const scoreMultiplierCol = feverMode ? 2 : 1;
        setScore((prev) => prev + (10 + comboChain * 2) * scoreMultiplierCol);

        matched = true;
      }
    }

    return matched;
  };

  // =========================================
  // PROCESS BOARD
  // =========================================

  const processBoard = async (currentBoard, currentIds) => {

    let matched = true;
    let comboChainChain = 0;

    while (matched) {

      matched = destroyMatches(currentBoard, comboChainChain);

      if (matched) {

        comboChainChain++;
        setcomboChain(comboChainChain);
        damageBoss(10 + comboChainChain * 5);
        triggerComboFx(comboChainChain);
        if (comboChainChain >= 4) triggerShake();
        if (comboChainChain % 3 === 0) bossAttack(currentBoard);
        if (Math.random() < 0.08) activateFever();

        gravity(currentBoard, currentIds);
        setTileIds([...currentIds]);
        setBoard([...currentBoard]);

        await new Promise((r) => setTimeout(r, 250));
      }
    }

    setcomboChain(0);
    setBoard([...currentBoard]);
    setTileIds([...currentIds]);
  };

  // =========================================
  // CLICK TILE
  // =========================================

  const handleClick = async (index) => {

    // LOCKED TILE — skip
    if (board[index] === "🔒") {
      showText("🔒 Locked!");
      return;
    }

    // RAINBOW CAT click
    if (board[index] === "🌈") {
      if (selected !== null && board[selected] !== "🌈") {
        const target = board[selected];
        const newBoard = [...board];
        const newIds = [...tileIds];
        for (let i = 0; i < newBoard.length; i++) {
          if (newBoard[i] === target) newBoard[i] = "";
        }
        gravity(newBoard, newIds);
        setBoard([...newBoard]);
        setTileIds([...newIds]);
        showText("🌈 MEGA CLEAR!");
        const scoreMultiplier = feverMode ? 2 : 1;
        setScore((prev) => prev + 120 * scoreMultiplier);
        damageBoss(50);
        triggerShake();
        setSelected(null);
        return;
      }
      setSelected(index);
      return;
    }

    // BOMB

    if (board[index] === "💣") {
      const newBoard = [...board];
      const newIds = [...tileIds];
      explodeBomb(index, newBoard);
      gravity(newBoard, newIds);
      setBoard([...newBoard]);
      setTileIds([...newIds]);
      setScore((prev) => prev + 40);
      return;
    }

    // FIRST SELECT

    if (selected === null) {

      setSelected(index);

      return;
    }

    // VALID MOVE

    const validMoves = [
      selected - 1,
      selected + 1,
      selected - width,
      selected + width,
    ];

    if (!validMoves.includes(index)) {

      setSelected(index);

      return;
    }

    // SWAP

    const newBoard = [...board];
    const newIds = [...tileIds];

    const temp = newBoard[selected];
    newBoard[selected] = newBoard[index];
    newBoard[index] = temp;

    const tempId = newIds[selected];
    newIds[selected] = newIds[index];
    newIds[index] = tempId;

    // CHECK IF MATCH EXISTS

    const hasMatchNow = detectMatch(newBoard);

    // VALID MOVE

    if (hasMatchNow) {

      setMovesLeft((prev) => prev - 1);
      setBoard([...newBoard]);
      setTileIds([...newIds]);

      await processBoard(newBoard, newIds);

    } else {

      // ROLLBACK

      const rollback =
        newBoard[selected];

      newBoard[selected] =
        newBoard[index];

      newBoard[index] = rollback;

      setBoard([...newBoard]);

      showText("❌ No Match");
    }

    setSelected(null);
  };
  // =========================================
  // BARU
  // =========================================
  const detectMatch = (currentBoard) => {

    // ROW

    for (let i = 0; i < 64; i++) {

      const row = [
        i,
        i + 1,
        i + 2,
      ];

      const invalid = [
        6, 7,
        14, 15,
        22, 23,
        30, 31,
        38, 39,
        46, 47,
        54, 55,
        62, 63,
      ];

      if (invalid.includes(i)) continue;

      const decided = currentBoard[i];

      if (
        decided &&
        row.every(
          (sq) =>
            currentBoard[sq] === decided
        )
      ) {
        return true;
      }
    }

    // COLUMN

    for (let i = 0; i <= 47; i++) {

      const column = [
        i,
        i + width,
        i + width * 2,
      ];

      const decided = currentBoard[i];

      if (
        decided &&
        column.every(
          (sq) =>
            currentBoard[sq] === decided
        )
      ) {
        return true;
      }
    }

    return false;
  };
  // =========================================
  // NEXT LEVEL
  // =========================================

  const nextLevel = () => {

    if (
      level < levels.length - 1
    ) {

      const next = level + 1;

      setLevel(next);

      setScore(0);

      setMovesLeft(
        levels[next].moves
      );

      setShowVictory(false);

      setBoard(createBoard());

    } else {

      setGameStarted(false);
    }
  };

  // =========================================
  // MAIN MENU
  // =========================================

  if (showCredits) {
    return <Credits setShowCredits={setShowCredits} paws={paws} />;
  }

  if (!gameStarted) {

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

        <div className="
          absolute
          inset-0
          overflow-hidden
        ">

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
                duration:
                  12 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}

              className="
                absolute
                text-4xl
              "
            >
              🐾
            </motion.div>

          ))}

        </div>

        <div className="
          bg-white/40
          backdrop-blur-md
          p-10
          rounded-[40px]
          shadow-xl
          max-w-xl
          w-full
          relative
          z-10
        ">

          <h1 className="
            text-6xl
            font-black
            text-center
            text-orange-700
            mb-4
          ">
            🐱 CAT KINGDOM
          </h1>

          <p className="
            text-center
            text-orange-700/70
            mb-8
          ">
            Match cats. Create comboChains.
            Become the Meow Master ✨
          </p>

          <div className="space-y-4">

            {levels.map((lvl, idx) => (

              <button
                key={idx}

                onClick={() => {

                  setLevel(idx);

                  setMovesLeft(
                    levels[idx].moves
                  );

                  setScore(0);

                  setGameStarted(true);
                }}

                className="
                  w-full
                  p-5
                  rounded-3xl
                  bg-white/60
                  text-left
                  hover:scale-[1.02]
                  transition-all
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
                  mt-2
                  text-orange-700/70
                ">
                  🎯 {lvl.target} score
                </div>

                <div className="
                  text-orange-700/70
                ">
                  🎮 {lvl.moves} moves
                </div>

              </button>

            ))}

            <button
              onClick={() => setShowCredits(true)}
              className="
                w-full
                p-5
                rounded-3xl
                bg-orange-500
                text-white
                text-center
                hover:scale-[1.02]
                transition-all
                shadow-md
              "
            >
              <div className="
                text-2xl
                font-black
              ">
                KREDIT LENGKAP
              </div>
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =========================================
  // GAME
  // =========================================

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-orange-100
      via-yellow-200
      to-amber-300
      flex
      items-center
      justify-center
      p-6
      relative
      overflow-hidden
    ">

      {/* FLOATING PAWS */}

      <div className="
        absolute
        inset-0
        overflow-hidden
      ">

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
              duration:
                12 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}

            className="
              absolute
              text-4xl
            "
          >
            🐾
          </motion.div>

        ))}

      </div>

      <motion.div
        animate={screenShake ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="
          bg-white/40
          backdrop-blur-md
          rounded-[40px]
          p-6
          shadow-xl
          max-w-5xl
          w-full
          relative
          z-10
          overflow-hidden
        "
      >

        {/* FEVER BACKGROUND */}
        {feverMode && (
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-400 mix-blend-overlay pointer-events-none rounded-[40px] z-0"
          />
        )}

        {/* BOSS BAR */}
        {bossMode && (
          <div className="mb-5 relative z-10">
            <div className="flex justify-between mb-1">
              <span className="text-xl font-black text-orange-700">😾 Vacuum Boss</span>
              <span className="font-black text-orange-700">{bossHp} HP</span>
            </div>
            <div className="w-full h-5 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(bossHp / 300) * 100}%` }}
                transition={{ type: 'spring', stiffness: 80 }}
                className="h-full bg-gradient-to-r from-red-400 to-orange-500 rounded-full"
              />
            </div>
            {bossAttackText && (
              <div className="text-center text-orange-700 font-bold mt-1 text-sm">{bossAttackText}</div>
            )}
          </div>
        )}

        {/* TOP */}

        <div className="
          flex
          justify-between
          items-start
          mb-6
        ">

          <div>

            <h1 className="
              text-5xl
              font-black
              text-orange-700
            ">
              {levels[level].title}
            </h1>

            <div className="
              flex
              gap-3
              mt-4
              flex-wrap
            ">

              <div className="
                bg-white/70
                px-4
                py-2
                rounded-2xl
                font-black
                text-orange-700
              ">
                ⭐ {score}
              </div>

              <div className="
                bg-white/70
                px-4
                py-2
                rounded-2xl
                font-black
                text-orange-700
              ">
                🎮 {movesLeft}
              </div>

            </div>

          </div>

          <button
            onClick={() => {

              setGameStarted(false);

              setShowVictory(false);

              setShowLose(false);

              setScore(0);
            }}

            className="
              px-4
              py-2
              rounded-2xl
              bg-white/70
              font-black
              text-orange-700
            "
          >
            🏠 Menu
          </button>

        </div>

        {/* BOARD */}

        <div
          className="
            grid
            gap-2
            mx-auto
            w-fit
            bg-white/30
            p-4
            rounded-[35px]
          "

          style={{
            gridTemplateColumns:
              `repeat(${width}, 1fr)`,
          }}
        >

          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {board.map((cat, index) => (

                <motion.div
                  key={tileIds[index]}
                  layoutId={String(tileIds[index])}
                  layout

                  onClick={() => handleClick(index)}

                  initial={{ scale: 0.3, opacity: 0, y: -60 }}
                  animate={{
                    scale: selected === index ? 1.14 : 1,
                    opacity: 1,
                    y: 0,
                    rotate: selected === index ? [0, -4, 4, 0] : 0,
                  }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  whileHover={{ scale: 1.12, rotate: 3 }}
                  whileTap={{ scale: 0.85 }}

                  className={`
                  w-14 h-14
                  rounded-[20px]
                  flex
                  items-center
                  justify-center
                  text-3xl
                  cursor-pointer
                  shadow-lg
                  border-4
                  select-none
                  ${cat === "🔒"
                      ? "bg-gray-300 border-gray-400"
                      : cat === "🌈"
                        ? "bg-gradient-to-br from-pink-300 via-yellow-200 to-cyan-300 border-purple-400 shadow-purple-300"
                        : cat === "💣"
                          ? "bg-gray-800 border-red-500"
                          : selected === index
                            ? "bg-yellow-100 border-orange-400 shadow-orange-300"
                            : "bg-white/80 border-white hover:border-orange-200"
                    }
                `}
                >
                  {cat}
                </motion.div>

              ))}
            </AnimatePresence>
          </LayoutGroup>

        </div>

        {/* FLOATING TEXT */}

        <div className="
          fixed
          top-10
          left-1/2
          -translate-x-1/2
          z-50
        ">

          <AnimatePresence>

            {floatingTexts.map((item) => (

              <motion.div
                key={item.id}

                initial={{
                  opacity: 0,
                  y: 20,
                  scale: 0.7,
                }}

                animate={{
                  opacity: 1,
                  y: -30,
                  scale: 1,
                }}

                exit={{
                  opacity: 0,
                }}

                className="
                  text-5xl
                  font-black
                  text-orange-700
                "
              >
                {item.text}
              </motion.div>

            ))}

          </AnimatePresence>

        </div>

        {/* WIN */}

        <AnimatePresence>

          {showVictory && (

            <motion.div
              initial={{
                opacity: 0,
              }}

              animate={{
                opacity: 1,
              }}

              className="
                absolute
                inset-0
                bg-black/40
                rounded-[40px]
                flex
                items-center
                justify-center
              "
            >

              <motion.div
                initial={{
                  scale: 0.7,
                }}

                animate={{
                  scale: 1,
                }}

                className="
                  bg-white
                  rounded-[40px]
                  p-10
                  text-center
                  max-w-md
                  w-full
                "
              >

                <div className="text-8xl">
                  😻
                </div>

                <h1 className="
                  text-5xl
                  font-black
                  text-orange-700
                  mt-4
                ">
                  MEOW WIN!
                </h1>

                <p className="
                  mt-3
                  text-orange-700/70
                ">
                  Kamu berhasil menyelesaikan level!
                </p>

                <button
                  onClick={nextLevel}

                  className="
                    mt-6
                    w-full
                    py-4
                    rounded-2xl
                    bg-orange-400
                    text-white
                    font-black
                    text-xl
                  "
                >
                  NEXT LEVEL 🐱
                </button>

              </motion.div>

            </motion.div>

          )}

        </AnimatePresence>

        {/* LOSE */}

        <AnimatePresence>

          {showLose && (

            <motion.div
              initial={{
                opacity: 0,
              }}

              animate={{
                opacity: 1,
              }}

              className="
                absolute
                inset-0
                bg-black/40
                rounded-[40px]
                flex
                items-center
                justify-center
              "
            >

              <div className="
                bg-white
                p-10
                rounded-[40px]
                text-center
                max-w-md
                w-full
              ">

                <div className="text-8xl">
                  😿
                </div>

                <h1 className="
                  text-5xl
                  font-black
                  text-orange-700
                  mt-4
                ">
                  GAME OVER
                </h1>

                <button
                  onClick={() => {

                    setScore(0);

                    setMovesLeft(
                      levels[level].moves
                    );

                    setShowLose(false);

                    setBoard(createBoard());
                  }}

                  className="
                    mt-6
                    w-full
                    py-4
                    rounded-2xl
                    bg-orange-400
                    text-white
                    font-black
                    text-xl
                  "
                >
                  TRY AGAIN 🐾
                </button>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

        {/* BIG COMBO TEXT */}
        <AnimatePresence>
          {bigComboText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.4 }}
              className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            >
              <div className="text-7xl font-black text-yellow-300 drop-shadow-2xl">
                {bigComboText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

    </div>
  );
}