/**
 * STANDALONE VANILLA JAVASCRIPT CONTROLLER — RIFATH AHAMED PORTFOLIO
 * ==================================================================
 * Connects portfolioImages (from images.js) to the semantic HTML5 DOM,
 * hydrates the LinkedIn-style cover banner and overlapping circular profile photo,
 * enforces image protection, handles Download CV (assets/resume.pdf),
 * drives the animated SVG handshake thank-you popup, and triggers A4 Print.
 */

(function () {
  var POPUP_AUTO_CLOSE_MS = 4000;
  var RESUME_PDF_PATH = "assets/resume.pdf";
  var popupTimer = null;
  var isPopupOpen = false;
  var lastTriggerElement = null;

  function isValidImageUrl(url) {
    if (typeof url !== "string") return false;
    var trimmed = url.trim();
    if (!trimmed) return false;
    if (trimmed.indexOf("https://") === 0) {
      try {
        var parsed = new URL(trimmed);
        return parsed.protocol === "https:" && Boolean(parsed.hostname);
      } catch (_err) {
        return false;
      }
    }
    if (
      trimmed.indexOf("http://") === 0 ||
      trimmed.indexOf("javascript:") === 0 ||
      trimmed.indexOf("data:text") === 0
    ) {
      return false;
    }
    return /^[a-zA-Z0-9_./-]+(\?[a-zA-Z0-9_=&-]+)?$/.test(trimmed);
  }

  function isRestrictedAcademicDocument(title) {
    if (typeof title !== "string") return false;
    var normalized = title.toLowerCase().trim();
    if (!normalized) return false;
    return (
      /\bdegree\s+certificate\s+photo/i.test(normalized) ||
      /\bscanned\s+academic\s+transcript/i.test(normalized) ||
      /\bacademic\s+transcript\s+scan/i.test(normalized)
    );
  }

  function normalizeImageUrl(url) {
    if (typeof url !== "string") return "";
    var trimmed = url.trim();
    if (!trimmed) return "";

    var driveFileMatch = trimmed.match(
      /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)(?:\/.*)?$/
    );
    if (driveFileMatch && driveFileMatch[1]) {
      return "https://lh3.googleusercontent.com/d/" + driveFileMatch[1];
    }

    if (trimmed.indexOf("https://drive.google.com/") === 0) {
      try {
        var parsed = new URL(trimmed);
        var idParam = parsed.searchParams.get("id");
        if (idParam && /^[a-zA-Z0-9_-]+$/.test(idParam)) {
          return "https://lh3.googleusercontent.com/d/" + idParam;
        }
      } catch (_err) {
        // fall through
      }
    }

    return trimmed;
  }

  function resolveScreenshots(val) {
    if (!val) return [];
    if (typeof val === "string") {
      return isValidImageUrl(val) ? [normalizeImageUrl(val)] : [];
    }
    if (Array.isArray(val)) {
      return val.filter(isValidImageUrl).map(function (item) {
        return normalizeImageUrl(item);
      });
    }
    return [];
  }

  function preventContextAndDrag(e) {
    e.preventDefault();
  }

  function createProtectedImageElement(options) {
    var wrapper = document.createElement("div");
    wrapper.className = "protected-image-wrapper " + (options.wrapperClass || "");
    wrapper.addEventListener("contextmenu", preventContextAndDrag);
    wrapper.addEventListener("dragstart", preventContextAndDrag);

    var img = document.createElement("img");
    img.src = options.src;
    img.alt = options.alt || "";
    img.loading = options.eager ? "eager" : "lazy";
    img.decoding = "async";
    img.setAttribute("draggable", "false");
    img.referrerPolicy = "no-referrer";
    img.className = "protected-image " + (options.imgClass || "");
    img.addEventListener("contextmenu", preventContextAndDrag);
    img.addEventListener("dragstart", preventContextAndDrag);

    if (typeof options.onError === "function") {
      img.addEventListener("error", options.onError);
    }

    var shield = document.createElement("div");
    shield.className = "protected-image-shield";
    shield.setAttribute("aria-hidden", "true");

    if (options.watermarkText) {
      var wm = document.createElement("span");
      wm.className = "certificate-watermark";
      wm.textContent = options.watermarkText;
      shield.appendChild(wm);
    }

    wrapper.appendChild(img);
    wrapper.appendChild(shield);
    return wrapper;
  }

  function hydratePortfolioImages() {
    var config = window.portfolioImages || {
      cover: "/assets/cover-banner.jpg",
      profile: "/assets/aistudio/Untitled_9d626b95.png",
      projects: { schoolManagement: "", homeRenovation: "" },
      certificates: [],
    };

    // 0. Cover Banner Slot
    var coverHost = document.getElementById("cover-photo-slot");
    if (coverHost) {
      var coverFallbackHtml = coverHost.innerHTML;
      var coverUrl = config.cover || "/assets/cover-banner.jpg";
      if (isValidImageUrl(coverUrl)) {
        coverHost.innerHTML = "";
        var coverNode = createProtectedImageElement({
          src: normalizeImageUrl(coverUrl),
          alt: "Rifath Ahamed — Executive Portfolio Cover Banner",
          eager: true,
          wrapperClass: "linkedin-cover-img-wrapper",
          imgClass: "linkedin-cover-img",
          onError: function () {
            coverHost.innerHTML = coverFallbackHtml;
          },
        });
        coverHost.appendChild(coverNode);
      } else {
        coverHost.addEventListener("contextmenu", preventContextAndDrag);
      }
    }

    // 1. Profile Photograph Slot (Overlapping Circular Avatar)
    var profileHost = document.getElementById("profile-photo-slot");
    if (profileHost) {
      var fallbackHtml = profileHost.innerHTML;
      if (isValidImageUrl(config.profile)) {
        profileHost.innerHTML = "";
        var profileNode = createProtectedImageElement({
          src: normalizeImageUrl(config.profile),
          alt: "RIFATH AHAMED — Professional Portrait",
          eager: true,
          wrapperClass: "cv-profile-photo",
          onError: function () {
            profileHost.innerHTML = fallbackHtml;
          },
        });
        profileHost.appendChild(profileNode);
      } else {
        profileHost.addEventListener("contextmenu", preventContextAndDrag);
      }
    }

    // 2. Project Screenshot Slots (Keep clean neutral frames until configured in images.js)
    var projectSlots = document.querySelectorAll("[data-project-image-key]");
    projectSlots.forEach(function (slot) {
      var key = slot.getAttribute("data-project-image-key");
      var title = slot.getAttribute("data-project-title") || key;
      if (!key) return;

      var defaultFrameHtml = slot.innerHTML;
      var urls = resolveScreenshots(config.projects && config.projects[key]);
      if (urls.length > 0) {
        slot.innerHTML = "";
        var stack = document.createElement("div");
        stack.className = "cv-project-screenshots-stack";

        urls.forEach(function (url, idx) {
          var shotNode = createProtectedImageElement({
            src: url,
            alt: title + " — Screenshot " + (idx + 1),
            eager: false,
            wrapperClass: "cv-project-screenshot",
            onError: function () {
              slot.innerHTML = defaultFrameHtml;
            },
          });
          stack.appendChild(shotNode);
        });

        slot.appendChild(stack);
      }
    });

    // 3. Professional Certificates Gallery (Hide empty entries and restricted academic scans)
    var certGallery = document.getElementById("certificates-gallery");
    if (certGallery && Array.isArray(config.certificates)) {
      var published = config.certificates.filter(function (entry) {
        if (!entry || typeof entry !== "object") return false;
        if (typeof entry.title !== "string" || !entry.title.trim()) return false;
        if (isRestrictedAcademicDocument(entry.title)) return false;
        return true;
      });

      if (published.length > 0) {
        certGallery.removeAttribute("hidden");
        certGallery.innerHTML = "";

        published.forEach(function (cert) {
          var article = document.createElement("article");
          article.className = "cv-certificate-item";

          if (isValidImageUrl(cert.imageUrl)) {
            var imgBox = document.createElement("div");
            imgBox.className = "cv-certificate-image-box";
            var certImg = createProtectedImageElement({
              src: normalizeImageUrl(cert.imageUrl),
              alt: cert.title.trim() + " — Issued by " + (cert.issuer || "Issuing Institution"),
              eager: false,
              wrapperClass: "cv-certificate-preview",
              watermarkText:
                cert.watermark !== false ? "Rifath Ahamed · Portfolio Copy" : "",
            });
            imgBox.appendChild(certImg);
            article.appendChild(imgBox);
          }

          var meta = document.createElement("div");
          meta.className = "cv-certificate-meta";

          var h3 = document.createElement("h3");
          h3.className = "cv-Subheading";
          h3.textContent = cert.title.trim();
          meta.appendChild(h3);

          if (typeof cert.issuer === "string" && cert.issuer.trim()) {
            var issuerP = document.createElement("p");
            issuerP.className = "cv-secondary-text";
            var issuerStrong = document.createElement("strong");
            issuerStrong.textContent = "Issuing Institution: ";
            issuerP.appendChild(issuerStrong);
            issuerP.appendChild(document.createTextNode(cert.issuer.trim()));
            meta.appendChild(issuerP);
          }

          if (typeof cert.date === "string" && cert.date.trim()) {
            var dateP = document.createElement("p");
            dateP.className = "cv-secondary-text cv-tabular-nums";
            var dateStrong = document.createElement("strong");
            dateStrong.textContent = "Date: ";
            dateP.appendChild(dateStrong);
            dateP.appendChild(document.createTextNode(cert.date.trim()));
            meta.appendChild(dateP);
          }

          if (
            typeof cert.verificationUrl === "string" &&
            cert.verificationUrl.trim().indexOf("https://") === 0
          ) {
            var verifyP = document.createElement("p");
            verifyP.className = "cv-certificate-verify";
            var verifyLink = document.createElement("a");
            verifyLink.href = cert.verificationUrl.trim();
            verifyLink.target = "_blank";
            verifyLink.rel = "noopener noreferrer";
            verifyLink.className = "cv-link";
            verifyLink.textContent = "Verify Credential ↗";
            verifyP.appendChild(verifyLink);
            meta.appendChild(verifyP);
          }

          article.appendChild(meta);
          certGallery.appendChild(article);
        });
      } else {
        certGallery.setAttribute("hidden", "true");
      }
    }
  }

  function triggerPdfDownload() {
    var scrollX = window.scrollX;
    var scrollY = window.scrollY;

    var anchor = document.createElement("a");
    anchor.href = RESUME_PDF_PATH;
    anchor.setAttribute("download", "Rifath_Ahamed_CV.pdf");
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.scrollTo(scrollX, scrollY);
  }

  function setupInteractions() {
    var downloadBtn = document.getElementById("download-cv-btn");
    var printBtn = document.getElementById("print-cv-btn");
    var modal = document.getElementById("handshake-modal");
    var modalCard = document.getElementById("handshake-modal-card");
    var closeBtn = document.getElementById("handshake-modal-close");

    function closeHandshakePopup() {
      if (!isPopupOpen || !modal) return;
      isPopupOpen = false;
      modal.setAttribute("hidden", "true");
      if (modalCard) {
        modalCard.classList.remove("is-animating");
      }
      if (popupTimer) {
        window.clearTimeout(popupTimer);
        popupTimer = null;
      }
      var focusTarget = lastTriggerElement || downloadBtn;
      if (focusTarget && typeof focusTarget.focus === "function") {
        window.setTimeout(function () {
          focusTarget.focus({ preventScroll: true });
        }, 10);
      }
    }

    function openHandshakePopup(triggerEl) {
      if (isPopupOpen || !modal) return;
      isPopupOpen = true;
      lastTriggerElement = triggerEl || downloadBtn;
      modal.removeAttribute("hidden");
      if (modalCard) {
        modalCard.classList.remove("is-animating");
        void modalCard.offsetWidth;
        modalCard.classList.add("is-animating");
      }
      if (closeBtn) {
        window.setTimeout(function () {
          closeBtn.focus({ preventScroll: true });
        }, 40);
      }
      popupTimer = window.setTimeout(function () {
        closeHandshakePopup();
      }, POPUP_AUTO_CLOSE_MS);
    }

    if (downloadBtn) {
      downloadBtn.addEventListener("click", function (e) {
        openHandshakePopup(e.currentTarget);
        triggerPdfDownload();
      });
    }

    if (printBtn) {
      printBtn.addEventListener("click", function () {
        if (isPopupOpen) {
          closeHandshakePopup();
        }
        window.print();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeHandshakePopup();
      });
    }

    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) {
          closeHandshakePopup();
        }
      });
    }

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isPopupOpen) {
        e.preventDefault();
        closeHandshakePopup();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      hydratePortfolioImages();
      setupInteractions();
    });
  } else {
    hydratePortfolioImages();
    setupInteractions();
  }
})();
