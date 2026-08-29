import { useEffect, useRef, useState } from "react";
import "./Baraat.css";

/* ================================================= */
/* ================= SCRATCH DATE ================== */
/* ================================================= */

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

      ctx.fillStyle = "#b33a3a";
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = "rgba(235, 204, 139, 0.18)";

      for (let x = -rect.height; x < rect.width; x += 25) {
        ctx.save();

        ctx.translate(x, 0);
        ctx.rotate(Math.PI / 4);

        for (let y = 0; y < rect.height + rect.width; y += 35) {
          ctx.beginPath();
          ctx.arc(0, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      ctx.fillStyle = "#f8ead5";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = "600 12px Montserrat, sans-serif";

      ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2 - 10);

      ctx.font = "11px Montserrat, sans-serif";

      ctx.fillText("your special date", rect.width / 2, rect.height / 2 + 15);
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

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

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

  const startScratch = () => {
    scratching.current = true;
  };

  const stopScratch = () => {
    scratching.current = false;
  };

  return (
    <div className={`scratch-wrapper ${revealed ? "revealed" : ""}`}>
      <div className="date-underneath">
        <span className="date-day">31</span>

        <span className="date-month">OCTOBER</span>

        <span className="date-year">2026</span>

        <small>SATURDAY</small>
      </div>

      <canvas
        ref={canvasRef}
        className="scratch-canvas"
        onPointerDown={startScratch}
        onPointerUp={stopScratch}
        onPointerLeave={stopScratch}
        onPointerMove={scratch}
        onPointerCancel={stopScratch}
      />
    </div>
  );
}

/* ================================================= */
/* ================= COUNTDOWN ===================== */
/* ================================================= */

function Countdown() {
  const targetDate = new Date("2026-10-31T22:00:00+05:00").getTime();

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
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),

      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),

      minutes: Math.floor((difference / (1000 * 60)) % 60),

      seconds: Math.floor((difference / 1000) % 60),
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

/* ================================================= */
/* ================= BARAAT ======================== */
/* ================================================= */

