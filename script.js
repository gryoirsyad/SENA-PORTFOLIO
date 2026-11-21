
const DEFAULT_DATA = {
  name: "Sena",
  logo: "S.",
  location: "Indonesia",
  state: "Still becoming",
  eyebrow: "AN ONGOING EXPERIMENT",
  title: "Still|Becoming.",
  description: "An unfinished perspective in an endlessly interesting world.",
  sideNote: "ALWAYS QUESTIONING.\nNEVER FINISHED.",
  aboutTitle: "A mind that|refuses to settle.",
  about: "I am someone who finds meaning in questions, explores different perspectives, and believes that understanding oneself is a lifelong process.",
  image: "",
  imageCaption: "A WORK IN PROGRESS.",
  interests: [
    "Philosophy",
    "Ethics & Morality",
    "Psychology",
    "Human Behavior",
    "Self Discovery"
  ],
  projects: [
    {
      title: "Personal Archive",
      category: "CREATIVE EXPERIMENT / 2026",
      description: "A digital space to collect thoughts, ideas and personal reflections.",
      image: "",
      link: "#"
    },
    {
      title: "Mindspace",
      category: "DIGITAL EXPERIENCE / 2026",
      description: "An exploration of personal reflection and self-awareness.",
      image: "",
      link: "#"
    },
    {
      title: "The Institution",
      category: "GAME DEVELOPMENT / 2026",
      description: "A psychological survival horror experience.",
      image: "",
      link: "#"
    }
  ],
  quote: "Perhaps the most interesting thing about life is that we never truly finish understanding it.",
  author: "A PERSONAL REFLECTION",
  email: "hello@example.com",
  social: [
    { name: "Instagram", url: "https://instagram.com/" },
    { name: "GitHub", url: "https://github.com/" },
    { name: "LinkedIn", url: "https://linkedin.com/" }
  ],
  theme: {
    background: "#0a0a0a",
    accent: "#d4a85f",
    text: "#e9e6df",
    font: "DM Sans"
  }
};

const STORAGE_KEY = "sena_portfolio_v1";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return clone(DEFAULT_DATA);

    const parsed = JSON.parse(saved);

    return {
      ...clone(DEFAULT_DATA),
      ...parsed,
      theme: {
        ...DEFAULT_DATA.theme,
        ...(parsed.theme || {})
      },
      projects: Array.isArray(parsed.projects)
        ? parsed.projects : clone(DEFAULT_DATA.projects),
      interests: Array.isArray(parsed.interests)
        ? parsed.interests : clone(DEFAULT_DATA.interests),
      social: Array.isArray(parsed.social)
        ? parsed.social : clone(DEFAULT_DATA.social)
    };
  } catch (error) {
    console.error("Could not load portfolio:", error);
    return clone(DEFAULT_DATA);
  }
}

let data = loadData();

const $ = id => document.getElementById(id);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function renderEmphasis(value) {
  const parts = String(value || "").split("|");

  if (parts.length < 2) {
    return escapeHTML(value);
  }

  return escapeHTML(parts[0]) + "<br><em>" +
    escapeHTML(parts.slice(1).join(" ")) + "</em>";
}

function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// RENDER PORTFOLIO

