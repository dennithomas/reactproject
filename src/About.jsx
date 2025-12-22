import React from 'react'
import "./About.css"

const About = () => {
    return (
        <div className="about-container">

            {/* Title */}
            <section className="about-hero">
                <h1 className="about-title">About Our Library Platform</h1>
                <p className="about-subtitle">
                    A simple digital platform designed to encourage reading
                    and make knowledge easily accessible to everyone.
                </p>
            </section>

            {/* Purpose */}
            <section className="about-section">
                <h2 className="about-heading">Our Purpose</h2>
                <p className="about-text">
                    The main goal of this platform is to promote the habit of reading books.
                    Reading improves knowledge, imagination, and critical thinking.
                    This system helps users explore books in an organized and user-friendly way.
                </p>
            </section>

            {/* Importance */}
            <section className="about-section">
                <h2 className="about-heading">Why Reading Matters</h2>
                <p className="about-text">
                    Reading books helps individuals gain new ideas, develop language skills,
                    and improve concentration. It also reduces stress and encourages
                    lifelong learning.
                </p>
            </section>

            {/* Inspiration */}
            <section className="about-section">
                <h2 className="about-heading">Our Inspiration</h2>
                <p className="about-text">
                    Great personalities such as <strong>Dr. A. P. J. Abdul Kalam</strong>,
                    <strong> Mahatma Gandhi</strong>, and <strong>Swami Vivekananda</strong>
                    strongly believed in the power of reading and self-education.
                    Their lives continue to inspire learners across generations.
                </p>
            </section>

        </div>
    )
}

export default About