function Baraat() {
  const audioRef = useRef(null);

  const [curtainOpen, setCurtainOpen] = useState(false);

  /* ================================================= */
  /* ================= PAGE SETUP ==================== */
  /* ================================================= */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    document.title = "Baraat Invitation";

    document.body.classList.add("baraat-curtain-locked");

    return () => {
      document.body.classList.remove("baraat-curtain-locked");
    };
  }, []);

  /* ================================================= */
  /* ================= OPEN CURTAIN ================== */
  /* ================================================= */

  const openCurtain = () => {
    if (curtainOpen) return;

    const audio = audioRef.current;

    /* ================= CURTAIN OPEN ================= */

    setCurtainOpen(true);

    /* ================= PAGE SCROLL UNLOCK =========== */

    document.body.classList.remove("baraat-curtain-locked");

    /* ================= SONG START FROM 31 SEC ======= */

    if (audio) {
      audio.currentTime = 31;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Song could not start:", error);
        });
      }
    }
  };

  /* ================================================= */
  /* ================= SONG ========================== */
  /* ================================================= */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.load();

    return () => {
      audio.pause();

      audio.currentTime = 31;
    };
  }, []);

  return (
    <main className="baraat-page">
      {/* ================================================= */}
      {/* ================= BARAAT SONG =================== */}
      {/* ================================================= */}

      <audio ref={audioRef} loop preload="auto" playsInline>
        <source src="/music/Mere%20Haath%20Mein.mp3" type="audio/mpeg" />
      </audio>

      {/* ================================================= */}
      {/* ================= CLOTH CURTAIN ================= */}
      {/* ================================================= */}

      <div className={`baraat-curtain ${curtainOpen ? "curtain-open" : ""}`}>
        {/* ================= LEFT CURTAIN ================= */}

        <div className="curtain-panel curtain-left">
          <div className="curtain-folds"></div>
        </div>

        {/* ================= RIGHT CURTAIN ================ */}

        <div className="curtain-panel curtain-right">
          <div className="curtain-folds"></div>
        </div>

        {/* ================================================= */}
        {/* ================= CENTER CONTENT ================ */}
        {/* ================================================= */}

        <div className="curtain-center-content">
          <div className="curtain-small-text">THE WEDDING CELEBRATION</div>

          <div className="curtain-ornament">❦</div>

          <h1>Baraat</h1>

          <p>A Celebration of Love</p>

          {/* ================= GOLDEN BUTTON ================ */}

          <button
            type="button"
            className="curtain-open-button"
            onClick={openCurtain}
            aria-label="Open Baraat Invitation"
          >
            <span className="button-inner">
              <span className="button-symbol">✦</span>
            </span>
          </button>

          <div className="curtain-button-text">TAP TO OPEN</div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ================= HERO ========================== */}
      {/* ================================================= */}

      <section className="baraat-hero">
        <div className="hero-pattern"></div>

        <div className="corner-flower top-left">❧</div>

        <div className="corner-flower top-right">❧</div>

        <div className="bismillah">﷽</div>

        <p className="parents">MR. & MRS. ADVOCATE ASHRAF ALI</p>

        <p className="parents">
          Granddaughter of Mr. Sheikh Abdul Latif (Late) & Mr. Wasi Uddin Warsi
          (Late)
        </p>

        <p className="invite-line">CORDIALLY INVITE YOU TO THE</p>

        <h2 className="ceremony-name">BARAAT CEREMONY</h2>

        <p className="invite-line">OF THEIR BELOVED DAUGHTER</p>

        <h1 className="bride-name">Areeba Ashraf</h1>

        <p className="person-title">The Bride</p>

        {/* ================= COUPLE VISUALS ================= */}

        <div className="couple-visuals">
          <div className="person-visual bride-visual">
            <div className="person-glow"></div>

            <img src="/images/baraat-bride.png" alt="Bride" />
          </div>

          <div className="couple-center">
            <div className="ornament-line">
              <span></span>

              <b>❦</b>

              <span></span>
            </div>

            <p className="with-word">WITH</p>
          </div>

          <div className="person-visual groom-visual">
            <div className="person-glow"></div>

            <img src="/images/baraat-groom.png" alt="Groom" />
          </div>
        </div>

        <h2 className="groom-name">Syed Muhammad Osama Ali Hashmi</h2>

        <p className="person-title">The Groom</p>

        <p className="son-of">S/O MR. & MRS. SYED ASIM ALI HASHMI</p>

        <div className="hero-bottom-ornament">✦</div>
      </section>

      {/* ================================================= */}
      {/* ================= DATE ========================== */}
      {/* ================================================= */}

      <section className="date-section">
        <div className="gold-emblem">✦</div>

        <p className="section-label">A DATE TO REMEMBER</p>

        <h2 className="section-heading">Scratch to Reveal</h2>

        <ScratchDate />

        <p className="scratch-note">
          Gently scratch the card to reveal our special day
        </p>
      </section>

      {/* ================================================= */}
      {/* ================= COUNTDOWN ===================== */}
      {/* ================================================= */}

      <section className="details-section">
        <p className="section-label">SAVE THE DATE</p>

        <h2 className="section-heading">The Baraat</h2>

        <Countdown />
      </section>

      {/* ================================================= */}
      {/* ================= VENUE ========================= */}
      {/* ================================================= */}

      <section className="venue-section">
        <div className="venue-flower">❧</div>

        <p className="section-label">THE VENUE</p>

        <h2 className="venue-name">The Manor Banquet</h2>

        <div className="venue-line"></div>

        <p className="venue-address">
          Shahra-e-Faisal
          <br />
          Darwaish Colony
          <br />
          Karachi
        </p>

        <a
          href="https://maps.app.goo.gl/9kn7oBToppmW7R9f6"
          target="_blank"
          rel="noreferrer"
          className="map-button"
        >
          <span>⌖</span>
          GET DIRECTIONS
          <b>→</b>
        </a>
      </section>

      {/* ================================================= */}
      {/* ================= PROGRAM ======================= */}
      {/* ================================================= */}

      <section className="program-section">
        <p className="section-label">PROGRAMME</p>

        <h2 className="section-heading">Evening Details</h2>

        <div className="program-list">
          <div className="program-row">
            <span>ARRIVAL OF BARAAT</span>

            <b>09:00 PM</b>
          </div>

          <div className="program-row">
            <span>DINNER</span>

            <b>10:00 PM</b>
          </div>

          <div className="program-row">
            <span>RUKHSATI</span>

            <b>11:00 PM</b>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* ================= WELCOME ======================= */}
      {/* ================================================= */}

      <section className="welcome-section">
        <div className="gold-emblem">✦</div>

        <p className="welcome-title">AWAITING TO WELCOME</p>

        <h2>OUR BELOVED FAMILY & FRIENDS</h2>

        <p className="welcome-message">
          Your presence, prayers and blessings
          <br />
          will make our celebration even more special.
        </p>
      </section>

      {/* ===================================================
          Awaiting To Welcome
          =================================================== */}

      <section className="awaiting-section">
        {" "}
        <div className="awaiting-container">
          {" "}
          <h2>Awaiting to Welcome</h2>{" "}
          <div className="awaiting-card">
            {" "}
            <div className="awaiting-column awaiting-left">
              {" "}
              <div className="guest-name">
                Mr & Mrs Advocate Ashraf Ali
              </div>{" "}
              <div className="guest-name">Mr & Mrs Muhammad Ali</div>{" "}
              <div className="guest-name">Mr & Mrs Ahmed Ali</div>{" "}
              <div className="guest-name">Mr & Mrs Advocate Hyder Ali</div>{" "}
              <div className="guest-name">
                Mr & Mrs Syed Salman Ali Hashmi
              </div>{" "}
            </div>{" "}
            <div className="awaiting-column awaiting-right">
              {" "}
              <div className="guest-name">Mr & Mrs Sardar Hussain</div>{" "}
              <div className="guest-name">Mr & Mrs Afzal Hussain</div>{" "}
              <div className="guest-name">Mr & Mrs Iqbal Hussain</div>{" "}
              <div className="guest-name">Mr & Mrs Affal Hussain</div>{" "}
              <div className="guest-name">Mr & Mrs Kamran Hussain</div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>

      {/* ================================================= */}
      {/* ================= RSVP ========================== */}
      {/* ================================================= */}

      <section className="rsvp-section">
        <p className="section-label">RSVP</p>

        <h2 className="section-heading">For Any Assistance</h2>

        <div className="rsvp-card">
          <div className="rsvp-person">
            <h3>Advocate Ashraf Ali</h3>

            <a href="tel:03342595325">03342595325</a>
          </div>

          <div className="rsvp-person">
            <h3>Syed Salman Ali Hashmi</h3>

            <a href="tel:03219242503">03219242503</a>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* ================= FOOTER ======================== */}
      {/* ================================================= */}

      <footer className="baraat-footer">
        <div className="footer-ornament">❦</div>

        <p>WITH LOVE & BLESSINGS</p>

        <strong>Areeba & Osama</strong>
      </footer>
    </main>
  );
}

export default Baraat;
