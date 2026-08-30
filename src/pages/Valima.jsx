import { useEffect, useRef, useState } from "react";
import "./Valima.css";

/* =========================================================
   SCRATCH DATE
   ========================================================= */

function ScratchDate() {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const scratching = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      ctx.fillStyle = "#d8c7a0";
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = "rgba(255,255,255,0.3)";

      for (let x = -rect.height; x < rect.width; x += 28) {
        ctx.save();

        ctx.translate(x, 0);
        ctx.rotate(Math.PI / 4);

        for (let y = 0; y < rect.height + rect.width; y += 38) {
          ctx.beginPath();
          ctx.arc(0, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      ctx.fillStyle = "#fffaf0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = "600 12px Montserrat, sans-serif";

      ctx.fillText(
        "SCRATCH TO REVEAL",
        rect.width / 2,
        rect.height / 2 - 10
      );

      ctx.font = "11px Montserrat, sans-serif";

      ctx.fillText(
        "your special date",
        rect.width / 2,
        rect.height / 2 + 15
      );
    };

    setupCanvas();

    window.addEventListener("resize", setupCanvas);

    return () => {
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  const checkReveal = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const pixels = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    let transparent = 0;
    const total = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 100) {
        transparent++;
      }
    }

    const percentage = (transparent / total) * 100;

    if (percentage > 42) {
      setRevealed(true);

      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
    }
  };

  const scratch = (e) => {
    if (!scratching.current || revealed) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    checkReveal();
  };

  return (
    <div
      className={
        revealed
          ? "scratch-wrapper revealed"
          : "scratch-wrapper"
      }
    >
      <div className="date-underneath">
        <span className="date-day">02</span>

        <span className="date-month">NOVEMBER</span>

        <span className="date-year">2026</span>

        <small>MONDAY</small>
      </div>

      <canvas
        ref={canvasRef}
        className="scratch-canvas"
        onPointerDown={() => {
          scratching.current = true;
        }}
        onPointerUp={() => {
          scratching.current = false;
        }}
        onPointerLeave={() => {
          scratching.current = false;
        }}
        onPointerMove={scratch}
        onPointerCancel={() => {
          scratching.current = false;
        }}
      />
    </div>
  );
}

/* =========================================================
   COUNTDOWN
   ========================================================= */

function Countdown() {
  const targetDate = new Date(
    "2026-11-02T21:00:00+05:00"
  ).getTime();

  const calculateTime = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ),

      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      ),

      minutes: Math.floor(
        (difference / (1000 * 60)) % 60
      ),

      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    };
  };

  const [time, setTime] = useState(calculateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const format = (number) => {
    return String(number).padStart(2, "0");
  };

  return (
    <div className="countdown">
      <div className="countdown-box">
        <strong>{time.days}</strong>
        <span>DAYS</span>
      </div>

      <div className="countdown-box">
        <strong>{format(time.hours)}</strong>
        <span>HOURS</span>
      </div>

      <div className="countdown-box">
        <strong>{format(time.minutes)}</strong>
        <span>MINUTES</span>
      </div>

      <div className="countdown-box">
        <strong>{format(time.seconds)}</strong>
        <span>SECONDS</span>
      </div>
    </div>
  );
}

/* =========================================================
   VALIMA
   ========================================================= */

