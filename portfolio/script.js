/**
 * STANDALONE VANILLA JAVASCRIPT CONTROLLER — RIFATH AHAMED PORTFOLIO
 * ==================================================================
 * 1. Hydrates portfolioImages (from images.js + localStorage overrides) into the DOM.
 * 2. Powers the reusable EditButton & EditModal dummy placeholder system controlled
 *    by the `isAdminMode` constant (set to `true` by default).
 * 3. Powers mobile action buttons ("Hire me", "Download CV", "More actions", "View my services"),
 *    bottom tab bar navigation, handshake thank-you modal, and owner (?edit=true) media manager.
 */

(function () {
  var POPUP_AUTO_CLOSE_MS = 4000;
  var DEFAULT_RESUME_PDF_PATH = "/assets/resume.pdf";
  var STORAGE_KEY = "rifath_portfolio_media_v1";
  var DUMMY_EDIT_MESSAGE =
    "Editing will be available after the admin backend is connected";

  /**
   * Toggle constant to show or hide all dummy edit buttons across phone, tablet, and desktop.
   * Reads from window.isAdminMode (defined in images.js) and defaults to true.
   */
  var isAdminMode =
    typeof window.isAdminMode === "boolean" ? window.isAdminMode : true;

  var popupTimer = null;
  var isPopupOpen = false;
  var lastTriggerElement = null;
  var lastDummyEditTrigger = null;

  var initialFallbacks = {
    cover: "",
    profile: "",
    projects: {},
  };

  function isOwnerEditMode(searchString) {
    if (typeof searchString !== "string" || !searchString.trim()) return false;
    try {
      var normalized =
        searchString.charAt(0) === "?" ? searchString : "?" + searchString;
      var params = new URLSearchParams(normalized);
      return params.get("edit") === "true";
    } catch (_err) {
      return false;
    }
  }

  function extractGoogleDriveFileId(url) {
    if (typeof url !== "string") return null;
    var trimmed = url.trim();
    if (!trimmed) return null;

    var driveFileMatch = trimmed.match(
      /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)(?:\/.*)?$/
    );
    if (driveFileMatch && driveFileMatch[1]) {
      return driveFileMatch[1];
    }

    if (trimmed.indexOf("https://drive.google.com/") === 0) {
      try {
        var parsed = new URL(trimmed);
        var idParam = parsed.searchParams.get("id");
        if (idParam && /^[a-zA-Z0-9_-]+$/.test(idParam)) {
          return idParam;
        }
      } catch (_err) {
        return null;
      }
    }

    return null;
  }

  function isValidImageUrl(url) {
    if (typeof url !== "string") return false;
    var trimmed = url.trim();
    if (!trimmed) return false;
    if (trimmed.indexOf("data:image/") === 0) {
      return /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,[a-zA-Z0-9+/=]+$/i.test(
        trimmed
      );
    }
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
      trimmed.indexOf("data:") === 0
    ) {
      return false;
    }
    return /^[a-zA-Z0-9_./-]+(\?[a-zA-Z0-9_=&-]+)?$/.test(trimmed);
  }

  function isValidDocumentUrl(url) {
    if (typeof url !== "string") return false;
    var trimmed = url.trim();
    if (!trimmed) return false;
    if (trimmed.indexOf("data:application/pdf;base64,") === 0) {
      return true;
    }
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
      trimmed.indexOf("data:") === 0
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

    var driveId = extractGoogleDriveFileId(trimmed);
    if (driveId) {
      return "https://lh3.googleusercontent.com/d/" + driveId;
    }

    return trimmed;
  }

  function normalizeDocumentUrl(url) {
    if (typeof url !== "string" || !url.trim()) return DEFAULT_RESUME_PDF_PATH;
    var trimmed = url.trim();

    var driveId = extractGoogleDriveFileId(trimmed);
    if (driveId) {
      return "https://drive.google.com/uc?export=download&id=" + driveId;
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

  function getActiveConfig() {
    var base = window.portfolioImages || {
      cvDocument: DEFAULT_RESUME_PDF_PATH,
      cover:
        "/assets/aistudio/Professional_Yellow_Gradient_LinkedIn_Banner_139b06ae.png",
      profile: "/assets/aistudio/Untitled_9d626b95.png",
      connectionsPlaceholder: "[YOUR CONNECTIONS]",
      projects: { schoolManagement: "", homeRenovation: "" },
      certificates: [],
    };
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        return {
          cvDocument:
            typeof saved.cvDocument === "string" && saved.cvDocument.trim()
              ? saved.cvDocument
              : base.cvDocument || DEFAULT_RESUME_PDF_PATH,
          cover:
            typeof saved.cover === "string" && saved.cover.trim()
              ? saved.cover
              : base.cover ||
                "/assets/aistudio/Professional_Yellow_Gradient_LinkedIn_Banner_139b06ae.png",
          profile:
            typeof saved.profile === "string" && saved.profile.trim()
              ? saved.profile
              : base.profile || "/assets/aistudio/Untitled_9d626b95.png",
          connectionsPlaceholder:
            base.connectionsPlaceholder || "[YOUR CONNECTIONS]",
          projects: {
            schoolManagement:
              saved.projects &&
              typeof saved.projects.schoolManagement === "string"
                ? saved.projects.schoolManagement
                : (base.projects && base.projects.schoolManagement) || "",
            homeRenovation:
              saved.projects &&
              typeof saved.projects.homeRenovation === "string"
                ? saved.projects.homeRenovation
                : (base.projects && base.projects.homeRenovation) || "",
          },
          certificates: Array.isArray(saved.certificates)
            ? saved.certificates
            : Array.isArray(base.certificates)
            ? base.certificates
            : [],
        };
      }
    } catch (_err) {
      // ignore storage errors
    }
    return {
      cvDocument: base.cvDocument || DEFAULT_RESUME_PDF_PATH,
      cover:
        base.cover ||
        "/assets/aistudio/Professional_Yellow_Gradient_LinkedIn_Banner_139b06ae.png",
      profile: base.profile || "/assets/aistudio/Untitled_9d626b95.png",
      connectionsPlaceholder:
        base.connectionsPlaceholder || "[YOUR CONNECTIONS]",
      projects: {
        schoolManagement:
          (base.projects && base.projects.schoolManagement) || "",
        homeRenovation: (base.projects && base.projects.homeRenovation) || "",
      },
      certificates: Array.isArray(base.certificates) ? base.certificates : [],
    };
  }

  function preventContextAndDrag(e) {
    e.preventDefault();
  }

  function createProtectedImageElement(options) {
    var wrapper = document.createElement("div");
    wrapper.className =
      "protected-image-wrapper " + (options.wrapperClass || "");
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

    var triedDriveThumbnailFallback = false;
    img.addEventListener("error", function () {
      var ghMatch =
        typeof img.src === "string" &&
        img.src.match(
          /^https:\/\/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)$/
        );
      if (ghMatch && ghMatch[1] && !triedDriveThumbnailFallback) {
        triedDriveThumbnailFallback = true;
        img.src =
          "https://drive.google.com/thumbnail?id=" + ghMatch[1] + "&sz=w1600";
        return;
      }
      if (typeof options.onError === "function") {
        options.onError();
      }
    });

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

  function captureInitialFallbacks() {
    var coverHost = document.getElementById("cover-photo-slot");
    if (coverHost && !initialFallbacks.cover) {
      initialFallbacks.cover = coverHost.innerHTML;
    }
    var profileHost = document.getElementById("profile-photo-slot");
    if (profileHost && !initialFallbacks.profile) {
      initialFallbacks.profile = profileHost.innerHTML;
    }
    var projectSlots = document.querySelectorAll("[data-project-image-key]");
    projectSlots.forEach(function (slot) {
      var key = slot.getAttribute("data-project-image-key");
      if (key && !initialFallbacks.projects[key]) {
        initialFallbacks.projects[key] = slot.innerHTML;
      }
    });
  }

  function hydratePortfolioImages() {
    captureInitialFallbacks();
    var config = getActiveConfig();

    // Update connections placeholder text if customized in images.js
    var connEl = document.getElementById("mobile-connections-placeholder");
    if (connEl && config.connectionsPlaceholder) {
      connEl.textContent = config.connectionsPlaceholder;
    }

    // 0. Cover Banner Slot
    var coverHost = document.getElementById("cover-photo-slot");
    if (coverHost) {
      var coverUrl =
        config.cover ||
        "/assets/aistudio/Professional_Yellow_Gradient_LinkedIn_Banner_139b06ae.png";
      if (isValidImageUrl(coverUrl)) {
        coverHost.innerHTML = "";
        var coverNode = createProtectedImageElement({
          src: normalizeImageUrl(coverUrl),
          alt: "Rifath Ahamed — Executive Portfolio Cover Banner",
          eager: true,
          wrapperClass: "linkedin-cover-img-wrapper",
          imgClass: "linkedin-cover-img",
          onError: function () {
            coverHost.innerHTML = initialFallbacks.cover;
          },
        });
        coverHost.appendChild(coverNode);
      } else {
        coverHost.innerHTML = initialFallbacks.cover;
      }
    }

    // 1. Profile Photograph Slot (Overlapping Circular Avatar)
    var profileHost = document.getElementById("profile-photo-slot");
    if (profileHost) {
      if (isValidImageUrl(config.profile)) {
        profileHost.innerHTML = "";
        var profileNode = createProtectedImageElement({
          src: normalizeImageUrl(config.profile),
          alt: "RIFATH AHAMED — Professional Portrait",
          eager: true,
          wrapperClass: "cv-profile-photo",
          onError: function () {
            profileHost.innerHTML = initialFallbacks.profile;
          },
        });
        profileHost.appendChild(profileNode);
      } else {
        profileHost.innerHTML = initialFallbacks.profile;
      }
    }

    // 2. Project Screenshot Slots
    var projectSlots = document.querySelectorAll("[data-project-image-key]");
    projectSlots.forEach(function (slot) {
      var key = slot.getAttribute("data-project-image-key");
      var title = slot.getAttribute("data-project-title") || key;
      if (!key) return;

      var defaultFrameHtml = initialFallbacks.projects[key] || slot.innerHTML;
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
      } else {
        slot.innerHTML = defaultFrameHtml;
      }
    });

    // 3. Professional Certificates Gallery
    var certGallery = document.getElementById("certificates-gallery");
    if (certGallery && Array.isArray(config.certificates)) {
      var published = config.certificates.filter(function (entry) {
        if (!entry || typeof entry !== "object") return false;
        if (typeof entry.title !== "string" || !entry.title.trim())
          return false;
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
              alt:
                cert.title.trim() +
                " — Issued by " +
                (cert.issuer || "Issuing Institution"),
              eager: false,
              wrapperClass: "cv-certificate-preview",
              watermarkText:
                cert.watermark !== false
                  ? "Rifath Ahamed · Portfolio Copy"
                  : "",
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

          if (isValidDocumentUrl(cert.verificationUrl)) {
            var verifyP = document.createElement("p");
            verifyP.className = "cv-certificate-verify";
            var verifyLink = document.createElement("a");
            verifyLink.href = normalizeDocumentUrl(cert.verificationUrl);
            verifyLink.target = "_blank";
            verifyLink.rel = "noopener noreferrer";
            verifyLink.className = "cv-link";
            verifyLink.textContent = "View / Download Certificate Document";
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
    var config = getActiveConfig();
    var targetDoc = isValidDocumentUrl(config.cvDocument)
      ? normalizeDocumentUrl(config.cvDocument)
      : DEFAULT_RESUME_PDF_PATH;

    var anchor = document.createElement("a");
    anchor.href = targetDoc;
    anchor.setAttribute("download", "Rifath_Ahamed_CV.pdf");
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.scrollTo(scrollX, scrollY);
  }

  /**
   * REUSABLE DUMMY EDIT BUTTON & MODAL CONTROLLER (EditButton + EditModal)
   * ======================================================================
   * Placeholder behaviour: opens a modal titled "Edit [section name]" with the message
   * "Editing will be available after the admin backend is connected" and a Close button.
   * Traps focus inside the modal, closes on Escape, and returns focus to the triggering button.
   */
  function setupDummyEditModal() {
    var editButtons = document.querySelectorAll("[data-edit-section]");
    var modal = document.getElementById("dummy-edit-modal");
    var titleEl = document.getElementById("dummy-edit-modal-title");
    var bodyEl = document.getElementById("dummy-edit-modal-body");
    var closeBtn = document.getElementById("dummy-edit-modal-close");
    var iconCloseBtn = document.getElementById("dummy-edit-modal-icon-close");

    // Hide all dummy edit buttons if isAdminMode is switched off
    if (!isAdminMode) {
      editButtons.forEach(function (btn) {
        btn.setAttribute("hidden", "true");
      });
      if (modal) modal.setAttribute("hidden", "true");
      return;
    }

    if (!modal || !titleEl || !bodyEl) return;

    function openDummyModal(sectionName, triggerButton) {
      lastDummyEditTrigger = triggerButton || document.activeElement;
      var cleanSection =
        typeof sectionName === "string" && sectionName.trim()
          ? sectionName.trim()
          : "Section";
      titleEl.textContent = "Edit " + cleanSection;
      bodyEl.textContent = DUMMY_EDIT_MESSAGE;
      modal.removeAttribute("hidden");

      if (closeBtn && typeof closeBtn.focus === "function") {
        window.setTimeout(function () {
          closeBtn.focus({ preventScroll: true });
        }, 15);
      }
    }

    function closeDummyModal() {
      if (modal.hasAttribute("hidden")) return;
      modal.setAttribute("hidden", "true");
      if (
        lastDummyEditTrigger &&
        typeof lastDummyEditTrigger.focus === "function"
      ) {
        var target = lastDummyEditTrigger;
        window.setTimeout(function () {
          target.focus({ preventScroll: true });
        }, 15);
      }
    }

    editButtons.forEach(function (btn) {
      btn.removeAttribute("hidden");
      btn.addEventListener("click", function (e) {
        var section =
          btn.getAttribute("data-edit-section") || "Profile Section";
        openDummyModal(section, e.currentTarget);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeDummyModal);
    }
    if (iconCloseBtn) {
      iconCloseBtn.addEventListener("click", closeDummyModal);
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeDummyModal();
      }
    });

    // Focus trap and Escape key handling inside Dummy Edit Modal
    window.addEventListener("keydown", function (e) {
      if (modal.hasAttribute("hidden")) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeDummyModal();
        return;
      }

      if (e.key === "Tab") {
        var focusables = modal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  function setupMediaManagerModal() {
    var openBtn = document.getElementById("open-media-manager-btn");
    var modal = document.getElementById("media-manager-modal");
    if (!modal || !openBtn) return;

    // Strictly hide the Files & Links button from public visitors unless ?edit=true is in the URL
    if (!isOwnerEditMode(window.location.search)) {
      openBtn.setAttribute("hidden", "true");
      modal.setAttribute("hidden", "true");
      return;
    }

    openBtn.removeAttribute("hidden");

    var closeBtn = document.getElementById("media-manager-close");
    var saveBtn = document.getElementById("save-media-links-btn");
    var exportBtn = document.getElementById("export-images-js-btn");
    var resetBtn = document.getElementById("reset-media-links-btn");
    var addCertBtn = document.getElementById("add-cert-row-btn");
    var certListEl = document.getElementById("cert-editor-list");

    var cvDocInput = document.getElementById("input-cv-doc-url");
    var coverInput = document.getElementById("input-cover-url");
    var profileInput = document.getElementById("input-profile-url");
    var schoolInput = document.getElementById("input-proj-school-url");
    var homeInput = document.getElementById("input-proj-home-url");

    function bindFileToInput(fileInputId, textInputEl) {
      var fileInput = document.getElementById(fileInputId);
      if (!fileInput || !textInputEl) return;
      fileInput.addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          if (ev.target && typeof ev.target.result === "string") {
            textInputEl.value = ev.target.result;
          }
        };
        reader.readAsDataURL(file);
      });
    }

    bindFileToInput("upload-cv-doc-file", cvDocInput);
    bindFileToInput("upload-cover-file", coverInput);
    bindFileToInput("upload-profile-file", profileInput);
    bindFileToInput("upload-proj-school-file", schoolInput);
    bindFileToInput("upload-proj-home-file", homeInput);

    function createCertRowElement(certData) {
      var row = document.createElement("div");
      row.className = "media-cert-row-card";

      var topGrid = document.createElement("div");
      topGrid.className = "media-cert-grid";

      var titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.className = "media-text-input cert-title-input";
      titleInput.placeholder = "Certificate Title (e.g., AAT Sri Lanka)";
      titleInput.value = (certData && certData.title) || "";

      var issuerInput = document.createElement("input");
      issuerInput.type = "text";
      issuerInput.className = "media-text-input cert-issuer-input";
      issuerInput.placeholder = "Issuer (e.g., AAT Sri Lanka)";
      issuerInput.value = (certData && certData.issuer) || "";

      var dateInput = document.createElement("input");
      dateInput.type = "text";
      dateInput.className = "media-text-input cert-date-input";
      dateInput.placeholder = "Year / Status (e.g., 2025)";
      dateInput.value = (certData && certData.date) || "";

      topGrid.appendChild(titleInput);
      topGrid.appendChild(issuerInput);
      topGrid.appendChild(dateInput);

      var imgRow = document.createElement("div");
      imgRow.className = "media-input-row";

      var imgUrlInput = document.createElement("input");
      imgUrlInput.type = "text";
      imgUrlInput.className = "media-text-input cert-img-input";
      imgUrlInput.placeholder =
        "Certificate Image Link (Google Drive or URL)";
      imgUrlInput.value = (certData && certData.imageUrl) || "";

      var imgFileLabel = document.createElement("label");
      imgFileLabel.className = "media-file-upload-label";
      imgFileLabel.textContent = "Upload Image";
      var imgFileInput = document.createElement("input");
      imgFileInput.type = "file";
      imgFileInput.accept = "image/*";
      imgFileInput.className = "media-file-input-hidden";
      imgFileInput.addEventListener("change", function (e) {
        var f = e.target.files && e.target.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function (ev) {
          if (ev.target && typeof ev.target.result === "string") {
            imgUrlInput.value = ev.target.result;
          }
        };
        r.readAsDataURL(f);
      });
      imgFileLabel.appendChild(imgFileInput);
      imgRow.appendChild(imgUrlInput);
      imgRow.appendChild(imgFileLabel);

      var docRow = document.createElement("div");
      docRow.className = "media-input-row";

      var docUrlInput = document.createElement("input");
      docUrlInput.type = "text";
      docUrlInput.className = "media-text-input cert-doc-input";
      docUrlInput.placeholder =
        "Document / Verification Link (Google Drive PDF or URL)";
      docUrlInput.value = (certData && certData.verificationUrl) || "";

      var docFileLabel = document.createElement("label");
      docFileLabel.className = "media-file-upload-label";
      docFileLabel.textContent = "Upload PDF";
      var docFileInput = document.createElement("input");
      docFileInput.type = "file";
      docFileInput.accept = ".pdf,application/pdf";
      docFileInput.className = "media-file-input-hidden";
      docFileInput.addEventListener("change", function (e) {
        var f = e.target.files && e.target.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function (ev) {
          if (ev.target && typeof ev.target.result === "string") {
            docUrlInput.value = ev.target.result;
          }
        };
        r.readAsDataURL(f);
      });
      docFileLabel.appendChild(docFileInput);

      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "media-small-btn media-remove-btn";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", function () {
        if (row.parentNode) row.parentNode.removeChild(row);
      });

      docRow.appendChild(docUrlInput);
      docRow.appendChild(docFileLabel);
      docRow.appendChild(removeBtn);

      row.appendChild(topGrid);
      row.appendChild(imgRow);
      row.appendChild(docRow);
      return row;
    }

    function populateModalFromConfig() {
      var cfg = getActiveConfig();
      if (cvDocInput)
        cvDocInput.value = cfg.cvDocument || DEFAULT_RESUME_PDF_PATH;
      if (coverInput) {
        coverInput.value =
          cfg.cover ||
          "/assets/aistudio/Professional_Yellow_Gradient_LinkedIn_Banner_139b06ae.png";
      }
      if (profileInput) {
        profileInput.value =
          cfg.profile || "/assets/aistudio/Untitled_9d626b95.png";
      }
      if (schoolInput) {
        schoolInput.value =
          (cfg.projects &&
          typeof cfg.projects.schoolManagement === "string"
            ? cfg.projects.schoolManagement
            : "") || "";
      }
      if (homeInput) {
        homeInput.value =
          (cfg.projects && typeof cfg.projects.homeRenovation === "string"
            ? cfg.projects.homeRenovation
            : "") || "";
      }
      if (certListEl) {
        certListEl.innerHTML = "";
        var certs =
          Array.isArray(cfg.certificates) && cfg.certificates.length > 0
            ? cfg.certificates
            : [
                {
                  title: "",
                  issuer: "",
                  date: "",
                  imageUrl: "",
                  verificationUrl: "",
                },
              ];
        certs.forEach(function (c) {
          certListEl.appendChild(createCertRowElement(c));
        });
      }
    }

    function collectConfigFromModal() {
      var certs = [];
      if (certListEl) {
        var rows = certListEl.querySelectorAll(".media-cert-row-card");
        rows.forEach(function (r) {
          var t = r.querySelector(".cert-title-input");
          var i = r.querySelector(".cert-issuer-input");
          var d = r.querySelector(".cert-date-input");
          var img = r.querySelector(".cert-img-input");
          var doc = r.querySelector(".cert-doc-input");
          certs.push({
            title: t ? t.value.trim() : "",
            issuer: i ? i.value.trim() : "",
            date: d ? d.value.trim() : "",
            imageUrl: img ? img.value.trim() : "",
            verificationUrl: doc ? doc.value.trim() : "",
          });
        });
      }
      return {
        cvDocument:
          cvDocInput && cvDocInput.value.trim()
            ? cvDocInput.value.trim()
            : DEFAULT_RESUME_PDF_PATH,
        cover:
          coverInput && coverInput.value.trim()
            ? coverInput.value.trim()
            : "/assets/aistudio/Professional_Yellow_Gradient_LinkedIn_Banner_139b06ae.png",
        profile:
          profileInput && profileInput.value.trim()
            ? profileInput.value.trim()
            : "/assets/aistudio/Untitled_9d626b95.png",
        connectionsPlaceholder: "[YOUR CONNECTIONS]",
        projects: {
          schoolManagement: schoolInput ? schoolInput.value.trim() : "",
          homeRenovation: homeInput ? homeInput.value.trim() : "",
        },
        certificates:
          certs.length > 0
            ? certs
            : [
                {
                  title: "",
                  issuer: "",
                  date: "",
                  imageUrl: "",
                  verificationUrl: "",
                },
              ],
      };
    }

    function openModal() {
      populateModalFromConfig();
      modal.removeAttribute("hidden");
    }

    function closeModal() {
      modal.setAttribute("hidden", "true");
    }

    openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    if (addCertBtn && certListEl) {
      addCertBtn.addEventListener("click", function () {
        certListEl.appendChild(
          createCertRowElement({
            title: "",
            issuer: "",
            date: "",
            imageUrl: "",
            verificationUrl: "",
          })
        );
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        var updated = collectConfigFromModal();
        window.portfolioImages = updated;
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (_err) {
          // ignore storage quota errors
        }
        hydratePortfolioImages();
        closeModal();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch (_err) {
          // ignore
        }
        window.portfolioImages = {
          cvDocument: DEFAULT_RESUME_PDF_PATH,
          cover:
            "/assets/aistudio/Professional_Yellow_Gradient_LinkedIn_Banner_139b06ae.png",
          profile: "/assets/aistudio/Untitled_9d626b95.png",
          connectionsPlaceholder: "[YOUR CONNECTIONS]",
          projects: { schoolManagement: "", homeRenovation: "" },
          certificates: [
            {
              title: "",
              issuer: "",
              date: "",
              imageUrl: "",
              verificationUrl: "",
            },
          ],
        };
        hydratePortfolioImages();
        populateModalFromConfig();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        var cfg = collectConfigFromModal();
        var content =
          "/**\n" +
          " * CENTRALIZED DOCUMENT & IMAGE LINK SYSTEM — RIFATH AHAMED PORTFOLIO\n" +
          " */\n\n" +
          "const isAdminMode = true;\n\n" +
          "const portfolioImages = " +
          JSON.stringify(cfg, null, 2) +
          ";\n\n" +
          'if (typeof window !== "undefined") {\n' +
          "  window.isAdminMode = isAdminMode;\n" +
          "  window.portfolioImages = portfolioImages;\n" +
          "}\n\n" +
          'if (typeof module !== "undefined" && module.exports) {\n' +
          "  module.exports = { portfolioImages, isAdminMode };\n" +
          "}\n";
        var blob = new Blob([content], {
          type: "application/javascript;charset=utf-8",
        });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "images.js";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
        closeModal();
      }
    });
  }

  function setupInteractions() {
    var downloadBtn = document.getElementById("download-cv-btn");
    var mobileDownloadBtn = document.getElementById("mobile-download-cv-btn");
    var printBtn = document.getElementById("print-cv-btn");
    var mobileMoreBtn = document.getElementById("mobile-more-actions-btn");
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

    if (mobileDownloadBtn) {
      mobileDownloadBtn.addEventListener("click", function (e) {
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

    if (mobileMoreBtn) {
      mobileMoreBtn.addEventListener("click", function () {
        if (isPopupOpen) {
          closeHandshakePopup();
        }
        window.print();
      });
    }

    // Smooth scrolling for all in-page section anchor links ("Hire me", "View my services", tablet nav)
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || href === "#") return;
        var targetEl =
          href === "#top"
            ? document.body
            : document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          if (href === "#top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          if (window.history && typeof window.history.replaceState === "function") {
            window.history.replaceState(null, "", href);
          }
        }
        if (link.classList.contains("tablet-nav-link")) {
          document.querySelectorAll(".tablet-nav-link").forEach(function (item) {
            item.classList.remove("is-active");
            item.removeAttribute("aria-current");
          });
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        }
      });
    });

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

  function initPortfolioApp() {
    hydratePortfolioImages();
    setupDummyEditModal();
    setupInteractions();
    setupMediaManagerModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPortfolioApp);
  } else {
    initPortfolioApp();
  }
})();
