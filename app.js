const DATA_URL = "https://metshein.com/kordamine/json/broneeringud.json";

const table = document.querySelector("#broneeringute-tabel");
const tableBody = table.querySelector("tbody");
const loadingState = document.querySelector("#loading-state");
const resultCount = document.querySelector("#result-count");
const searchInput = document.querySelector("#search-input");
const serviceFilter = document.querySelector("#service-filter");
const exportButton = document.querySelector("#export-button");

const serviceClasses = {
  Juuksur: "teenus-juuksur",
  "Massaaž": "teenus-massaaž",
  Spa: "teenus-spa",
  Kosmeetika: "teenus-kosmeetika",
};

const serviceBadgeClasses = {
  Juuksur: "service-juuksur",
  "Massaaž": "service-massaaž",
  Spa: "service-spa",
  Kosmeetika: "service-kosmeetika",
};

let bookings = [];

document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("et-EE", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());
document.querySelector("#current-year").textContent = String(new Date().getFullYear());

function normalize(value) {
  return String(value ?? "").toLocaleLowerCase("et-EE").trim();
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toLocaleUpperCase("et-EE");
}

function createCell(className, content) {
  const cell = document.createElement("td");
  cell.className = className;
  if (content instanceof Node) {
    cell.append(content);
  } else {
    cell.textContent = content;
  }
  return cell;
}

function createBookingRow(booking) {
  const row = document.createElement("tr");
  row.className = serviceClasses[booking.teenus] ?? "teenus-muu";

  const client = document.createElement("div");
  client.className = "client-cell";

  const avatar = document.createElement("span");
  avatar.className = "client-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = initials(booking.klient);

  const clientName = document.createElement("span");
  clientName.textContent = booking.klient;
  client.append(avatar, clientName);

  const service = document.createElement("span");
  service.className = `service-badge ${serviceBadgeClasses[booking.teenus] ?? ""}`;
  service.textContent = booking.teenus;

  row.append(
    createCell("", client),
    createCell("", service),
    createCell("date-cell", formatDate(booking.kuupäev)),
    createCell("time-cell", booking.aeg),
    createCell("booking-id", `#${booking.broneeringu_id}`),
  );
  return row;
}

function renderBookings() {
  const query = normalize(searchInput.value);
  const selectedService = normalize(serviceFilter.value);
  const visibleBookings = bookings
    .filter((booking) => {
      const matchesQuery = normalize(`${booking.klient} ${booking.teenus}`).includes(query);
      const matchesService = selectedService === "kõik" || normalize(booking.teenus) === selectedService;
      return matchesQuery && matchesService;
    })
    .sort((first, second) => {
      const firstDate = `${first.kuupäev}T${first.aeg}`;
      const secondDate = `${second.kuupäev}T${second.aeg}`;
      return firstDate.localeCompare(secondDate);
    });

  tableBody.replaceChildren();
  if (visibleBookings.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = bookings.length
      ? "Sinu otsingule ei leitud ühtegi broneeringut."
      : "Broneeringuid ei leitud.";
    row.append(cell);
    tableBody.append(row);
  } else {
    tableBody.append(...visibleBookings.map(createBookingRow));
  }

  resultCount.textContent = `Näitan ${visibleBookings.length} / ${bookings.length} broneeringut`;
}

function updateSummary() {
  const counts = bookings.reduce((totals, booking) => {
    totals[booking.teenus] = (totals[booking.teenus] ?? 0) + 1;
    return totals;
  }, {});

  document.querySelector("#total-count").textContent = String(bookings.length);
  document.querySelector("#nav-count").textContent = String(bookings.length);
  document.querySelector("#count-juuksur").textContent = String(counts.Juuksur ?? 0);
  document.querySelector("#count-massaaz").textContent = String(counts["Massaaž"] ?? 0);
  document.querySelector("#count-spa-ilu").textContent = String((counts.Spa ?? 0) + (counts.Kosmeetika ?? 0));
}

function showError(message) {
  loadingState.replaceChildren();
  const error = document.createElement("div");
  error.className = "error-message";
  const title = document.createElement("strong");
  title.textContent = "Broneeringute laadimine ebaõnnestus";
  const detail = document.createElement("span");
  detail.textContent = message;
  error.append(title, detail);
  loadingState.append(error);
  resultCount.textContent = "Andmeid ei saanud laadida";
}

async function loadBookings() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Andmeallikas vastas veaga (${response.status}).`);
    }

    const data = await response.json();
    if (!Array.isArray(data.broneeringud)) {
      throw new Error("Andmefailis puudub broneeringute nimekiri.");
    }

    bookings = data.broneeringud.filter((booking) =>
      booking
      && typeof booking.klient === "string"
      && typeof booking.teenus === "string"
      && typeof booking.kuupäev === "string"
      && typeof booking.aeg === "string",
    );

    console.log("JSON-ist laaditud broneeringud:", bookings);
    updateSummary();
    renderBookings();
    loadingState.hidden = true;
  } catch (error) {
    console.error("Broneeringute laadimine ebaõnnestus:", error);
    showError(error instanceof Error ? error.message : "Tundmatu viga.");
  }
}

searchInput.addEventListener("input", renderBookings);
serviceFilter.addEventListener("change", renderBookings);

exportButton.addEventListener("click", () => {
  const query = normalize(searchInput.value);
  const selectedService = normalize(serviceFilter.value);
  const visibleBookings = bookings.filter((booking) => {
    const matchesQuery = normalize(`${booking.klient} ${booking.teenus}`).includes(query);
    const matchesService = selectedService === "kõik" || normalize(booking.teenus) === selectedService;
    return matchesQuery && matchesService;
  });
  const rows = [
    ["Klient", "Teenus", "Kuupäev", "Kellaaeg"],
    ...visibleBookings.map((booking) => [booking.klient, booking.teenus, booking.kuupäev, booking.aeg]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\r\n")}`;
  const downloadUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "maison-broneeringud.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase("et-EE") === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

loadBookings();
