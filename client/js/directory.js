const CATEGORY_COLORS = {
  Food: "#c9622d",
  Fashion: "#a15c9e",
  Tech: "#3f6552",
  Health: "#2f6690",
  Education: "#c47f1f",
  Services: "#6b6f8a",
  Retail: "#b5533c",
  Other: "#7a7a72",
};

let allBusinesses = [];

function escapeHtml(str) {
  return $("<div>").text(str || "").html();
}

function renderCards(list) {
  const $grid = $("#biz-grid");
  $grid.empty();

  if (!list.length) {
    $grid.html(`
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>No businesses match that search yet.</p>
        <p>Try a different name or category — or <a href="submit.html">add the first one</a>.</p>
      </div>
    `);
    return;
  }

  list.forEach((biz) => {
    const color = CATEGORY_COLORS[biz.category] || CATEGORY_COLORS.Other;
    const card = $(`
      <button type="button" class="biz-card" style="--cat-color:${color}" data-id="${biz.id}">
        <span class="cat-tag">${escapeHtml(biz.category)}</span>
        <h3>${escapeHtml(biz.business_name)}</h3>
        <div class="biz-city">${escapeHtml(biz.city)}</div>
        <p class="biz-tagline">${escapeHtml(biz.tagline || "")}</p>
      </button>
    `);
    card.on("click", () => openDetails(biz));
    $grid.append(card);
  });
}

function openDetails(biz) {
  $("#modalBusinessName").text(biz.business_name);
  const website = biz.website
    ? `<a href="${escapeHtml(biz.website)}" target="_blank" rel="noopener">${escapeHtml(biz.website)}</a>`
    : "—";
  $("#modalBody").html(`
    <div class="detail-row"><span class="label">Owner</span><span>${escapeHtml(biz.owner_name)}</span></div>
    <div class="detail-row"><span class="label">Category</span><span>${escapeHtml(biz.category)}</span></div>
    <div class="detail-row"><span class="label">City</span><span>${escapeHtml(biz.city)}</span></div>
    <div class="detail-row"><span class="label">Tagline</span><span>${escapeHtml(biz.tagline || "—")}</span></div>
    <div class="detail-row"><span class="label">Website</span><span>${website}</span></div>
    <div class="detail-row"><span class="label">Email</span><span>${escapeHtml(biz.email)}</span></div>
  `);
  const modal = new bootstrap.Modal(document.getElementById("businessModal"));
  modal.show();
}

function applyFilters() {
  const q = $("#searchInput").val().trim().toLowerCase();
  const category = $("#categorySelect").val();

  let filtered = allBusinesses;
  if (q) {
    filtered = filtered.filter((b) => b.business_name.toLowerCase().includes(q));
  }
  if (category) {
    filtered = filtered.filter((b) => b.category === category);
  }
  renderCards(filtered);
}

function loadBusinesses() {
  $("#biz-grid").html(`
    <div class="loading-state" style="grid-column: 1 / -1;">
      <div class="spinner-brand"></div>
      <p>Loading businesses — the free server can take up to a minute to wake up.</p>
    </div>
  `);

  $.ajax({
    url: `${API_BASE_URL}/api/businesses`,
    method: "GET",
    timeout: 60000,
  })
    .done(function (data) {
      allBusinesses = data || [];
      renderCards(allBusinesses);
    })
    .fail(function (request) {
      let message;
      if (request.status === 0 && location.protocol === "file:") {
        message = "The local directory server isn't running or can't reach its database. Start the backend with valid Supabase settings in server/.env, then retry.";
      } else if (request.status === 0) {
        message = "The directory server couldn't be reached. Check your connection, then retry.";
      } else if (request.status >= 500) {
        message = "The directory server couldn't load its database. Check the server and database settings, then retry.";
      } else {
        message = `The directory endpoint returned an error (HTTP ${request.status}). Please retry in a moment.`;
      }

      $("#biz-grid").html(`
        <div class="empty-state" style="grid-column: 1 / -1;">
          <p>${message}</p>
          <button type="button" class="btn-outline-brand" id="retry-directory">Retry</button>
        </div>
      `);
    });
}

$(function () {
  loadBusinesses();
  $("#biz-grid").on("click", "#retry-directory", loadBusinesses);
  $("#searchInput").on("keyup", applyFilters);
  $("#categorySelect").on("change", applyFilters);
});
