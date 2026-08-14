import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef(null);

  const openInvitation = () => {
    setOpened(true);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };
  
  return (
    <main className={`home-page ${opened ? "opened" : ""}`}>

      {/* HOME SONG */}
      <audio ref={audioRef} loop preload="auto">
        <source
          src="/music/Mile%20Ho%20Tum%20Humko.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* ================= CURTAIN ================= */}

      <div className={`curtain-screen ${opened ? "hide-curtain" : ""}`}>

        <div className="curtain curtain-left">
          <div className="curtain-folds"></div>
        </div>

        <div className="curtain curtain-right">
          <div className="curtain-folds"></div>
        </div>

        <div className="curtain-content">
          <div className="top-ornament">✦</div>

          <p>YOU ARE CORDIALLY INVITED</p>

          <h1>Wedding</h1>

          <h2>Invitation</h2>

          <div className="gold-line"></div>

          <button
            className="open-button"
            onClick={openInvitation}
          >
            OPEN INVITATION
            <span>→</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN INVITATION ================= */}

      <section className="invitation-content">

        <div className="invitation-inner">

          <div className="ornament">✦</div>

          <p className="invited-small">
            MR & MRS SYED ASIM ALI HASHMI
          </p>

          <p className="invited-text">
            INVITE YOU TO CELEBRATE THE
          </p>

          <h1 className="reception-title">
            Wedding
          </h1>

          <h2 className="celebration-title">
            CELEBRATION
          </h2>

          <div className="gold-divider">
            <span></span>
            <b>✦</b>
            <span></span>
          </div>

          <p className="invitation-message">
            With immense joy and happiness,
            <br />
            we invite you to join us as we celebrate
            <br />
            the beautiful beginning of a new journey.
          </p>

          <p className="blessing-text">
            Your presence and blessings will make
            <br />
            these precious moments even more special.
          </p>

          <div className="floral-divider">
            ❦
          </div>

          {/* ================= CEREMONIES ================= */}

          <section className="ceremonies">

            <Link to="/baraat" className="ceremony-box baraat-box">

              <div className="box-shade"></div>

              <div className="ceremony-content">

                <span className="ceremony-label">
                  THE CELEBRATION
                </span>

                <h2>Baraat</h2>

                <div className="box-line"></div>

                <span className="view-invitation">
                  VIEW INVITATION
                  <b>→</b>
                </span>

              </div>

            </Link>

            <Link to="/valima" className="ceremony-box valima-box">

              <div className="box-shade"></div>

              <div className="ceremony-content">

                <span className="ceremony-label">
                  THE RECEPTION
                </span>

                <h2>Valima</h2>

                <div className="box-line"></div>

                <span className="view-invitation">
                  VIEW INVITATION
                  <b>→</b>
                </span>

              </div>

            </Link>

          </section>

          {/* ================= FAMILY ================= */}

          <section className="family-section">

            <div className="gold-divider small">
              <span></span>
              <b>✦</b>
              <span></span>
            </div>

            <p className="family-heading">
              WITH LOVE & BLESSINGS
            </p>

            <p className="family-message">
              We look forward to celebrating these
              beautiful moments with our beloved
              family and friends.
            </p>

            <div className="contact-area">

              <div className="contact-card">
                <span>FOR ANY QUERIES</span>
                <strong>Contact Name</strong>
                <a href="tel:+923000000000">
                  +92 300 0000000
                </a>
              </div>

              <div className="contact-card">
                <span>FOR ANY QUERIES</span>
                <strong>Contact Name</strong>
                <a href="tel:+923000000000">
                  +92 300 0000000
                </a>
              </div>

            </div>

          </section>

          <footer>
            <span>With Love</span>
            <b>♥</b>
          </footer>

        </div>

      </section>

    </main>
  );
}

export default Home;