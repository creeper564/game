(function () {
  const listRoot = document.querySelector("[data-crafts-list]");
  const filterRoot = document.querySelector("[data-filter-bar]");
  const countRoot = document.querySelector("[data-craft-count]");
  const searchInput = document.querySelector("[data-craft-search]");
  const tooltip = document.querySelector("[data-item-tooltip]");

  if (!listRoot || !filterRoot || !window.GK_CRAFTS || !window.GK_ITEMS) return;

  const crafts = window.GK_CRAFTS;
  const items = window.GK_ITEMS;
  let activeCategory = "Tous";
  let query = "";

  function resolveItem(entry) {
    if (!entry) return null;
    if (typeof entry === "string") {
      return items[entry] || { name: entry, image: "", description: "" };
    }
    if (entry.item && items[entry.item]) {
      return Object.assign({}, items[entry.item], entry);
    }
    return entry;
  }

  function itemImage(item) {
    if (item.image) return item.image;
    if (item.wiki) return "/api/wiki-item/" + encodeURIComponent(item.wiki);
    return "";
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function uniqueCategories() {
    return ["Tous", ...new Set(crafts.map((c) => c.category || "Autre"))];
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function slotHtml(entry, extraClass) {
    const item = resolveItem(entry);
    const classes = extraClass ? `slot ${extraClass}` : "slot";
    if (!item) return `<div class="${classes}"></div>`;

    const count = item.count && item.count > 1 ? `<span class="item-count">${Number(item.count)}</span>` : "";
    const src = itemImage(item);
    const image = src
      ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" />`
      : "";
    const fallback = `<div class="item-fallback"${src ? " hidden" : ""}>${escapeHtml(
      (item.name || "?").slice(0, 2)
    )}</div>`;

    return `<div class="${classes}" tabindex="0" data-item-name="${escapeHtml(item.name)}" data-item-desc="${escapeHtml(
      item.description || ""
    )}">${image}${fallback}${count}</div>`;
  }

  function renderFilters() {
    filterRoot.innerHTML = uniqueCategories()
      .map(
        (category) =>
          `<button type="button" class="filter-btn${category === activeCategory ? " is-active" : ""}" aria-pressed="${
            category === activeCategory
          }" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`
      )
      .join("");
  }

  function filtered() {
    const q = normalize(query.trim());
    return crafts.filter((craft) => {
      if (activeCategory !== "Tous" && (craft.category || "Autre") !== activeCategory) return false;
      if (!q) return true;
      return normalize(`${craft.name} ${craft.description} ${craft.category}`).includes(q);
    });
  }

  function renderCrafts() {
    const visible = filtered();

    countRoot.textContent = visible.length
      ? `${visible.length} craft${visible.length > 1 ? "s" : ""} affiché${visible.length > 1 ? "s" : ""}`
      : "";

    if (!visible.length) {
      listRoot.innerHTML = '<p class="empty-state">Aucun craft ne correspond à ta recherche.</p>';
      return;
    }

    listRoot.innerHTML = visible
      .map((craft, i) => {
        const grid = (craft.grid || []).slice(0, 9);
        while (grid.length < 9) grid.push(null);
        return `
          <article class="craft-card" style="animation-delay:${Math.min(i, 8) * 0.05}s">
            <div class="craft-bench">
              <div class="craft-grid" role="img" aria-label="Table de craft 3x3 : ${escapeHtml(craft.name)}">
                ${grid.map((cell) => slotHtml(cell)).join("")}
              </div>
              <div class="result-wrap">
                <div class="result-arrow" aria-hidden="true">➜</div>
                ${slotHtml(craft.result, "result-slot")}
              </div>
            </div>
            <div class="craft-meta">
              <span class="badge">${escapeHtml(craft.category || "Autre")}</span>
              <h3>${escapeHtml(craft.name)}</h3>
              <p class="muted">${escapeHtml(craft.description || "")}</p>
            </div>
          </article>`;
      })
      .join("");
  }

  /* Les erreurs d'image ne remontent pas : on les capte en phase de capture. */
  listRoot.addEventListener(
    "error",
    (event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement)) return;
      img.hidden = true;
      const fallback = img.parentElement && img.parentElement.querySelector(".item-fallback");
      if (fallback) fallback.hidden = false;
    },
    true
  );

  filterRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.getAttribute("data-category");
    renderFilters();
    renderCrafts();
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      query = searchInput.value;
      renderCrafts();
    });
  }

  /* ---------- Infobulle (souris, clavier, tactile) ---------- */
  function placeTooltip(x, y) {
    if (!tooltip) return;
    const pad = 14;
    const rect = tooltip.getBoundingClientRect();
    let left = x + pad;
    let top = y + pad;
    if (left + rect.width > window.innerWidth - 8) left = x - rect.width - pad;
    if (top + rect.height > window.innerHeight - 8) top = y - rect.height - pad;
    tooltip.style.left = `${Math.max(8, left)}px`;
    tooltip.style.top = `${Math.max(8, top)}px`;
  }

  function showTooltip(slot, x, y) {
    if (!tooltip) return;
    const name = slot.getAttribute("data-item-name");
    const desc = slot.getAttribute("data-item-desc");
    tooltip.innerHTML = `<strong>${escapeHtml(name)}</strong>${desc ? `<span>${escapeHtml(desc)}</span>` : ""}`;
    tooltip.hidden = false;
    placeTooltip(x, y);
  }

  function hideTooltip() {
    if (tooltip) tooltip.hidden = true;
  }

  listRoot.addEventListener("pointerover", (event) => {
    const slot = event.target.closest("[data-item-name]");
    if (slot) showTooltip(slot, event.clientX, event.clientY);
  });

  listRoot.addEventListener("pointermove", (event) => {
    if (tooltip && !tooltip.hidden) placeTooltip(event.clientX, event.clientY);
  });

  listRoot.addEventListener("pointerout", (event) => {
    const slot = event.target.closest("[data-item-name]");
    if (!slot) return;
    if (event.relatedTarget && slot.contains(event.relatedTarget)) return;
    hideTooltip();
  });

  listRoot.addEventListener("focusin", (event) => {
    const slot = event.target.closest("[data-item-name]");
    if (!slot) return;
    const r = slot.getBoundingClientRect();
    showTooltip(slot, r.right, r.top);
  });

  listRoot.addEventListener("focusout", hideTooltip);
  window.addEventListener("scroll", hideTooltip, { passive: true });

  renderFilters();
  renderCrafts();
})();