function renderPortfolio() {
  $("navLogo").textContent = data.logo;
  $("heroLocation").textContent = "BASED IN " + data.location.toUpperCase();
  $("heroYear").textContent = new Date().getFullYear();

  $("heroEyebrow").textContent = data.eyebrow;
  $("heroTitle").innerHTML = renderEmphasis(data.title);
  $("heroDescription").textContent = data.description;
  $("heroSideNote").innerHTML = escapeHTML(data.sideNote)
    .replace(/\n/g, "<br>");

  $("aboutTitle").innerHTML = renderEmphasis(data.aboutTitle);
  $("aboutDescription").textContent = data.about;
  $("personName").textContent = data.name;
  $("personLocation").textContent = data.location;
  $("personState").textContent = data.state;
  $("imageCaption").textContent = data.imageCaption;

  $("profileImage").style.display = data.image ? "block" : "none";
  $("profileImage").src = data.image || "";
  $("imagePlaceholder").style.display = data.image ? "none" : "grid";

  $("interestList").innerHTML = data.interests.map((item, i) => `
    <div class="interest-item">
      <span>${escapeHTML(item)}</span>
      <span>0${i + 1} ↗</span>
    </div>
  `).join("");

  $("projectCount").textContent =
    String(data.projects.length).padStart(2, "0") + " PROJECTS";

  $("projectGrid").innerHTML = data.projects.map((project, i) => `
    <article class="project-card">
      <a href="${safeURL(project.link)}" target="_blank"
         rel="noopener noreferrer" class="project-visual">
        ${project.image
          ? `<img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)}">`
          : `<span class="project-placeholder">PROJECT / 0${i + 1}</span>`
        }
      </a>
      <div class="project-info">
        <div>
          <h3>${escapeHTML(project.title)}</h3>
          <p>${escapeHTML(project.category)}<br>
          ${escapeHTML(project.description)}</p>
        </div>
        <a href="${safeURL(project.link)}" target="_blank"
           rel="noopener noreferrer" class="project-link">↗</a>
      </div>
    </article>
  `).join("");

  $("thoughtQuote").textContent = data.quote;
  $("thoughtAuthor").textContent = "— " + data.author;

  $("contactEmail").href = "mailto:" + data.email;
  $("contactEmail").textContent = "GET IN TOUCH ↗";

  $("socialLinks").innerHTML = data.social.map(s => `
    <a href="${safeURL(s.url)}" target="_blank"
       rel="noopener noreferrer">${escapeHTML(s.name)} ↗</a>
  `).join("");

  $("footerName").textContent =
    data.name.toUpperCase() + " — STILL BECOMING";
  $("footerYear").textContent = new Date().getFullYear();

  document.documentElement.style.setProperty(
    "--bg", data.theme.background
  );
  document.documentElement.style.setProperty(
    "--accent", data.theme.accent
  );
  document.documentElement.style.setProperty(
    "--text", data.theme.text
  );
  document.documentElement.style.setProperty(
    "--sans", `"${data.theme.font}", sans-serif`
  );

  document.querySelector(".navbar").style.background =
    data.theme.background + "ee";
}

function safeURL(value) {
  try {
    const url = new URL(value, window.location.href);

    if (["http:", "https:", "mailto:"].includes(url.protocol)) {
      return escapeHTML(url.href);
    }
  } catch {}

  return "#";
}

// SAVE DATA

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    renderPortfolio();
    notify("CHANGES SAVED");
    return true;
  } catch (error) {
    console.error(error);
    notify("Storage full. Try a smaller image.");
    return false;
  }
}

// EDITOR PANEL

function openEditor() {
  $("editorOverlay").classList.add("active");
  populateEditor();
}

function closeEditor() {
  $("editorOverlay").classList.remove("active");
}

$("editButton").addEventListener("click", openEditor);
$("closeEditor").addEventListener("click", closeEditor);

$("editorOverlay").addEventListener("click", e => {
  if (e.target === $("editorOverlay")) closeEditor();
});

function setValue(id, value) {
  $(id).value = value ?? "";
}

function populateEditor() {
  setValue("editName", data.name);
  setValue("editLogo", data.logo);
  setValue("editLocation", data.location);
  setValue("editState", data.state);
  setValue("editEyebrow", data.eyebrow);
  setValue("editTitle", data.title);
  setValue("editDescription", data.description);
  setValue("editSideNote", data.sideNote);

  setValue("editAboutTitle", data.aboutTitle);
  setValue("editAbout", data.about);
  setValue("editImageCaption", data.imageCaption);

  setValue("editInterests", data.interests.join("\n"));

  setValue("editQuote", data.quote);
  setValue("editAuthor", data.author);

  setValue("editEmail", data.email);
  setValue("editSocial", data.social
    .map(s => `${s.name}|${s.url}`).join("\n"));

  setValue("editBackground", data.theme.background);
  setValue("editAccent", data.theme.accent);
  setValue("editText", data.theme.text);
  setValue("editFont", data.theme.font);

  renderProjectEditor();
}

function readEditor() {
  data.name = $("editName").value.trim();
  data.logo = $("editLogo").value;
  data.location = $("editLocation").value;
  data.state = $("editState").value;
  data.eyebrow = $("editEyebrow").value;
  data.title = $("editTitle").value;
  data.description = $("editDescription").value;
  data.sideNote = $("editSideNote").value;

  data.aboutTitle = $("editAboutTitle").value;
  data.about = $("editAbout").value;
  data.imageCaption = $("editImageCaption").value;

  data.interests = $("editInterests").value
    .split("\n").map(x => x.trim()).filter(Boolean);

  data.quote = $("editQuote").value;
  data.author = $("editAuthor").value;

  data.email = $("editEmail").value.trim();

  data.social = $("editSocial").value
    .split("\n")
    .map(line => {
      const index = line.indexOf("|");
      if (index === -1) return null;

      return {
        name: line.slice(0, index).trim(),
        url: line.slice(index + 1).trim()
      };
    })
    .filter(s => s && s.name && s.url);

  data.theme = {
    background: $("editBackground").value,
    accent: $("editAccent").value,
    text: $("editText").value,
    font: $("editFont").value
  };
}

// LIVE PREVIEW

const liveFields = {
  editName: "name",
  editLogo: "logo",
  editLocation: "location",
  editState: "state",
  editEyebrow: "eyebrow",
  editTitle: "title",
  editDescription: "description",
  editSideNote: "sideNote",
  editAboutTitle: "aboutTitle",
  editAbout: "about",
  editImageCaption: "imageCaption",
  editQuote: "quote",
  editAuthor: "author",
  editEmail: "email"
};

Object.entries(liveFields).forEach(([id, key]) => {
  $(id).addEventListener("input", () => {
    data[key] = $(id).value;
    renderPortfolio();
  });
});

["editInterests", "editSocial"].forEach(id => {
  $(id).addEventListener("input", () => {
    readEditor();
    renderPortfolio();
  });
});

["editBackground", "editAccent", "editText", "editFont"].forEach(id => {
  $(id).addEventListener("input", () => {
    readEditor();
    renderPortfolio();
  });
});

// PROFILE IMAGE

$("imageUpload").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    notify("PLEASE SELECT AN IMAGE");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    notify("IMAGE MUST BE UNDER 2 MB");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    data.image = reader.result;
    renderPortfolio();
    notify("IMAGE UPDATED — SAVE CHANGES");
  };

  reader.readAsDataURL(file);
});

// PROJECT MANAGEMENT

function renderProjectEditor() {
  $("projectEditor").innerHTML = data.projects.map((p, i) => `
    <div class="project-editor-card">
      <p class="eyebrow">PROJECT ${String(i + 1).padStart(2, "0")}</p>

      <label>Title
        <input data-project="${i}" data-field="title"
          value="${escapeHTML(p.title)}">
      </label>

      <label>Category
        <input data-project="${i}" data-field="category"
          value="${escapeHTML(p.category)}">
      </label>

      <label>Description
        <textarea data-project="${i}" data-field="description">${escapeHTML(p.description)}</textarea>
      </label>

      <label>Image URL
        <input data-project="${i}" data-field="image"
          value="${escapeHTML(p.image)}">
      </label>

      <label>Project URL
        <input data-project="${i}" data-field="link"
          value="${escapeHTML(p.link)}">
      </label>

      <button class="danger-button"
        data-delete-project="${i}">DELETE PROJECT</button>
    </div>
  `).join("");
}

$("projectEditor").addEventListener("input", e => {
  const index = e.target.dataset.project;
  const field = e.target.dataset.field;

  if (index === undefined || !field) return;

  data.projects[Number(index)][field] = e.target.value;
  renderPortfolio();
});

$("projectEditor").addEventListener("click", e => {
  const index = e.target.dataset.deleteProject;
  if (index === undefined) return;

  data.projects.splice(Number(index), 1);
  renderProjectEditor();
  renderPortfolio();
});

$("addProject").addEventListener("click", () => {
  data.projects.push({
    title: "New Project",
    category: "CATEGORY / YEAR",
    description: "Write a short project description.",
    image: "",
    link: "#"
  });

  renderProjectEditor();
  renderPortfolio();
});

// SAVE BUTTON

$("saveButton").addEventListener("click", () => {
  readEditor();
  saveData();
});

// EXPORT JSON

$("exportButton").addEventListener("click", () => {
  readEditor();

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "sena-portfolio-backup.json";
  link.click();

  URL.revokeObjectURL(url);
  saveData();
});

// IMPORT JSON

$("importButton").addEventListener("click", () => {
  $("importFile").click();
});

$("importFile").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());

    if (
      !imported ||
      typeof imported !== "object" ||
      !Array.isArray(imported.projects) ||
      !Array.isArray(imported.interests) ||
      !imported.theme
    ) {
      throw new Error("Invalid portfolio format");
    }

    data = {
      ...clone(DEFAULT_DATA),
      ...imported,
      theme: {
        ...DEFAULT_DATA.theme,
        ...imported.theme
      }
    };

    if (saveData()) {
      populateEditor();
      notify("PORTFOLIO IMPORTED");
    }
  } catch (error) {
    notify("INVALID JSON FILE");
    console.error(error);
  }

  e.target.value = "";
});

// RESET

$("resetButton").addEventListener("click", () => {
  const confirmed = confirm(
    "Reset all portfolio content to default? This cannot be undone unless you have exported a backup."
  );

  if (!confirmed) return;

  data = clone(DEFAULT_DATA);

  if (saveData()) {
    populateEditor();
    notify("PORTFOLIO RESET");
  }
});

// INITIALIZE

renderPortfolio();
