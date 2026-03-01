const excelInput = document.getElementById('excelInput');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const districtFilter = document.getElementById('districtFilter');
const typeFilter = document.getElementById('typeFilter');
const searchFilter = document.getElementById('searchFilter');
const tableBody = document.getElementById('tableBody');
const addForm = document.getElementById('addForm');
const downloadBtn = document.getElementById('downloadBtn');

const totalMontoEl = document.getElementById('totalMonto');
const totalRegistrosEl = document.getElementById('totalRegistros');
const totalBeneficiariosEl = document.getElementById('totalBeneficiarios');
const promedioMontoEl = document.getElementById('promedioMonto');

let allData = [];
let typeChart;
let districtChart;

const sampleData = [
  { Distrito: 'Abai', Tipo: 'Obra vial', Descripcion: 'Reparación de camino vecinal', Monto: 180000000, Fecha: '2026-01-12', Beneficiarios: 1500 },
  { Distrito: 'Caazapá', Tipo: 'Salud', Descripcion: 'Entrega de ambulancia', Monto: 320000000, Fecha: '2026-02-03', Beneficiarios: 4200 },
  { Distrito: 'San Juan Nepomuceno', Tipo: 'Educación', Descripcion: 'Refacción de aulas', Monto: 210000000, Fecha: '2026-02-28', Beneficiarios: 980 },
  { Distrito: 'Abai', Tipo: 'Producción', Descripcion: 'Kits agrícolas para productores', Monto: 95000000, Fecha: '2026-03-10', Beneficiarios: 600 },
  { Distrito: 'Yuty', Tipo: 'Social', Descripcion: 'Transferencia de apoyo social', Monto: 140000000, Fecha: '2026-03-15', Beneficiarios: 2100 }
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    maximumFractionDigits: 0
  }).format(value || 0);

const normalizeRow = (row) => ({
  Distrito: String(row.Distrito || '').trim(),
  Tipo: String(row.Tipo || '').trim(),
  Descripcion: String(row.Descripcion || '').trim(),
  Monto: Number(row.Monto) || 0,
  Fecha: String(row.Fecha || '').slice(0, 10),
  Beneficiarios: Number(row.Beneficiarios) || 0
});

function refreshFilters(data) {
  const districts = [...new Set(data.map((d) => d.Distrito).filter(Boolean))].sort();
  const types = [...new Set(data.map((d) => d.Tipo).filter(Boolean))].sort();

  districtFilter.innerHTML = '<option value="">Todos</option>';
  typeFilter.innerHTML = '<option value="">Todos</option>';

  districts.forEach((district) => {
    districtFilter.innerHTML += `<option value="${district}">${district}</option>`;
  });

  types.forEach((type) => {
    typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
  });
}

function getFilteredData() {
  const districtValue = districtFilter.value;
  const typeValue = typeFilter.value;
  const searchValue = searchFilter.value.toLowerCase().trim();

  return allData.filter((item) => {
    const matchesDistrict = !districtValue || item.Distrito === districtValue;
    const matchesType = !typeValue || item.Tipo === typeValue;
    const matchesSearch =
      !searchValue ||
      item.Descripcion.toLowerCase().includes(searchValue) ||
      item.Distrito.toLowerCase().includes(searchValue) ||
      item.Tipo.toLowerCase().includes(searchValue);

    return matchesDistrict && matchesType && matchesSearch;
  });
}

function renderTable(data) {
  tableBody.innerHTML = '';

  data.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.Distrito}</td>
      <td>${row.Tipo}</td>
      <td>${row.Descripcion}</td>
      <td>${formatCurrency(row.Monto)}</td>
      <td>${row.Fecha}</td>
      <td>${row.Beneficiarios.toLocaleString('es-PY')}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderCards(data) {
  const totalMonto = data.reduce((sum, row) => sum + row.Monto, 0);
  const totalBeneficiarios = data.reduce((sum, row) => sum + row.Beneficiarios, 0);
  const promedioMonto = data.length ? totalMonto / data.length : 0;

  totalMontoEl.textContent = formatCurrency(totalMonto);
  totalRegistrosEl.textContent = data.length.toLocaleString('es-PY');
  totalBeneficiariosEl.textContent = totalBeneficiarios.toLocaleString('es-PY');
  promedioMontoEl.textContent = formatCurrency(promedioMonto);
}

function groupBy(data, field, valueField = null) {
  return data.reduce((acc, item) => {
    const key = item[field] || 'Sin dato';
    if (!acc[key]) acc[key] = 0;
    acc[key] += valueField ? item[valueField] : 1;
    return acc;
  }, {});
}

function renderCharts(data) {
  const byType = groupBy(data, 'Tipo', 'Monto');
  const byDistrict = groupBy(data, 'Distrito');

  const typeCtx = document.getElementById('typeChart');
  const districtCtx = document.getElementById('districtChart');

  if (typeChart) typeChart.destroy();
  if (districtChart) districtChart.destroy();

  typeChart = new Chart(typeCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(byType),
      datasets: [{
        label: 'Monto total (₲)',
        data: Object.values(byType),
        backgroundColor: '#0f5f8d'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

  districtChart = new Chart(districtCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(byDistrict),
      datasets: [{
        data: Object.values(byDistrict),
        backgroundColor: ['#179ea3', '#0f5f8d', '#de4021', '#f0b90d', '#4350c9', '#2d2d33']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

function updateView() {
  const filtered = getFilteredData();
  renderTable(filtered);
  renderCards(filtered);
  renderCharts(filtered);
}

function setData(rows) {
  allData = rows.map(normalizeRow).filter((item) => item.Distrito || item.Tipo || item.Descripcion);
  refreshFilters(allData);
  updateView();
}

excelInput.addEventListener('change', async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  setData(rawRows);
});

loadSampleBtn.addEventListener('click', () => setData(sampleData));

[districtFilter, typeFilter, searchFilter].forEach((el) => {
  el.addEventListener('input', updateView);
});

addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(addForm);
  const row = Object.fromEntries(formData.entries());
  allData.push(normalizeRow(row));
  refreshFilters(allData);
  updateView();
  addForm.reset();
});

downloadBtn.addEventListener('click', () => {
  const filtered = getFilteredData();
  const worksheet = XLSX.utils.json_to_sheet(filtered);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Informe');
  XLSX.writeFile(workbook, 'informe_caazapa.xlsx');
});

setData(sampleData);
