import { useEffect, useRef, useState } from "react";
import "./Mehndi.css";

function Mehndi() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [scratched, setScratched] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  const audioRef = useRef(null);
  const scratchCanvasRef = useRef(null);
  const isScratchingRef = useRef(false);
  const lastPointRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    document.title = "Mehndi Invitation — Areeba & Osama";

    return () => {
      document.title = "Wedding Invitation";
    };
  }, []);

  /* ================= COUNTDOWN ================= */

  useEffect(() => {
    const target = new Date("2026-10-28T21:00:00").getTime();

    const updateTimer = () => {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(difference / 86400000);
      const hours = Math.floor((difference / 3600000) % 24);
      const minutes = Math.floor((difference / 60000) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ================= SCRATCH CANVAS ================= */

  useEffect(() => {
    if (scratched) return;

    const canvas = scratchCanvasRef.current;

    if (!canvas) return;

    const parent = canvas.parentElement;

    if (!parent) return;

    const setupCanvas = () => {
      const rect = parent.getBoundingClientRect();

      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gradient = ctx.createLinearGradient(0, 0, width, height);

      gradient.addColorStop(0, "#b08a32");
      gradient.addColorStop(0.5, "#d4b35d");
      gradient.addColorStop(1, "#96711f");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.font = "600 11px Montserrat, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "3px";

      ctx.fillText("SCRATCH TO REVEAL", width / 2, height / 2 - 8);

      ctx.font = "22px Cormorant Garamond, serif";

      ctx.fillText("✦", width / 2, height / 2 + 20);
    };

    setupCanvas();

    window.addEventListener("resize", setupCanvas);

    return () => {
      window.removeEventListener("resize", setupCanvas);
    };
  }, [scratched]);

  const getScratchPosition = (event) => {
    const canvas = scratchCanvasRef.current;

    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    let clientX;
    let clientY;

    if (event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const checkScratchProgress = () => {
    const canvas = scratchCanvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const sampleSize = 8;

    const imageData = ctx.getImageData(0, 0, width, height).data;

    let transparentPixels = 0;
    let totalPixels = 0;

    for (let y = 0; y < height; y += sampleSize) {
      for (let x = 0; x < width; x += sampleSize) {
        const index = (y * width + x) * 4;

        totalPixels++;

        if (imageData[index + 3] < 100) {
          transparentPixels++;
        }
      }
    }

    const progress =
      totalPixels > 0 ? (transparentPixels / totalPixels) * 100 : 0;

    setScratchProgress(Math.min(progress, 100));

    if (progress >= 48) {
      setScratched(true);
    }
  };

  const scratch = (event) => {
    if (scratched) return;

    const canvas = scratchCanvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const position = getScratchPosition(event);

    if (!position) return;

    if (event.cancelable) {
      event.preventDefault();
    }

    ctx.globalCompositeOperation = "destination-out";

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 42;

    if (lastPointRef.current) {
      ctx.beginPath();

      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);

      ctx.lineTo(position.x, position.y);

      ctx.stroke();
    } else {
      ctx.beginPath();

      ctx.arc(position.x, position.y, 21, 0, Math.PI * 2);

      ctx.fill();
    }

    lastPointRef.current = position;

    checkScratchProgress();
  };

  const startScratch = (event) => {
    if (scratched) return;

    isScratchingRef.current = true;
    lastPointRef.current = null;

    scratch(event);
  };

  const moveScratch = (event) => {
    if (!isScratchingRef.current) return;

    scratch(event);
  };

  const stopScratch = () => {
    isScratchingRef.current = false;
    lastPointRef.current = null;
  };

  /* ================= OPEN INVITATION ================= */

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
      audio.currentTime = 16;
      await audio.play();
      setMusicOn(true);
    } catch (error) {
      setMusicOn(false);

      console.log("Music could not start automatically:", error);
    }
  };

  /* ================= MUSIC ================= */

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
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

  return (
    <main className={`mehndi-page ${opened ? "opened" : ""}`}>
      {/* ================= MUSIC ================= */}

      <audio ref={audioRef} loop preload="auto" src="/music/mehndi.mp3" />

      {/* ================= OPENING SCREEN ================= */}

      <section className="mehndi-cover">
        <div className="cover-glow"></div>

        <div className="cover-flower flower-one">✽</div>
        <div className="cover-flower flower-two">✽</div>
        <div className="cover-flower flower-three">✽</div>
        <div className="cover-flower flower-four">✽</div>

        <div className="cover-frame">
          <div className="frame-inner">
            <p className="cover-top">A NIGHT OF</p>

            <h1>Mehndi</h1>

            <div className="cover-divider">
              <span></span>
              <b>✦</b>
              <span></span>
            </div>

            <p className="cover-subtitle">
              COLOUR • MUSIC • LOVE • CELEBRATION
            </p>

            <div className="cover-couple">
              <span>Areeba</span>
              <b>&</b>
              <span>Osama</span>
            </div>

            <p className="cover-date">28 OCTOBER 2026</p>

            <button
              type="button"
              className="enter-button"
              onClick={openInvitation}
            >
              <span className="enter-icon">✦</span>
              <span>OPEN INVITATION</span>
              <strong>→</strong>
            </button>

            <p className="cover-tap">TAP TO ENTER</p>
          </div>
        </div>
      </section>

      {/* ================= MAIN PAGE ================= */}

      <section className="mehndi-content">
        <div className="pattern pattern-left">❋</div>
        <div className="pattern pattern-right">❋</div>

        <div className="page-container">
          {/* ================= INTRO ================= */}

          <section className="intro-section">
            <div className="arabic">﷽</div>

            <div className="gold-line">
              <span></span>
              <b>✦</b>
              <span></span>
            </div>

            <p className="tiny-heading">WITH LOVE & BLESSINGS</p>

            <p className="parent-heading">Mr & Mrs Advocate Ashraf Ali</p>

            <h2>We Invite You</h2>

            <p className="intro-text">
              To celebrate a beautiful evening filled with
              <br className="desktop-break" />
              colours, laughter, music and unforgettable moments.
            </p>
          </section>

          {/* ================= NAMES ================= */}

          <section className="names-section">
            <p className="eyebrow">THE BEAUTIFUL COUPLE</p>

            <div className="name-card">
              {/* BRIDE */}

              <div className="name-person">
                <div className="image-circle">
                  <img src="/images/mehndi-girl.png" alt="Bride" />
                </div>

                <p className="person-role">THE BRIDE</p>

                <h3>Areeba</h3>

                <p className="family-name">D/O Advocate Ashraf Ali</p>
              </div>

              <div className="heart-divider">
                <span></span>
                <b>♥</b>
                <span></span>
              </div>

              {/* GROOM */}

              <div className="name-person">
                <div className="image-circle">
                  <img src="/images/mehndi-boy.png" alt="Groom" />
                </div>

                <p className="person-role">THE GROOM</p>

                <h3>Osama</h3>

                <p className="family-name">S/O Syed Asim Ali Hashmi</p>
              </div>
            </div>
          </section>

          {/* ================= MESSAGE ================= */}

          <section className="quote-section">
            <div className="quote-symbol">❋</div>

            <h2>
              LET THE MUSIC PLAY,
              <br />
              LET THE CELEBRATION BEGIN
            </h2>

            <p>
              Join us as we celebrate this special evening
              <br className="desktop-break" />
              surrounded by the people we love.
            </p>

            <div className="quote-flower">❦</div>
          </section>

          {/* ================= DATE ================= */}

          <section className="event-section">
            <p className="section-label">SAVE THE DATE</p>

            {/* <div className="event-date-card">
              <div className="date-top">
                WEDNESDAY
              </div>

              <div className="date-main">
                <strong>28</strong>

                <div>
                  <span>OCTOBER</span>
                  <small>2026</small>
                </div>
              </div>

              <div className="date-bottom">
                THE MEHNDI CELEBRATION
              </div>
            </div> */}

            {/* SCRATCH TO REVEAL */}

            <div className="scratch-section">
              {/* <p className="scratch-heading">
                A LITTLE SURPRISE
              </p> */}

              <p className="scratch-subheading">
                SCRATCH THE CARD TO REVEAL THE DATE
              </p>

              <div className="scratch-card">
                <div className="scratch-revealed">
                  <span className="revealed-label">OUR SPECIAL DAY</span>

                  <strong>28</strong>

                  <span className="revealed-month">OCTOBER 2026</span>

                  <small>WEDNESDAY • 9:00 PM</small>
                </div>

                {!scratched && (
                  <canvas
                    ref={scratchCanvasRef}
                    className="scratch-canvas"
                    onMouseDown={startScratch}
                    onMouseMove={moveScratch}
                    onMouseUp={stopScratch}
                    onMouseLeave={stopScratch}
                    onTouchStart={startScratch}
                    onTouchMove={moveScratch}
                    onTouchEnd={stopScratch}
                  />
                )}

                {!scratched && (
                  <div className="scratch-progress">
                    {Math.round(scratchProgress)}%
                  </div>
                )}
              </div>

              {scratched && (
                <p className="scratch-complete">✦ DATE REVEALED ✦</p>
              )}
            </div>

            {/* COUNTDOWN */}

            <div className="countdown-section">
              <p>CELEBRATION STARTS IN</p>

              <div className="countdown">
                <div className="time-box">
                  <strong>{timeLeft.days}</strong>
                  <span>DAYS</span>
                </div>

                <div className="time-box">
                  <strong>{timeLeft.hours}</strong>
                  <span>HOURS</span>
                </div>

                <div className="time-box">
                  <strong>{timeLeft.minutes}</strong>
                  <span>MINUTES</span>
                </div>

                <div className="time-box">
                  <strong>{timeLeft.seconds}</strong>
                  <span>SECONDS</span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= VENUE ================= */}

          <section className="venue-section">
            <p className="section-label">JOIN US AT</p>

            <div className="venue-card">
              <div className="venue-icon">⌖</div>

              <p className="venue-small">THE CELEBRATION WILL BE HELD AT</p>

              <h2>Jasmine Banquet</h2>

              <div className="venue-line"></div>

              <p className="venue-description">
                An evening of celebration, laughter,
                <br className="desktop-break" />
                music and beautiful memories.
              </p>

              <a
                href="https://maps.app.goo.gl/rdLWw9v22k3dj1h17"
                target="_blank"
                rel="noopener noreferrer"
                className="map-button"
              >
                <span>⌖</span>
                GET DIRECTIONS
                <strong>→</strong>
              </a>
            </div>
          </section>

          {/* =================================================
              DETAILS
          ================================================= */}

          <section className="details-section">
            <p className="section-heading">CELEBRATION DETAILS</p>

            <div className="details-card">
              <div className="detail-row">
                <div className="detail-icon">✦</div>

                <div className="detail-content">
                  <small>OCCASION</small>

                  <h3>MEHNDI CELEBRATION</h3>
                </div>
              </div>

              <div className="detail-line"></div>

              <div className="detail-row">
                <div className="detail-icon">◷</div>

                <div className="detail-content">
                  <small>GATHERING</small>

                  <h3>9:00 PM</h3>
                </div>
              </div>

              <div className="detail-line"></div>

              <div className="detail-row">
                <div className="detail-icon">♪</div>

                <div className="detail-content">
                  <small>ENJOYMENT & CELEBRATION</small>

                  <h3>10:00 PM</h3>
                </div>
              </div>

              <div className="detail-line"></div>

              <div className="detail-row">
                <div className="detail-icon">❧</div>

                <div className="detail-content">
                  <small>DINNER</small>

                  <h3>11:00 PM</h3>
                </div>
              </div>
            </div>
          </section>

          {/* ================= FINAL MESSAGE ================= */}

          <section className="final-section">
            <div className="final-decoration">✦</div>

            <p>YOUR PRESENCE</p>

            <h2>
              IS THE GREATEST
              <br />
              <span>GIFT OF ALL</span>
            </h2>

            <div className="gold-line">
              <span></span>
              <b>❦</b>
              <span></span>
            </div>

            <p className="final-text">
              We cannot wait to share this beautiful
              <br className="desktop-break" />
              evening with you.
            </p>
          </section>

          {/* ===================================================
          Awaiting To Welcome
          =================================================== */}

          <section className="mehndi-awaiting-section">
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

          {/* ================= RSVP ================= */}

          <section className="rsvp-section">
            <p className="section-label">RSVP</p>

            <p className="rsvp-intro">FOR ANY ASSISTANCE</p>

            <div className="rsvp-grid">
              <div className="rsvp-card">
                <span>CONTACT</span>
                <h3>Mr & MrsAdvocate Ashraf Ali</h3>
                <a href="tel:03342595325">03342595325</a> <br />
                <a href="tel:03322205525">03322205525</a> <br />
                <a href="tel:03703463351">03703463351</a>
              </div>

              <div className="rsvp-card">
                <span>CONTACT</span>

                <h3>Syed Salman Ali Hashmi</h3>

                <a href="tel:03219242503">03219242503</a>
              </div>
            </div>
          </section>

          {/* ================= FOOTER ================= */}

          <footer className="mehndi-footer">
            <div className="footer-flower">❦</div>

            <p>WITH LOVE & BLESSINGS</p>

            <h2>
              Osama <span>&</span> Areeba
            </h2>

            <small>28 • OCTOBER • 2026</small>
          </footer>
        </div>
      </section>

      {/* ================= MUSIC BUTTON ================= */}

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

export default Mehndi;
