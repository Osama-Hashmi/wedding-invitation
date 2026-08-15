import { useEffect, useRef, useState } from "react";
import "./Valima.css";

function ScratchDate() {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const scratching = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

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

  const scratch = (e) => {
    if (!scratching.current || revealed) return;

    const canvas = canvasRef.current;
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

  const checkReveal = () => {
    const canvas = canvasRef.current;
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

  return (
    <div className={`scratch-wrapper ${revealed ? "revealed" : ""}`}>
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

function Valima() {
  const audioRef = useRef(null);

  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    document.title = "Valima Invitation";

    // Always start from the very top
    window.scrollTo(0, 0);

    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 60;

    const playSong = () => {
      audio.currentTime = 60;

      audio.play().catch(() => {
        // Browser may block autoplay
      });
    };

    const handleFirstInteraction = () => {
      playSong();

      document.removeEventListener("pointerdown", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("click", handleFirstInteraction);
    };

    document.addEventListener("pointerdown", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);
    document.addEventListener("click", handleFirstInteraction);

    // Intro animation duration
    const introTimer = setTimeout(() => {
      setIntroFinished(true);

      // Make absolutely sure page starts from top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }, 2800);

    return () => {
      clearTimeout(introTimer);

      document.removeEventListener(
        "pointerdown",
        handleFirstInteraction
      );
      document.removeEventListener(
        "touchstart",
        handleFirstInteraction
      );
      document.removeEventListener(
        "click",
        handleFirstInteraction
      );

      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <main className="valima-page">

      {/* ================= INTRO REVEAL ================= */}

      {!introFinished && (
        <div className="valima-intro">

          <div className="intro-glow"></div>

          <div className="intro-ring ring-one"></div>
          <div className="intro-ring ring-two"></div>
          <div className="intro-ring ring-three"></div>

          <div className="intro-center">
            <div className="intro-symbol">✦</div>

            <p>WITH LOVE & BLESSINGS</p>

            <h1>Valima</h1>

            <span>02 • NOVEMBER • 2026</span>
          </div>

          <div className="intro-left"></div>
          <div className="intro-right"></div>

        </div>
      )}

      {/* MUSIC */}
      <audio ref={audioRef} loop preload="auto">
        <source
          src="/music/Mere%20Bina.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* ================= HERO ================= */}

      <section className="valima-hero">

        <div className="hero-ornament top">❦</div>

        <div className="hero-content">

          <p className="bismillah">﷽</p>

          <p className="parents">
            MR. & MRS. SYED ASIM ALI HASHMI
          </p>

          <p className="invite-line">
            INVITE YOU TO THE
          </p>

          <h2 className="ceremony-title">
            RECEPTION CEREMONY
          </h2>

          <p className="invite-line">
            OF THEIR BELOVED SON
          </p>

          {/* ================= COUPLE AREA ================= */}

          <div className="couple-area">

            {/* BOY IMAGE */}

            <div className="couple-image couple-left">
              <div className="image-frame">
                <img
                  src="/images/boy.png"
                  alt="Groom"
                />
              </div>
            </div>

            {/* CENTER NAMES */}

            <div className="couple-names">

              <h1 className="groom-name">
                Syed Muhammad Osama Ali Hashmi
              </h1>

              <div className="gold-divider">
                <span></span>
                <b>❦</b>
                <span></span>
              </div>

              <p className="with-word">
                with
              </p>

              <h1 className="bride-name">
                Areeba Ashraf
              </h1>

              <p className="daughter-title">
                Daughter of Advocate Ashraf Ali
              </p>

            </div>

            {/* GIRL IMAGE */}

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

      {/* ================= DATE ================= */}

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

      {/* ================= EVENT ================= */}

      <section className="valima-event-section">

        <p className="section-label">
          SAVE THE DATE
        </p>

        <h2 className="section-heading">
          The Celebration
        </h2>

      </section>

      {/* ================= VENUE ================= */}

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
          Block 15 Gulistan-e-Johar
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

      {/* ================= PROGRAM ================= */}

      <section className="valima-program-section">

        <p className="section-label">
          PROGRAMME
        </p>

        <h2 className="section-heading">
          Evening Details
        </h2>

        <div className="program-list">

          <div className="program-row">
            <span>GUEST ARRIVAL</span>
            <b>10:00 PM</b>
          </div>

          <div className="program-row">
            <span>RECEPTION</span>
            <b>10:30 PM</b>
          </div>

          <div className="program-row">
            <span>DINNER</span>
            <b>11:00 PM</b>
          </div>

        </div>

      </section>

      {/* ================= WELCOME ================= */}

      <section className="valima-welcome-section">

        <div className="gold-emblem">
          ✦
        </div>

        <p className="welcome-title">
          YOUR PRESENCE
        </p>

        <h2>
          Means The World
        </h2>

        <p className="welcome-message">
          Your presence, prayers and blessings
          <br />
          will make our celebration truly special.
        </p>

      </section>

      {/* ================= RSVP ================= */}

      <section className="rsvp-section">

        <p className="section-label">
          RSVP
        </p>

        <h2 className="section-heading">
          For Any Assistance
        </h2>

        <div className="rsvp-card">

          <div className="rsvp-person">
            <h3>Syed Asim Ali Hashmi</h3>
            <a href="tel:03213539769">
              03213539769
            </a>
          </div>

          <div className="rsvp-person">
            <h3>Syed Salman Ali Hashmi</h3>
            <a href="tel:03219242503">
              03219242503
            </a>
          </div>

          <div className="rsvp-person">
            <h3>Abdul Aziz</h3>
            <a href="tel:03362002829">
              03362002829
            </a>
          </div>

          <div className="rsvp-person">
            <h3>Ghazanfar Ali</h3>
            <a href="tel:03453954353">
              03453954353
            </a>
          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="valima-footer">

        <div className="footer-ornament">
          ❦
        </div>

        <p>
          With Love & Blessings
        </p>

        <strong>
          Osama & Areeba
        </strong>

      </footer>

    </main>
  );
}

export default Valima;