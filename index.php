<?php
session_start();
if (!isset($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
$channel = getenv('YOUTUBE_CHANNEL_NAME') ?: 'Your YouTube Channel';
$channelUrl = getenv('YOUTUBE_CHANNEL_URL') ?: 'https://www.youtube.com/';
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>YT Subscriber Verification | Subscriber Verification Portal</title>
<link rel="icon" type="image/x-icon" href="/assets/social.png">
<link rel="stylesheet" href="assets/style.css">
<script defer src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
<script defer src="assets/app.js"></script>
</head>
<body>
<div class="ambient"></div>
<header class="topbar"><a class="brand" href="#"><span class="brand-mark">N</span><span><b>YouTube</b><small>Subscriber Verification Portal</small></span></a><span class="top-pill"><i></i> SYSTEM ONLINE</span></header>
<main class="shell">
<section class="intro"><div class="eyebrow">SECURE RESOURCE ACCESS <span>•</span> OCR ENGINE</div><h1>YouTube <em>Subscriber Verification</em></h1><p>Verify the visible subscription markers in your screenshot to continue to the requested resource.</p></section>
<section class="layout">
<div class="panel upload-panel">
<div class="panel-head"><div><span class="step">01 / INPUT</span><h2>Input Source</h2><p>Upload a screenshot of your YouTube channel subscription state.</p></div><button class="help" id="helpBtn" aria-label="Help">?</button></div>
<a class="channel-link" href="<?= htmlspecialchars($channelUrl, ENT_QUOTES) ?>" target="_blank" rel="noopener">Subscribe to <b><?= htmlspecialchars($channel, ENT_QUOTES) ?></b> on YouTube ↗</a>
<label class="dropzone" id="dropzone" for="fileInput"><input id="fileInput" type="file" accept="image/png,image/jpeg,image/webp"><span class="upload-icon">↑</span><b>Drop image file</b><small>or tap to browse</small><small class="muted">JPG, PNG or WEBP • up to 5 MB</small></label>
<div class="preview hidden" id="previewWrap"><img id="preview" alt="Selected screenshot preview"><div class="preview-meta"><span id="fileName">screenshot.png</span><button id="removeFile" type="button" class="text-button">Remove</button></div></div>
<div class="notice"><span>ⓘ</span><p>OCR checks visible text only. It cannot prove that a screenshot is genuine or that a subscription is currently active.</p></div>
</div>
<div class="panel activity-panel">
<div class="panel-head"><div><span class="step">02 / ANALYSIS</span><h2>Processing Feed</h2><p>Live activity from the verification engine.</p></div><span class="live-label"><i></i> LIVE</span></div>
<div class="feature-row"><span>FEATURE: <b>YT SUBSCRIBER</b></span><span>ENGINE: <b>TESSERACT.JS</b></span></div>
<div class="logs" id="logs" aria-live="polite"><div class="log"><time>SYS</time><span>ENGINE_INITIALIZED</span><b>OK</b></div><div class="log"><time>SYS</time><span>WAITING_FOR_USER_INPUT</span><b>--</b></div><div class="log"><time>OCR</time><span>READY_FOR_IMAGE</span><b>--</b></div></div>
<div class="status-grid"><div class="stat"><small>STATUS</small><b id="statusText">Idle</b></div><div class="stat"><small>PAYLOAD</small><b id="payloadText">Awaiting file</b></div></div>
<div class="progress-wrap hidden" id="progressWrap"><div class="progress-label"><span id="progressLabel">Preparing OCR</span><b id="progressPct">0%</b></div><div class="progress"><span id="progressBar"></span></div></div>
<button class="primary" id="verifyBtn" disabled>Initialize Analysis <span>↗</span></button><button class="secondary hidden" id="abortBtn">Abort Operation</button>
</div>
</section>
<section class="result hidden" id="result" aria-live="assertive">
<div class="result-icon" id="resultIcon">✓</div><div class="result-kicker" id="resultKicker">ACCESS GRANTED</div><h2 id="resultTitle">Identity confirmed</h2><p id="resultMessage">Visible subscription markers matched.</p><code id="resultCode">OCR_MATCH</code>
<div class="result-actions"><button class="primary" id="resourceBtn">ACCESS RESOURCE ↗</button><button class="secondary" id="continueBtn">VERIFY NEXT ENTRY</button><button class="secondary hidden" id="retryBtn">RETRY UPLOAD</button></div><p class="result-note" id="resultNote"></p>
</section>
<footer><span>Subscriber Verification Portal <b>v1.0</b></span><span>CLIENT-SIDE OCR • PRIVACY FIRST</span></footer>
</main>
<div class="toast hidden" id="toast"></div>
<dialog id="helpDialog"><div class="dialog-head"><h2>Verification guide</h2><button id="closeHelp" class="help">×</button></div><p>1. Open the channel using the link above.</p><p>2. Take a clear screenshot where the channel name and <b>Subscribed</b> label are visible together.</p><p>3. Upload it and initialize analysis. OCR can misread small or stylized text, and images can be edited.</p><button id="closeHelp2" class="primary">Understood</button></dialog>
</body></html>