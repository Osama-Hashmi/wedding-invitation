import { useEffect, useRef, useState } from "react";
import "./Baraat.css";

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

      ctx.scale(dpr, dpr);

      // Scratch surface
      ctx.fillStyle = "#b33a3a";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Gold pattern
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

      // Center text
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

function Baraat() {
  const audioRef = useRef(null);

useEffect(() => {
  document.title = "Baraat Invitation";

  const audio = audioRef.current;
  if (!audio) return;

  audio.currentTime = 30;

  const playSong = () => {
    audio.currentTime = 30;

    audio.play().catch(() => {
      // Browser still blocked autoplay
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

  return () => {
    document.removeEventListener("pointerdown", handleFirstInteraction);
    document.removeEventListener("touchstart", handleFirstInteraction);
    document.removeEventListener("click", handleFirstInteraction);

    audio.pause();
    audio.currentTime = 0;
  };
}, []);


  return (
    <main className="baraat-page">

      {/* BARAAT SONG */}
      <audio ref={audioRef} loop preload="auto">
        <source
            src="/music/Mere%20Haath%20Mein.mp3"
            type="audio/mpeg"
        />
      </audio>

      {/* ================= HERO ================= */}

      <section className="baraat-hero">

        <div className="corner-flower top-left">❧</div>
        <div className="corner-flower top-right">❧</div>

        <div className="bismillah">
          ﷽
        </div>

        <p className="parents">
          MR. & MRS. ASHRAF ALI
        </p>

        <p className="invite-line">
          CORDIALLY INVITE YOU AT THE
        </p>

        <h2 className="ceremony-name">
          BARAAT CEREMONY
        </h2>

        <p className="invite-line">
          OF THEIR BELOVED DAUGHTER
        </p>

        <h1 className="bride-name">
          Areeba Ashraf
        </h1>

        <div className="ornament-line">
          <span></span>
          <b>❦</b>
          <span></span>
        </div>

        <p className="with-word">
          with
        </p>

        <h2 className="groom-name">
          Syed Muhammad Osama Ali Hashmi
        </h2>

        <p className="son-of">
          S/O. MR. & MRS. SYED ASIM ALI HASHMI
        </p>

      </section>

      {/* ================= DATE ================= */}

      <section className="date-section">

        <div className="gold-emblem">✦</div>

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

      {/* ================= EVENT DETAILS ================= */}

      <section className="details-section">

        <p className="section-label">
          SAVE THE DATE
        </p>

        <h2 className="section-heading">
          The Celebration
        </h2>

        {/* <div className="event-date">

          <div className="date-side">
            <span>SATURDAY</span>
          </div>

          <div className="big-date">
            <strong>31</strong>
            <span>OCT</span>
            <small>2026</small>
          </div>

          <div className="date-side">
            <span>9:00 PM</span>
          </div>

        </div> */}

      </section>

      {/* ================= VENUE ================= */}

      <section className="venue-section">

        <div className="venue-flower">❧</div>

        <p className="section-label">
          THE VENUE
        </p>

        <h2 className="venue-name">
          The Manor Banquet
        </h2>

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

      {/* ================= PROGRAM ================= */}

      <section className="program-section">

        <p className="section-label">
          PROGRAMME
        </p>

        <h2 className="section-heading">
          Evening Details
        </h2>

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

      {/* ================= WELCOME ================= */}

      <section className="welcome-section">

        <div className="gold-emblem">✦</div>

        <p className="welcome-title">
          AWAITING TO WELCOME
        </p>

        <h2>
          All Family Members
        </h2>

        <p className="welcome-message">
          Your presence, prayers and blessings
          <br />
          will make our celebration even more special.
        </p>

      </section>

      {/* RSVP / CONTACT */}

<section className="rsvp-section">

  <p className="section-label">
    RSVP
  </p>

  <h2 className="section-heading">
    For Any Assistance
  </h2>

  <div className="rsvp-card">

    <div className="rsvp-person">
      <h3>Ashraf Ali</h3>
      <a href="tel:XXXXXXXXXXX">
        XXXXXXXX
      </a>
    </div>

  </div>

</section>

      {/* ================= FOOTER ================= */}

      <footer className="baraat-footer">

        <div className="footer-ornament">
          ❦
        </div>

        <p>
          With Love & Blessings
        </p>

        <strong>
          Areeba & Osama
        </strong>

      </footer>

    </main>
  );
}

export default Baraat;