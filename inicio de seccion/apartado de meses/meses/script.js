// Fechas por semana
const semanas = [
  { nombre: "Semana 1 (1 al 7)", dias: ["1/6", "2/6", "3/6", "4/6", "5/6", "6/6", "7/6"] },
  { nombre: "Semana 2 (8 al 14)", dias: ["8/6", "9/6", "10/6", "11/6", "12/6", "13/6", "14/6"] },
  { nombre: "Semana 3 (15 al 21)", dias: ["15/6", "16/6", "17/6", "18/6", "19/6", "20/6", "21/6"] },
  { nombre: "Semana 4 (22 al 30)", dias: ["22/6", "23/6", "24/6", "25/6", "26/6", "27/6", "28/6", "29/6", "30/6"] },
];

const horas = ["16hs","17hs","18hs","19hs","20hs","21hs","22hs","23hs"];

const contenedor = document.getElementById("contenedor-tablas");
const btnLimpiar = document.getElementById("limpiar");
const precioInput = document.getElementById("precio");
const totalGeneralEl = document.getElementById("total-general");
const dineroGeneralEl = document.getElementById("dinero-general");

// Crear tablas
semanas.forEach((semana, i) => {
  const div = document.createElement("div");
  div.className = "table-container";
  div.id = `semana-${i+1}`;

  const titulo = document.createElement("h2");
  titulo.textContent = semana.nombre;
  div.appendChild(titulo);

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  trHead.innerHTML = `
    <th>Fecha</th>
    ${horas.map(h => `<th>${h}</th>`).join("")}
    <th>Total Día</th>
    <th>Dinero Día</th>
  `;
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  semana.dias.forEach(dia => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${dia}</td>
      ${horas.map((_, hIndex) => `<td><input type="checkbox" id="chk-${i}-${dia}-${hIndex}"></td>`).join("")}
      <td class="total">0</td>
      <td class="dinero">$0</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const resumen = document.createElement("div");
  resumen.className = "resumen-semana";
  resumen.innerHTML = `
    Total ${semana.nombre}: <span id="total-semana-${i+1}">0</span> turnos |
    Dinero: <span id="dinero-semana-${i+1}">$0</span>
  `;

  div.appendChild(table);
  div.appendChild(resumen);
  contenedor.appendChild(div);
});

// Actualizar totales
function actualizarTotales() {
  const precio = parseFloat(precioInput.value) || 0;
  let totalGeneral = 0;
  let dineroGeneral = 0;

  semanas.forEach((_, i) => {
    const semanaDiv = document.getElementById(`semana-${i+1}`);
    const filas = semanaDiv.querySelectorAll("tbody tr");
    let totalSemana = 0;
    let dineroSemana = 0;

    filas.forEach(fila => {
      const checks = fila.querySelectorAll("input[type='checkbox']");
      const marcados = [...checks].filter(chk => chk.checked).length;
      const dineroDia = marcados * precio;

      fila.querySelector(".total").textContent = marcados;
      fila.querySelector(".dinero").textContent = `$${dineroDia}`;
      totalSemana += marcados;
      dineroSemana += dineroDia;
    });

    document.getElementById(`total-semana-${i+1}`).textContent = totalSemana;
    document.getElementById(`dinero-semana-${i+1}`).textContent = `$${dineroSemana}`;
    totalGeneral += totalSemana;
    dineroGeneral += dineroSemana;
  });

  totalGeneralEl.textContent = totalGeneral;
  dineroGeneralEl.textContent = `$${dineroGeneral}`;
  guardarDatos();
}

// Guardar en localStorage
function guardarDatos() {
  const datos = {};
  document.querySelectorAll("input[type='checkbox']").forEach(chk => {
    datos[chk.id] = chk.checked;
  });
  datos.precio = precioInput.value;
  localStorage.setItem("turnosGuardados", JSON.stringify(datos));
}

// Cargar datos
function cargarDatos() {
  const guardados = JSON.parse(localStorage.getItem("turnosGuardados") || "{}");
  Object.keys(guardados).forEach(id => {
    if (id.startsWith("chk-")) {
      const chk = document.getElementById(id);
      if (chk) chk.checked = guardados[id];
    }
  });
  if (guardados.precio) precioInput.value = guardados.precio;
  actualizarTotales();
}

// Limpiar todo
btnLimpiar.addEventListener("click", () => {
  if (confirm("¿Seguro que querés borrar todos los turnos y reiniciar el precio?")) {
    localStorage.removeItem("turnosGuardados");
    document.querySelectorAll("input[type='checkbox']").forEach(chk => chk.checked = false);
    precioInput.value = 100;
    actualizarTotales();
  }
});

// Detectar cambios
document.addEventListener("change", e => {
  if (e.target.matches("input[type='checkbox']") || e.target.id === "precio") {
    actualizarTotales();
  }
});

// Cargar al iniciar
cargarDatos();
