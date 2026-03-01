const demoData = [
  { fecha: "2025-01-10", distrito: "Abai", categoria: "Obras", descripcion: "Mejoramiento de camino vecinal", monto: 420000000, beneficiarios: 1200 },
  { fecha: "2025-01-22", distrito: "San Juan Nepomuceno", categoria: "Salud", descripcion: "Equipamiento de puesto de salud", monto: 185000000, beneficiarios: 3500 },
  { fecha: "2025-02-03", distrito: "Yuty", categoria: "Educación", descripcion: "Refacción de aula escolar", monto: 98000000, beneficiarios: 640 },
  { fecha: "2025-02-11", distrito: "Abai", categoria: "Asistencia Social", descripcion: "Entrega de kits alimentarios", monto: 76000000, beneficiarios: 2200 },
  { fecha: "2025-02-25", distrito: "Caazapá", categoria: "Producción", descripcion: "Apoyo a comité de productores", monto: 132000000, beneficiarios: 410 }
];

let allRows = [];
let districtChart;
let categoryChart;

const moneyFormat = new Intl.NumberFormat("es-PY", {
  style: "currency",
  currency: "PYG",
  maximumFractionDigits: 0
});

const excelFile = document.getElementById("excelFile");
const districtFilter = document.getElementById("districtFilter");
const categoryFilter = document.getElementById("categoryFilter");
const searchFilter = document.getElementById("searchFilter");
const useDemoButton = document.getElementById("useDemo");
const tableBody = document.getElementById("tableBody");
const totalRecords = document.getElementById("totalRecords");
const totalAmount = document.getElementById("totalAmount");
const totalBeneficiaries = document.getElementById("totalBeneficiaries");
const downloadReport = document.getElementById("downloadReport");

function normalizeRow(row) {
  return {
    fecha: String(row.Fecha || row.fecha || "").slice(0, 10),
    distrito: String(row.Distrito || row.distrito || "Sin distrito").trim(),
    categoria: String(row.Categoria || row.categoria || "Sin categoría").trim(),
    descripcion: String(row.Descripcion || row.descripcion || "").trim(),
    monto: Number(row.Monto || row.monto || 0),
    beneficiarios: Number(row.Beneficiarios || row.beneficiarios || 0)
  };
}

function loadRows(rows) {
  allRows = rows.map(normalizeRow).filter((r) => r.distrito && !Number.isNaN(r.monto));
  localStorage.setItem("caazapa_rows", JSON.stringify(allRows));
  refreshOptions();
  render();
}

function refreshOptions() {
  const districts = [...new Set(allRows.map((r) => r.distrito))].sort();
  const categories = [...new Set(allRows.map((r) => r.categoria))].sort();

  districtFilter.innerHTML = '<option value="">Todos</option>';
  categoryFilter.innerHTML = '<option value="">Todas</option>';

  districts.forEach((d) => districtFilter.insertAdjacentHTML("beforeend", `<option>${d}</option>`));
  categories.forEach((c) => categoryFilter.insertAdjacentHTML("beforeend", `<option>${c}</option>`));
}

function filteredRows() {
  const district = districtFilter.value;
  const category = categoryFilter.value;
  const term = searchFilter.value.toLowerCase().trim();

  return allRows.filter((r) => {
    return (!district || r.distrito === district)
      && (!category || r.categoria === category)
      && (!term || `${r.descripcion} ${r.categoria} ${r.distrito}`.toLowerCase().includes(term));
  });
}

function renderTable(rows) {
  tableBody.innerHTML = rows.map((r) => `
    <tr>
      <td>${r.fecha}</td>
      <td>${r.distrito}</td>
      <td>${r.categoria}</td>
      <td>${r.descripcion}</td>
      <td>${moneyFormat.format(r.monto)}</td>
      <td>${r.beneficiarios.toLocaleString("es-PY")}</td>
    </tr>
  `).join("");
}

function sumBy(rows, key) {
  return rows.reduce((acc, row) => {
    acc[row[key]] = (acc[row[key]] || 0) + row.monto;
    return acc;
  }, {});
}

function drawCharts(rows) {
  const districtData = sumBy(rows, "distrito");
  const categoryData = sumBy(rows, "categoria");

  districtChart?.destroy();
  categoryChart?.destroy();

  districtChart = new Chart(document.getElementById("districtChart"), {
    type: "bar",
    data: {
      labels: Object.keys(districtData),
      datasets: [{ label: "Monto por distrito", data: Object.values(districtData) }]
    },
    options: { responsive: true }
  });

  categoryChart = new Chart(document.getElementById("categoryChart"), {
    type: "pie",
    data: {
      labels: Object.keys(categoryData),
      datasets: [{ label: "Monto por categoría", data: Object.values(categoryData) }]
    },
    options: { responsive: true }
  });
}

function render() {
  const rows = filteredRows();
  renderTable(rows);

  totalRecords.textContent = rows.length.toLocaleString("es-PY");
  totalAmount.textContent = moneyFormat.format(rows.reduce((sum, row) => sum + row.monto, 0));
  totalBeneficiaries.textContent = rows.reduce((sum, row) => sum + row.beneficiarios, 0).toLocaleString("es-PY");

  drawCharts(rows);
}

excelFile.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(firstSheet);
  loadRows(rows);
});

[districtFilter, categoryFilter, searchFilter].forEach((el) => el.addEventListener("input", render));

useDemoButton.addEventListener("click", () => loadRows(demoData));

document.getElementById("recordForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const newRow = {
    fecha: document.getElementById("fDate").value,
    distrito: document.getElementById("fDistrict").value,
    categoria: document.getElementById("fCategory").value,
    descripcion: document.getElementById("fDescription").value,
    monto: Number(document.getElementById("fAmount").value),
    beneficiarios: Number(document.getElementById("fBeneficiaries").value)
  };

  allRows.push(newRow);
  localStorage.setItem("caazapa_rows", JSON.stringify(allRows));
  refreshOptions();
  render();
  e.target.reset();
});

downloadReport.addEventListener("click", () => {
  const rows = filteredRows();
  const header = "Fecha,Distrito,Categoria,Descripcion,Monto,Beneficiarios";
  const data = rows.map((r) => [r.fecha, r.distrito, r.categoria, r.descripcion, r.monto, r.beneficiarios].join(","));
  const blob = new Blob([[header, ...data].join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "informe-caazapa.csv";
  link.click();
  URL.revokeObjectURL(link.href);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}

const storedRows = localStorage.getItem("caazapa_rows");
if (storedRows) {
  loadRows(JSON.parse(storedRows));
} else {
  loadRows(demoData);
}
