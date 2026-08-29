import { useEffect, useRef, useState } from "react";
import "./Mehndi2.css";

function Mehndi2() {
  const [opened, setOpened] = useState(false);
  const [scratched, setScratched] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const scratchCardRef = useRef(null);
  const scratchingRef = useRef(false);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  /* =========================================================
     OPEN INVITATION + MUSIC
  ========================================================= */

  const openInvitation = async () => {
    setOpened(true);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    const audio = audioRef.current;

    if (!audio) return;

    try {
      // SONG WILL START FROM 34 SECONDS
      audio.currentTime = 34;
      await audio.play();
      setMusicOn(true);
    } catch (error) {
      setMusicOn(false);
      console.log("Audio could not autoplay:", error);
    }
  };

  /* =========================================================
     MUSIC TOGGLE
  ========================================================= */

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        if (audio.currentTime < 34) {
          audio.currentTime = 34;
        }

        await audio.play();
        setMusicOn(true);
      } catch (error) {
        console.log("Music could not start:", error);
      }
    } else {
      audio.pause();
      setMusicOn(false);
    }
  };

  /* =========================================================
     TITLE
  ========================================================= */

  useEffect(() => {
    document.title = "Osama & Areeba — Mehndi";

    return () => {
      document.title = "Wedding Invitation";
    };
  }, []);

  /* =========================================================
     COUNTDOWN
  ========================================================= */

  useEffect(() => {
    const targetDate = new Date("2026-10-29T21:00:00+05:00").getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

      const minutes = Math.floor((difference / (1000 * 60)) % 60);

      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  /* =========================================================
     SCRATCH CARD
  ========================================================= */

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = scratchCardRef.current;

    if (!canvas || !card || scratched) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    let resizeObserver;

    const setupCanvas = () => {
      const rect = card.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);

      gradient.addColorStop(0, "#f6f0df");
      gradient.addColorStop(0.45, "#e9dfc2");
      gradient.addColorStop(1, "#d5c8a8");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(91, 106, 73, 0.42)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      ctx.strokeRect(16, 16, Math.max(0, width - 32), Math.max(0, height - 32));

      ctx.setLineDash([]);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = "#9b7831";
      ctx.font = "26px 'Cormorant Garamond', serif";
      ctx.fillText("✦", width / 2, height / 2 - 65);

      ctx.fillStyle = "#284c38";
      ctx.font = "600 12px Montserrat, sans-serif";
      ctx.fillText("SCRATCH TO REVEAL", width / 2, height / 2 - 22);

      ctx.fillStyle = "#68735e";
      ctx.font = "400 9px Montserrat, sans-serif";
      ctx.fillText("OUR SPECIAL DATE", width / 2, height / 2 + 8);

      ctx.fillStyle = "#a68438";
      ctx.font = "28px 'Cormorant Garamond', serif";
      ctx.fillText("❦", width / 2, height / 2 + 55);
    };

    setupCanvas();

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        if (!scratched) {
          setupCanvas();
        }
      });

      resizeObserver.observe(card);
    }

    window.addEventListener("resize", setupCanvas);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", setupCanvas);
    };
  }, [scratched]);

  const scratchAtPoint = (clientX, clientY) => {
    const canvas = canvasRef.current;

    if (!canvas || scratched) return;

    const rect = canvas.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");

    ctx.save();

    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();

    const radius = Math.max(22, 30 * Math.min(scaleX, scaleY));

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fill();

    ctx.restore();
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;

    if (!canvas || scratched) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    const width = canvas.width;
    const height = canvas.height;

    if (!width || !height) return;

    const imageData = ctx.getImageData(0, 0, width, height);

    const step = 12;

    let transparentPixels = 0;
    let totalPixels = 0;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;

        totalPixels++;

        if (imageData.data[index + 3] < 100) {
          transparentPixels++;
        }
      }
    }

    if (!totalPixels) return;

    const percentage = transparentPixels / totalPixels;

    if (percentage >= 0.35) {
      setScratched(true);
    }
  };

  const handlePointerDown = (event) => {
    if (scratched) return;

    event.preventDefault();

    scratchingRef.current = true;

    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch (error) {
      // Ignore pointer capture errors
    }

    scratchAtPoint(event.clientX, event.clientY);

    checkScratchProgress();
  };

  const handlePointerMove = (event) => {
    if (!scratchingRef.current || scratched) {
      return;
    }

    event.preventDefault();

    scratchAtPoint(event.clientX, event.clientY);

    checkScratchProgress();
  };

  const handlePointerUp = (event) => {
    if (!scratchingRef.current) return;

    scratchingRef.current = false;

    try {
      if (
        event?.currentTarget?.releasePointerCapture &&
        event.currentTarget.hasPointerCapture?.(event.pointerId)
      ) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch (error) {
      // Ignore pointer capture errors
    }

    checkScratchProgress();
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className={`mehndi2-page ${opened ? "opened" : ""}`}>
      {/* =====================================================
          MUSIC
      ===================================================== */}

      <audio ref={audioRef} loop preload="auto">
        <source src="/music/mehndi2.mp3" type="audio/mpeg" />
      </audio>

      {/* =====================================================
          COVER
      ===================================================== */}

      <section className={`mehndi2-cover ${opened ? "cover-hidden" : ""}`}>
        <div className="cover-glow"></div>

        <div className="cover-pattern"></div>

        <div className="cover-frame frame-one"></div>

        <div className="cover-frame frame-two"></div>

        <div className="cover-flower flower-one">❦</div>

        <div className="cover-flower flower-two">❦</div>

        <div className="cover-flower flower-three">❦</div>

        <div className="cover-flower flower-four">❦</div>

        <div className="cover-content">
          <span className="cover-top">A BEAUTIFUL EVENING AWAITS</span>

          <div className="cover-symbol">✦</div>

          <h1>Mehndi</h1>

          <div className="cover-divider">
            <span></span>

            <b>❦</b>

            <span></span>
          </div>

          <p className="cover-subtitle">A CELEBRATION OF LOVE, COLOUR & JOY</p>

          <div className="cover-couple">
            Osama
            <span>♡</span>
            Areeba
          </div>

          <p className="cover-date">29 · OCTOBER · 2026</p>

          <button
            type="button"
            className="open-button"
            onClick={openInvitation}
          >
            <span className="button-shine"></span>

            <span>✦</span>

            <strong>OPEN INVITATION</strong>

            <b>→</b>
          </button>

          <small className="tap-hint">TAP TO ENTER THE CELEBRATION</small>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="mehndi2-content">
        <div className="green-glow glow-top"></div>

        <div className="green-glow glow-bottom"></div>

        <div className="decor decor-one">❦</div>

        <div className="decor decor-two">❦</div>

        <div className="decor decor-three">✦</div>

        <div className="content-wrapper">
          {/* =================================================
              INTRO
          ================================================= */}

          <section className="intro-section">
            <div className="bismillah">﷽</div>

            <div className="gold-divider">
              <span></span>

              <b>✦</b>

              <span></span>
            </div>

            <p className="family-name">MR. & MRS. SYED ASIM ALI HASHMI</p>

            <p className="invite-line">CORDIALLY INVITE YOU TO THE</p>

            <h2 className="main-script">Mehndi</h2>

            <p className="celebration-label">MEHNDI CELEBRATION</p>

            <div className="gold-divider bottom-divider">
              <span></span>

              <b>❦</b>

              <span></span>
            </div>
          </section>

          {/* =================================================
              COUPLE
          ================================================= */}

          <section className="couple-section">
            <p className="eyebrow">OF THEIR BELOVED SON</p>

            <div className="couple-layout">
              {/* GROOM */}

              <div className="couple-person groom">
                <div className="portrait-frame">
                  <img src="/images/mehndi2-boy.png" alt="Osama" />

                  <div className="portrait-overlay">
                    <span>GROOM</span>
                  </div>
                </div>

                <p className="person-role">GROOM</p>
              </div>

              {/* CENTER */}

              <div className="couple-center">
                <span className="center-flower">❦</span>

                <h2>
                  Osama
                  <span>&</span>
                  Areeba
                </h2>

                <p>TOGETHER WITH</p>

                <div className="tiny-line">
                  <span></span>

                  <b>✦</b>

                  <span></span>
                </div>
              </div>

              {/* BRIDE */}

              <div className="couple-person bride">
                <div className="portrait-frame">
                  <img src="/images/mehndi2-girl.png" alt="Areeba" />

                  <div className="portrait-overlay">
                    <span>BRIDE</span>
                  </div>
                </div>

                <p className="person-role">BRIDE</p>
              </div>
            </div>
          </section>

          {/* =================================================
              MESSAGE
          ================================================= */}

          <section className="message-section">
            <div className="message-icon">✦</div>

            <h2>
              AN EVENING OF
              <br />
              JOY & CELEBRATION
            </h2>

            <p>
              Join us for a joyful evening filled with
              <br className="desktop-only" />
              music, laughter and beautiful memories
              <br className="desktop-only" />
              as we celebrate the groom-to-be.
            </p>

            <div className="message-flower">❧</div>
          </section>

          {/* =================================================
              DATE / SCRATCH
          ================================================= */}

          <section className="date-section">
            <p className="section-heading">A DATE TO REMEMBER</p>

            <p className="section-subheading">
              SCRATCH THE CARD TO DISCOVER OUR SPECIAL DATE
            </p>

            <div
              ref={scratchCardRef}
              className={`scratch-card ${scratched ? "revealed" : ""}`}
            >
              {/* DATE BEHIND SCRATCH */}

              <div className="revealed-date">
                <div className="date-inner">
                  <span className="date-small">SAVE THE DATE</span>

                  <span className="date-number">29</span>

                  <span className="date-month">OCTOBER</span>

                  <span className="date-year">2026</span>

                  <span className="date-day">THURSDAY</span>

                  <div className="date-ornament">❦</div>
                </div>
              </div>

              {/* SCRATCH CANVAS */}

              <canvas
                ref={canvasRef}
                className="scratch-canvas"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
            </div>

            <p className="scratch-note">USE YOUR FINGER OR MOUSE TO SCRATCH</p>

            {/* COUNTDOWN */}

            <div className="countdown-section">
              <p className="countdown-heading">THE CELEBRATION BEGINS IN</p>

              <div className="countdown-grid">
                <div className="count-box">
                  <strong>{timeLeft.days}</strong>

                  <span>DAYS</span>
                </div>

                <div className="count-box">
                  <strong>{timeLeft.hours}</strong>

                  <span>HOURS</span>
                </div>

                <div className="count-box">
                  <strong>{timeLeft.minutes}</strong>

                  <span>MINUTES</span>
                </div>

                <div className="count-box">
                  <strong>{timeLeft.seconds}</strong>

                  <span>SECONDS</span>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              TIMELINE
          ================================================= */}

          <section className="timeline-section">
            <p className="section-heading">AN EVENING TO REMEMBER</p>

            <p className="section-subheading">THREE SPECIAL MOMENTS</p>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-time">
                  <strong>09:00</strong>
                  <small>PM</small>
                </div>

                <div className="timeline-middle">
                  <div className="timeline-dot">✦</div>
                </div>

                <div className="timeline-info">
                  <span>THE GATHERING</span>

                  <h3>Welcome & Gathering</h3>

                  <p>Guests arrive and the celebration begins.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-time">
                  <strong>10:00</strong>
                  <small>PM</small>
                </div>

                <div className="timeline-middle">
                  <div className="timeline-dot">✦</div>
                </div>

                <div className="timeline-info">
                  <span>CELEBRATION</span>

                  <h3>Enjoyment & Celebration</h3>

                  <p>Music, laughter and beautiful moments together.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-time">
                  <strong>11:00</strong>
                  <small>PM</small>
                </div>

                <div className="timeline-middle">
                  <div className="timeline-dot">✦</div>
                </div>

                <div className="timeline-info">
                  <span>DINNER</span>

                  <h3>Dinner</h3>

                  <p>A delicious dinner to complete the evening.</p>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              VENUE
          ================================================= */}

          <section className="venue-section">
            <p className="section-heading">THE VENUE</p>

            <div className="venue-card">
              <div className="venue-icon">⌖</div>

              <h2>Al Hamd 2</h2>

              <p className="venue-label">THE CELEBRATION AWAITS</p>

              <p className="venue-description">
                An evening of celebration,
                <br className="desktop-only" />
                laughter & beautiful memories
              </p>

              <a
                href="https://maps.app.goo.gl/qwEav7kjSr1ZAwscA"
                target="_blank"
                rel="noopener noreferrer"
                className="directions-button"
              >
                <span>⌖</span>
                GET DIRECTIONS
                <b>→</b>
              </a>
            </div>
          </section>

          {/* =================================================
              FINAL MESSAGE
          ================================================= */}

          <section className="final-section">
            <div className="final-icon">✦</div>

            <h2>
              YOUR PRESENCE
              <br />
              <span>MEANS SO MUCH TO US</span>
            </h2>

            <p>
              Your presence, love and blessings
              <br className="desktop-only" />
              will make this celebration even more special.
            </p>
          </section>

          {/* ===================================================
          Awaiting To Welcome
          =================================================== */}

          <section className="awaiting-section-mehndi2">
            {" "}
            <div className="awaiting-container">
              {" "}
              <h2>Awaiting to Welcome</h2>{" "}
              <div className="awaiting-card">
                {" "}
                <div className="awaiting-column awaiting-left">
                  {" "}
                  <div className="guest-name">
                    Mr & Mrs Syed Asim Ali Hashmi
                  </div>{" "}
                  <div className="guest-name">
                    Mr & Mrs Syed Sohail Ali Hashmi
                  </div>{" "}
                  <div className="guest-name">
                    Mr & Mrs Syed Salman Ali Hashmi
                  </div>{" "}
                </div>{" "}
                <div className="awaiting-column awaiting-right">
                  {" "}
                  <div className="guest-name">Mr & Mrs Abdul Aziz</div>{" "}
                  <div className="guest-name">Mrs Abdul Qadir</div>{" "}
                  <div className="guest-name">Mr & Mrs Ghazanfar Ali</div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </section>

          {/* =================================================
              RSVP
          ================================================= */}

          <section className="rsvp-section">
            <p className="section-heading">RSVP</p>

            <p className="rsvp-subtitle">FOR ANY ASSISTANCE</p>

            <div className="rsvp-grid">
              <div className="rsvp-card">
                <h3>Syed Asim Ali Hashmi</h3>

                <a href="tel:03213539769">03213539769</a>
              </div>

              <div className="rsvp-card">
                <h3>Syed Salman Ali Hashmi</h3>

                <a href="tel:03219242503">03219242503</a>
              </div>

              <div className="rsvp-card">
                <h3>Abdul Aziz</h3>

                <a href="tel:03362002829">03362002829</a>
              </div>

              <div className="rsvp-card">
                <h3>Ghazanfar Ali</h3>

                <a href="tel:03453954353">03453954353</a>
              </div>
            </div>
          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="mehndi-footer">
            <div className="footer-flower">❦</div>

            <p>WITH LOVE & BLESSINGS</p>

            <h2>
              Osama
              <span>&</span>
              Areeba
            </h2>

            <small>29 · OCTOBER · 2026</small>
          </footer>
        </div>
      </section>

      {/* =====================================================
          MUSIC BUTTON
      ===================================================== */}

      {opened && (
        <button
          type="button"
          className={`music-button ${musicOn ? "playing" : ""}`}
          onClick={toggleMusic}
          aria-label="Toggle music"
        >
          <span>{musicOn ? "♫" : "♪"}</span>
        </button>
      )}
    </main>
  );
}

export default Mehndi2;