function Valima() {
  const audioRef = useRef(null);

  const [introStarted, setIntroStarted] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  /* =======================================================
     PAGE SETUP
     ======================================================= */

  useEffect(() => {
    document.title = "Valima Invitation";

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  /* =======================================================
     OPEN INTRO + START MUSIC
     ======================================================= */

  const handleOpen = async () => {
    if (introStarted) return;

    setIntroStarted(true);

    const audio = audioRef.current;

    if (audio) {
      try {
        audio.currentTime = 60;

        await audio.play();

        setMusicOn(true);

        console.log(
          "Valima music started at 60 seconds"
        );
      } catch (error) {
        console.log(
          "Music could not start:",
          error
        );
      }
    }

    setTimeout(() => {
      setIntroFinished(true);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }, 2600);
  };

  /* =======================================================
     MUSIC TOGGLE
     ======================================================= */

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();

        setMusicOn(true);
      } else {
        audio.pause();

        setMusicOn(false);
      }
    } catch (error) {
      console.log(
        "Music toggle error:",
        error
      );
    }
  };

  return (
    <main className="valima-page">

      {/* ===================================================
          INTRO
          =================================================== */}

      {!introFinished && (
        <div
          className={
            introStarted
              ? "valima-intro intro-started"
              : "valima-intro"
          }
        >
          <div className="intro-glow"></div>

          <div className="intro-ring ring-one"></div>
          <div className="intro-ring ring-two"></div>
          <div className="intro-ring ring-three"></div>

          <div className="intro-center">
            <div className="intro-symbol">✦</div>

            <p>WITH LOVE & BLESSINGS</p>

            <h1>Valima</h1>

            <span>
              02 • NOVEMBER • 2026
            </span>

            <button
              type="button"
              className="valima-open-button"
              onClick={handleOpen}
              disabled={introStarted}
            >
              <span>✦</span>

              {introStarted
                ? "OPENING..."
                : "TAP TO OPEN"}
            </button>
          </div>

          <div className="intro-left"></div>
          <div className="intro-right"></div>
        </div>
      )}

      {/* ===================================================
          MUSIC
          =================================================== */}

      <audio
        ref={audioRef}
        loop
        preload="auto"
        playsInline
      >
        <source
          src="/music/Mere%20Bina.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* ===================================================
          HERO
          =================================================== */}

      <section className="valima-hero">
        <div className="hero-ornament top">
          ❦
        </div>

        <div className="hero-content">

          <p className="bismillah">
            ﷽
          </p>

          <p className="parents">
            MR. & MRS. SYED ASIM ALI HASHMI
          </p>

          <p className="parents">
            Grandson of Mr. Syed Qasim Ali Hashmi (Late) & Mr Muhammad Jaleel
            Uddin (Late)
          </p>

          <p className="invite-line">
            INVITE YOU TO THE
          </p>

          <h2 className="ceremony-title">
            VALIMA RECEPTION
          </h2>

          <p className="invite-line">
            OF THEIR BELOVED SON
          </p>

          {/* ================= COUPLE ================= */}

          <div className="couple-area">

            <div className="couple-image couple-left">
              <div className="image-frame">
                <img
                  src="/images/boy.png"
                  alt="Groom"
                />
              </div>
            </div>

            <div className="couple-names">

              <h1 className="groom-name">
                Syed Muhammad Osama Ali Hashmi
              </h1>

              <p className="person-title">
                The Groom
              </p>

              <div className="gold-divider">

                <span></span>

                <b>❦</b>

                <span></span>

              </div>

              <p className="with-word">
                WITH
              </p>

              <h1 className="bride-name">
                Daughter of Advocate Ashraf Ali
              </h1>

              <p className="person-title">
                The Bride
              </p>

            </div>

            <div className="couple-image couple-right">
              <div className="image-frame">
                <img
                  src="/images/girl.png"
                  alt="Bride"
                />
              </div>
            </div>

          </div>

          <div className="hero-bottom-ornament">
            ✦
          </div>

        </div>
      </section>

      {/* ===================================================
          DATE
          =================================================== */}

      <section className="valima-date-section">

        <p className="section-label">
          A DATE TO REMEMBER
        </p>

        <h2 className="section-heading">
          Scratch to Reveal
        </h2>

        <ScratchDate />

        <p className="scratch-note">
          Gently scratch the card to reveal our special day
        </p>

      </section>

      {/* ===================================================
          COUNTDOWN
          =================================================== */}

      <section className="valima-event-section">

        <p className="section-label">
          SAVE THE DATE
        </p>

        <h2 className="section-heading">
          The Valima
        </h2>

        <Countdown />

      </section>

      {/* ===================================================
          VENUE
          =================================================== */}

      <section className="valima-venue-section">

        <div className="venue-symbol">
          ✦
        </div>

        <p className="section-label">
          THE VENUE
        </p>

        <h2 className="venue-name">
          Dolee Banquet
        </h2>

        <div className="venue-divider"></div>

        <p className="venue-address">
          Dolly Banquet Road
          <br />
          Near Continental Bakery
          <br />
          Block 15, Gulistan-e-Johar
          <br />
          Karachi
        </p>

        <a
          href="https://maps.app.goo.gl/cGEdmmfYR2wYfpf4A"
          target="_blank"
          rel="noreferrer"
          className="map-button"
        >
          <span>⌖</span>

          GET DIRECTIONS

          <b>→</b>
        </a>

      </section>

      {/* ===================================================
          PROGRAM
          =================================================== */}

      <section className="valima-program-section">

        <p className="section-label">
          PROGRAMME
        </p>

        <h2 className="section-heading">
          Evening Details
        </h2>

        <div className="program-list">

          <div className="program-row">
            <span>
              GUEST ARRIVAL
            </span>

            <b>
              09:00 PM
            </b>
          </div>

          <div className="program-row">
            <span>
              RECEPTION
            </span>

            <b>
              10:00 PM
            </b>
          </div>

          <div className="program-row">
            <span>
              DINNER
            </span>

            <b>
              11:00 PM
            </b>
          </div>

        </div>

      </section>

      {/* ===================================================
          WELCOME
          =================================================== */}

      <section className="valima-welcome-section">

        <div className="gold-emblem">
          ✦
        </div>

        <p className="welcome-title">
          YOUR PRESENCE
        </p>

        <h2>
          MEANS THE WORLD
        </h2>

        <p className="welcome-message">
          Your presence, prayers and blessings
          <br />
          will make our celebration truly special.
        </p>

      </section>

      {/* ===================================================
          AWAITING TO WELCOME
          =================================================== */}

      <section className="awaiting-section-valima">

        <div className="awaiting-container">

          <h2>
            Awaiting to Welcome
          </h2>

          <div className="awaiting-card">

            <div className="awaiting-column awaiting-left">

              <div className="guest-name">Mr & Mrs Syed Asim Ali Hashmi</div>
              <div className="guest-name">Mr & Mrs Syed Salman Ali Hashmi</div>

            </div>

            <div className="awaiting-column awaiting-right">

              <div className="guest-name">Mr & Mrs Abdul Aziz</div>
              <div className="guest-name">Mr & Mrs Ghazanfar Ali</div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================
          RSVP
          =================================================== */}

      <section className="rsvp-section">

        <p className="section-label">
          RSVP
        </p>

        <h2 className="section-heading">
          For Any Assistance
        </h2>

        <div className="rsvp-card">

          <div className="rsvp-person">

            <h3>
              Syed Asim Ali Hashmi
            </h3>

            <a href="tel:03213539769">
              03213539769
            </a>

          </div>

          <div className="rsvp-person">

            <h3>
              Syed Salman Ali Hashmi
            </h3>

            <a href="tel:03219242503">
              03219242503
            </a>

          </div>

          <div className="rsvp-person">

            <h3>
              Abdul Aziz
            </h3>

            <a href="tel:03362002829">
              03362002829
            </a>

          </div>

          <div className="rsvp-person">

            <h3>
              Ghazanfar Ali
            </h3>

            <a href="tel:03453954353">
              03453954353
            </a>

          </div>

        </div>

      </section>

      {/* ===================================================
          FOOTER
          =================================================== */}

      <footer className="valima-footer">

        <div className="footer-ornament">
          ❦
        </div>

        <p>
          WITH LOVE & BLESSINGS
        </p>

        <strong>
          Syed Muhammad Osama Ali Hashmi
        </strong>

      </footer>

      {/* ===================================================
          MUSIC BUTTON
          =================================================== */}

      {introFinished && (
        <button
          type="button"
          className={`music-button ${
            musicOn ? "playing" : ""
          }`}
          onClick={toggleMusic}
          aria-label={
            musicOn
              ? "Pause music"
              : "Play music"
          }
        >
          <span>
            {musicOn ? "♫" : "♪"}
          </span>
        </button>
      )}

    </main>
  );
}

export default Valima;