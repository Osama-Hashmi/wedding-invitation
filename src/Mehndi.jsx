import { useEffect, useRef, useState } from "react";
import "./mehndi.css";

function Mehndi() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const audioRef = useRef(null);

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
      audio.currentTime = 0;
      await audio.play();
      setMusicOn(true);
    } catch (error) {
      setMusicOn(false);
      console.log("Music could not start:", error);
    }
  };

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

      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/music/mehndi.mp3"
      />

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
          {/* INTRO */}

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

          {/* NAMES */}

          <section className="names-section">
            <p className="eyebrow">THE BEAUTIFUL COUPLE</p>

            <div className="name-card">
              <div className="name-person">
                <div className="image-circle bride-placeholder">
                  <span>BRIDE</span>
                </div>

                <p className="person-role">THE BRIDE</p>

                <h3>Areeba</h3>

                <p className="family-name">Daughter of Ashraf Ali</p>
              </div>

              <div className="heart-divider">
                <span></span>
                <b>♥</b>
                <span></span>
              </div>

              <div className="name-person">
                <div className="image-circle groom-placeholder">
                  <span>GROOM</span>
                </div>

                <p className="person-role">THE GROOM</p>

                <h3>Osama</h3>

                <p className="family-name">
                  Syed Muhammad Osama Ali Hashmi
                </p>
              </div>
            </div>
          </section>

          {/* MESSAGE */}

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

          {/* DATE */}

          <section className="event-section">
            <p className="section-label">SAVE THE DATE</p>

            <div className="event-date-card">
              <div className="date-top">WEDNESDAY</div>

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

          {/* VENUE */}

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

          {/* DETAILS */}

          <section className="details-section">
            <p className="section-label">EVENT DETAILS</p>

            <div className="details-grid">
              <div className="detail-box">
                <div className="detail-icon">✦</div>
                <span>EVENT</span>
                <strong>MEHNDI</strong>
              </div>

              <div className="detail-box">
                <div className="detail-icon">◷</div>
                <span>TIME</span>
                <strong>9:00 PM</strong>
              </div>

              <div className="detail-box">
                <div className="detail-icon">✧</div>
                <span>DATE</span>
                <strong>28 OCTOBER</strong>
              </div>
            </div>
          </section>

          {/* FINAL MESSAGE */}

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

          {/* RSVP */}

          <section className="rsvp-section">
            <p className="section-label">RSVP</p>

            <p className="rsvp-intro">
              FOR ANY ASSISTANCE
            </p>

            <div className="rsvp-grid">
              <div className="rsvp-card">
                <span>CONTACT</span>
                <h3>Advocate Ashraf Ali</h3>

                <a href="tel:03342595325">
                  03342595325
                </a>
              </div>

              <div className="rsvp-card">
                <span>CONTACT</span>
                <h3>Syed Salman Ali Hashmi</h3>

                <a href="tel:03219242503">
                  03219242503
                </a>
              </div>
            </div>
          </section>

          {/* FOOTER */}

          <footer className="mehndi-footer">
            <div className="footer-flower">❦</div>

            <p>WITH LOVE & BLESSINGS</p>

            <h2>
              Areeba <span>&</span> Osama
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