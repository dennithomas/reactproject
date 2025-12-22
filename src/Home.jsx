import React from 'react'
import "./Home.css"

const Home = () => {
    return (
        <div className="home-container">

            {/* Introduction */}
            <section className="home-hero">
                <h1 className="home-title">The Importance of Reading Books</h1>
                <p className="home-subtitle">
                    Reading books is one of the most powerful habits that helps us grow
                    intellectually, emotionally, and socially.
                </p>
            </section>

            {/* Why Read Books */}
            <section className="home-features">
                <div className="home-card">
                    <h3 className="home-card-title">📖 Improves Knowledge</h3>
                    <p className="home-card-text">
                        Books provide valuable information and insights that expand our
                        understanding of the world and various subjects.
                    </p>
                </div>

                <div className="home-card">
                    <h3 className="home-card-title">🧠 Enhances Thinking Skills</h3>
                    <p className="home-card-text">
                        Regular reading improves concentration, critical thinking,
                        and problem-solving abilities.
                    </p>
                </div>

                <div className="home-card">
                    <h3 className="home-card-title">🌱 Personal Growth</h3>
                    <p className="home-card-text">
                        Books inspire positive values, creativity, and motivation,
                        helping individuals grow personally and professionally.
                    </p>
                </div>
            </section>

            {/* Honorable Personalities */}
            <section className="home-about">
                <h2 className="home-section-title">Honorable Personalities Who Valued Reading</h2>

                <p className="home-about-text">
                    <strong>Dr. A. P. J. Abdul Kalam</strong> believed that reading books
                    played a major role in shaping his thoughts and vision. His love for
                    learning inspired millions of students across the world.
                </p>

                <p className="home-about-text">
                    <strong>Mahatma Gandhi</strong> was an avid reader who gained wisdom
                    from books on philosophy, ethics, and self-discipline, which guided
                    his principles and actions.
                </p>

                <p className="home-about-text">
                    <strong>Swami Vivekananda</strong> emphasized self-education and
                    considered books as tools for building character and confidence.
                </p>
            </section>

        </div>
    )
}

export default Home
