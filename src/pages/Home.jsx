import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Wedding Invitation";
  }, []);

  useEffect(() => {
    if (opened) {
      // Keep the invitation page at the very top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      });

      // Ensure it stays at the top when the envelope screen disappears
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [opened]);

  const openInvitation = () => {
    if (opened) return;

    // Move page to top immediately when envelope is opened
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });

    setOpened(true);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <main className={`home-page ${opened ? "opened" : ""}`}>

      {/* ================= MUSIC ================= */}

      <audio ref={audioRef} loop preload="auto">
        <source
          src="/music/Mile%20Ho%20Tum%20Humko.mp3"
          type="audio/mpeg"
        />
      </audio>


      {/* =====================================================
          ENVELOPE OPENING
      ====================================================== */}

      <div className={`envelope-screen ${opened ? "is-opened" : ""}`}>

        <div className="envelope-stage">

          {/* ================= INVITATION TITLE ================= */}

          <div className="envelope-invitation-title">
            Invitation
          </div>


          {/* ================= INVITATION CARD ================= */}

          <div className="opening-card">

            <div className="opening-flower flower-tl">❦</div>
            <div className="opening-flower flower-tr">❦</div>
            <div className="opening-flower flower-bl">❦</div>
            <div className="opening-flower flower-br">❦</div>

            <div className="opening-card-inner">

              <span className="opening-kicker">
                YOU ARE CORDIALLY INVITED
              </span>

              <h1>
                Wedding
              </h1>

              <div className="opening-line"></div>

              <span className="opening-of">
                OF
              </span>

              <h2>
                Osama <span>♡</span> Areeba
              </h2>

              <p>
                TWO HEARTS · TWO FAMILIES
              </p>

              <small>
                ONE BEAUTIFUL BEGINNING
              </small>

            </div>
          </div>


          {/* ================= ENVELOPE ================= */}

          <div className="envelope">

            {/* Back body */}
            <div className="envelope-back"></div>

            {/* Letter pocket */}
            <div className="envelope-pocket"></div>

            {/* Decorative front border */}
            <div className="envelope-border"></div>

            {/* Floral decorations */}

            <div className="envelope-flower envelope-flower-tl">
              ❦
            </div>

            <div className="envelope-flower envelope-flower-tr">
              ❦
            </div>

            <div className="envelope-flower envelope-flower-bl">
              ❦
            </div>

            <div className="envelope-flower envelope-flower-br">
              ❦
            </div>


            {/* ================= FLAP ================= */}

            <div className="envelope-flap">

              <div className="flap-floral">
                ❦
              </div>

            </div>


            {/* ================= GOLDEN SEAL ================= */}

            {!opened && (
              <button
                className="envelope-seal"
                onClick={openInvitation}
                aria-label="Open wedding invitation"
              >
                <span>✦</span>
              </button>
            )}

          </div>

        </div>
      </div>


      {/* =====================================================
          MAIN INVITATION
      ====================================================== */}

      <section className="invitation-content">

        <div className="invitation-inner">

          {/* ================= BISMILLAH ================= */}

          <div className="bismillah">
            ﷽
          </div>

          <div className="quran-verse">
            وَخَلَقْنَاكُمْ أَزْوَاجًا
          </div>

          <p className="verse-translation">
            “And We created you in pairs.”
          </p>

          <p className="verse-reference">
            An-Naba | Verse 8
          </p>


          <div className="ornament">
            ❦
          </div>


          {/* ================= FAMILY NAMES ================= */}

          <p className="invited-small">
            MR & MRS SYED ASIM ALI HASHMI
          </p>

          <p className="invited-ampersand">
            &
          </p>

          <p className="invited-small">
            MR & MRS ADVOCATE ASHRAF ALI
          </p>


          <p className="invited-text">
            JOYFULLY INVITE YOU TO CELEBRATE THE
          </p>


          {/* ================= WEDDING ================= */}

          <h1 className="reception-title">
            Wedding
          </h1>

          <h2 className="celebration-title">
            OF THEIR BELOVED CHILDREN
          </h2>


          <div className="couple-names">
            OSAMA <span>♡</span> AREEBA
          </div>


          <div className="gold-divider">
            <span></span>
            <b>✦</b>
            <span></span>
          </div>


          {/* ================= MESSAGE ================= */}

          <p className="main-highlight">
            TWO HEARTS, TWO FAMILIES, ONE BEAUTIFUL BEGINNING.
          </p>

          <p className="invitation-message">
            With immense joy and happiness,
            <br />
            we invite you to join us as we celebrate
            <br />
            the beautiful beginning of a new journey.
          </p>

          <p className="blessing-text">
            Your presence, prayers and blessings
            <br />
            will make these precious moments
            <br />
            even more meaningful and special to us.
          </p>


          <div className="floral-divider">
            ❦
          </div>


          {/* ================= CELEBRATIONS ================= */}

          <p className="celebration-label">
            OUR CELEBRATIONS
          </p>


          <section className="ceremonies">


            {/* ================= MEHNDI 1 ================= */}

            <Link
              to="/mehndi-invite-2741"
              className="ceremony-box mehndi-box"
            >

              <div className="card-floral top-left">
                ❀
              </div>

              <div className="card-floral top-right">
                ❦
              </div>

              <div className="card-floral bottom-left">
                ❦
              </div>

              <div className="card-floral bottom-right">
                ❀
              </div>

              <div className="box-shade"></div>

              <div className="ceremony-content">

                <span className="ceremony-label">
                  THE CELEBRATION
                </span>

                <h2>
                  Mehndi 1
                </h2>

                <p>
                  An Evening of Joy & Colors
                </p>

                <div className="box-line"></div>

                <span className="view-invitation">
                  VIEW INVITATION
                  <b>→</b>
                </span>

              </div>

            </Link>


            {/* ================= MEHNDI 2 ================= */}

            <Link
              to="/mehndi-2-invitation-5836"
              className="ceremony-box mehndi-two-box"
            >

              <div className="card-floral top-left">
                ❀
              </div>

              <div className="card-floral top-right">
                ❦
              </div>

              <div className="card-floral bottom-left">
                ❦
              </div>

              <div className="card-floral bottom-right">
                ❀
              </div>

              <div className="box-shade"></div>

              <div className="ceremony-content">

                <span className="ceremony-label">
                  THE CELEBRATION
                </span>

                <h2>
                  Mehndi 2
                </h2>

                <p>
                  An Evening of Music & Happiness
                </p>

                <div className="box-line"></div>

                <span className="view-invitation">
                  VIEW INVITATION
                  <b>→</b>
                </span>

              </div>

            </Link>


            {/* ================= BARAAT ================= */}

            <Link
              to="/baraat-invitation-9142"
              className="ceremony-box baraat-box"
            >

              <div className="card-floral top-left">
                ❀
              </div>

              <div className="card-floral top-right">
                ❦
              </div>

              <div className="card-floral bottom-left">
                ❦
              </div>

              <div className="card-floral bottom-right">
                ❀
              </div>

              <div className="box-shade"></div>

              <div className="ceremony-content">

                <span className="ceremony-label">
                  THE CELEBRATION
                </span>

                <h2>
                  Baraat
                </h2>

                <p>
                  An Evening of Love & Tradition
                </p>

                <div className="box-line"></div>

                <span className="view-invitation">
                  VIEW INVITATION
                  <b>→</b>
                </span>

              </div>

            </Link>


            {/* ================= VALIMA ================= */}

            <Link
              to="/valima-invite-7365"
              className="ceremony-box valima-box"
            >

              <div className="card-floral top-left">
                ❀
              </div>

              <div className="card-floral top-right">
                ❦
              </div>

              <div className="card-floral bottom-left">
                ❦
              </div>

              <div className="card-floral bottom-right">
                ❀
              </div>

              <div className="box-shade"></div>

              <div className="ceremony-content">

                <span className="ceremony-label">
                  THE RECEPTION
                </span>

                <h2>
                  Valima
                </h2>

                <p>
                  An Evening of Love & Celebration
                </p>

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
              We look forward to celebrating
              <br />
              these beautiful moments with our beloved
              <br />
              family and friends.
            </p>


            <div className="contact-area">

              <div className="contact-card">

                <span>
                  FOR ANY QUERIES
                </span>

                <strong>
                  Syed Asim Ali Hashmi
                </strong>

                <a href="tel:+9233213539769">
                  03213539769
                </a>

              </div>


              <div className="contact-card">

                <span>
                  FOR ANY QUERIES
                </span>

                <strong>
                  Advocate Ashraf Ali
                </strong>

                <a href="tel:03342595325">
                  03342595325
                </a>

              </div>

            </div>

          </section>


          {/* ================= FOOTER ================= */}

          <footer>
            <span>
              Osama & Areeba
            </span>

            <b>
              ♥
            </b>
          </footer>

        </div>

      </section>

    </main>
  );
}

export default Home;