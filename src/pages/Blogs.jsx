import React from 'react'

const Blogs = () => {
  return (
    <>
  <meta charSet="UTF-8" />
  <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
  <meta content="width=device-width,initial-scale=1.0" name="viewport" />
  <title>Charan Nomula</title>
  <meta content="Charan Nomula" property="og:title" />
  <meta content="Known as TheMj0ln1r" property="og:description" />
  <meta content="Known as TheMj0ln1r" name="description" />
  <link href="/favicons/favicon.ico" rel="icon" type="image/png" />
  <link href="https://themj0ln1r.github.io/fonts.css" rel="stylesheet" />
  <link
    title="Charan Nomula"
    href="https://themj0ln1r.github.io/atom.xml"
    rel="alternate"
    type="application/atom+xml"
  />
  <link href="https://themj0ln1r.github.io/theme/light.css" rel="stylesheet" />
  <link
    href="https://themj0ln1r.github.io/theme/dark.css"
    id="darkModeStyle"
    rel="stylesheet"
  />
  <link
    href="https://themj0ln1r.github.io/main.css"
    media="screen"
    rel="stylesheet"
  />
  <div className="content">
    <header>
      <div className="main">
        <a href="https://themj0ln1r.github.io/">Charan Nomula</a>
        <div className="socials">
          <a
            className="social"
            href="https://x.com/TheMj0ln1r/"
            rel="me"
            target="_blank"
          >
            {" "}
            <img
              alt="twitter"
              src="https://themj0ln1r.github.io/social_icons/twitter.svg"
            />{" "}
          </a>
          <a
            className="social"
            href="https://linkedin.com/in/mj0ln1r/"
            rel="me"
            target="_blank"
          >
            {" "}
            <img
              alt="linkedin"
              src="https://themj0ln1r.github.io/social_icons/linkedin.svg"
            />{" "}
          </a>
          <a
            className="social"
            href="https://github.com/TheMj0ln1r/"
            rel="me"
            target="_blank"
          >
            {" "}
            <img
              alt="github"
              src="https://themj0ln1r.github.io/social_icons/github.svg"
            />{" "}
          </a>
          <a
            href="mailto: playermj0ln1r@gmail.com"
            className="social"
            rel="me"
            target="_blank"
          >
            {" "}
            <img
              alt="Email"
              src="https://themj0ln1r.github.io/social_icons/email.svg"
            />{" "}
          </a>
        </div>
      </div>
      <nav>
        <a
          href="https://themj0ln1r.github.io/posts"
          style={{ marginLeft: ".5em" }}
        >
          /posts
        </a>
        <a
          href="https://themj0ln1r.github.io/writeups"
          style={{ marginLeft: ".5em" }}
        >
          /writeups
        </a>
        <a
          href="https://themj0ln1r.github.io/projects"
          style={{ marginLeft: ".5em" }}
        >
          /projects
        </a>
        <a
          href="https://themj0ln1r.github.io/contact"
          style={{ marginLeft: ".5em" }}
        >
          /contact
        </a>
        <a
          href="https://themj0ln1r.github.io/tags"
          style={{ marginLeft: ".5em" }}
        >
          /tags
        </a>{" "}
        |
        <a
          onclick="toggleTheme(); event.preventDefault();"
          href="#"
          id="dark-mode-toggle"
        >
          {" "}
          <img
            alt="Light"
            id="sun-icon"
            src="https://themj0ln1r.github.io/feather/sun.svg"
            style={{ filter: "invert()" }}
          />{" "}
          <img
            alt="Dark"
            id="moon-icon"
            src="https://themj0ln1r.github.io/feather/moon.svg"
          />{" "}
        </a>
      </nav>
    </header>
    <main>
      <article>
        <section className="body">
          <div className="page-header">
            Charan Nomula
            <span className="primary-color" style={{ fontSize: "1.6em" }}>
              .
            </span>
          </div>
          <p>Hello anon, this is Charan Nomula aka MJ0LN1R or THEMJ0LN1R.</p>
          <p>I am a __</p>
          <ul>
            <li>
              <p>CTF Player</p>
            </li>
            <li>
              <p>
                Senior Blockchain Engineer{" "}
                <a href="https://x.com/SUPRA_Labs">@Supra</a>
              </p>{" "}
              <ul>
                <li>Interoperability Solutions</li>
                <li>Light clients</li>
                <li>Consensus</li>
                <li>Smart contracts</li>
                <li>On-Chain Algorithms</li>
              </ul>
            </li>
            <li>
              <p>Security Researcher</p>
            </li>
            <li>
              <p>
                Blind Fold Programmer of {"{"}
                <code>.rs</code>, <code>.sol</code>, <code>.move</code>,{" "}
                <code>.huff</code>, <code>.py</code>, <code>.sh</code>,{" "}
                <code>.js</code>
                {"}"}
              </p>
            </li>
            <li>
              <p>
                Trail By Fire Programmer of {"{"}
                <code>.*</code>
                {"}"}
              </p>
            </li>
          </ul>
        </section>
      </article>
    </main>
  </div>
</>

  )
}

export default Blogs
