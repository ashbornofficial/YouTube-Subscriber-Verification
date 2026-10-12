
# ⚡ --- YouTube Subscribe Verification Gate

**A sleek, cyberpunk-inspired PHP web interface for screenshot-based
YouTube subscription text checks.**

[Features](#-features) · [How It Works](#-how-it-works) ·
[Installation](#-installation) · [Configuration](#-configuration) ·
[Limitations](#-important-limitations)
:::

------------------------------------------------------------------------

## ✨ Overview

This is a dark, neon-styled verification gate built with **PHP,
CSS, and JavaScript**. Users upload a screenshot, the browser runs OCR
to look for expected subscription text, and the interface displays a
success or failure state.

The UI includes animated styling, a processing feed, a success resource
button, and a failure message that remains visible for **5 seconds**
before the form resets.

> **Important:** This is a demo-style, screenshot text checker---not
> proof that someone is subscribed to a YouTube channel. Screenshots can
> be edited, and browser-side checks can be bypassed. See [Important
> Limitations](#-important-limitations).

## 🚀 Features

-   🌌 Premium dark interface with neon accents
-   ✨ Animated YouTube subscribe button
-   🖼️ Screenshot upload flow
-   🔎 Browser-based OCR using Tesseract.js
-   📟 Processing/activity feed and status feedback
-   ✅ Success state with an **Access Resource** action
-   ❌ Failure state stays visible for 5 seconds before reset
-   📱 Responsive layout for desktop and mobile
-   ♿ Reduced-motion support where implemented
-   🧩 Plain PHP project structure, easy to customize

## 🧰 Tech Stack

-   **PHP** --- serves the application page
-   **HTML5 / CSS3** --- layout, responsive styles, animations
-   **JavaScript** --- upload flow and UI state
-   **Tesseract.js** --- browser-side OCR, loaded from a CDN

No database is required for the basic demo.

## 📁 Project Structure

``` text
.
├── index.php
├── assets/
│   ├── app.js
│   └── style.css
└── README.md
```

Your downloaded archive may contain additional project files. Keep the
existing structure when extracting it.

## 🖥️ Installation

### Option A --- Use a local PHP stack

Place the project folder in your local server's web root (for example,
`htdocs` in XAMPP), start the web server, then open the project URL in
your browser.

For easy and best I would suggest [Laragon] (#https://laragon.org/)

A modern browser and internet connection are needed for Tesseract.js if
it is loaded from a CDN.


### Option B --- Run with PHP installed

1.  Download or clone this repository.

2.  Extract the files.

3.  Open a terminal in the project directory.

4.  Start PHP's development server:

    ``` bash
    php -S localhost:8000
    ```

5.  Visit <http://localhost:8000>.


## ⚙️ Configuration

Before publishing, review `index.php` and `assets/app.js` for the
channel name and destination URL.

-   Set the **channel name** to the exact text you expect the OCR to
    find.
-   Set the **subscribe link** to the intended YouTube channel.
-   Set the **resource destination** to the page or channel that should
    open after a successful text match.

The current example resource destination is:

`https://github.com/ashbornofficial`

Do not confuse the resource destination with the channel name used for
OCR matching. Configure each separately if they should differ.

If the project supports environment variables in your current version,
prefer them for deployment configuration. Never commit secrets or
private keys to GitHub.

## 🧪 Test Checklist

-   [ ] The page loads without PHP or JavaScript errors.
-   [ ] The animated subscribe button opens the intended YouTube page.
-   [ ] A clear screenshot containing the expected text is processed.
-   [ ] A screenshot without the expected text shows failure.
-   [ ] The failure message remains visible for 5 seconds.
-   [ ] The success action opens the intended resource.
-   [ ] The layout works on mobile and desktop.

## 🔐 Important Limitations

This project checks **text recognized in an uploaded screenshot**. It
does not connect to YouTube to verify a user's subscription status.

-   Screenshots can be altered or fabricated.
-   OCR can produce false positives and false negatives.
-   Because the check runs in the browser, users can modify or bypass
    client-side logic.
-   Hiding a resource button in the UI does not secure the destination
    URL.

**Do not use this as a secure access-control system or as proof of
subscription.** For real protection, authorization must be enforced by a
backend you control, and access should be granted only after a
trustworthy verification process. You cannot securely protect a public
YouTube URL with a front-end button alone.

## 🌐 Deployment Notes

-   Use HTTPS on a public deployment.
-   Test the PHP version supported by your hosting provider.
-   Check that CDN scripts load successfully.
-   Avoid storing uploaded screenshots unless you genuinely need them;
    if you add server-side uploads, validate file types and size and
    apply appropriate security controls.
-   Review all configuration and remove debugging output before going
    live.

## 🤝 Contributing

Suggestions and improvements are welcome.

1.  Fork the repository.
2.  Create a feature branch.
3.  Make and test your changes.
4.  Open a pull request describing the change.

## 📄 [Ashborn](#-https://github.com/ashbornofficial)

------------------------------------------------------------------------
