// Inicializar IndexedDB
let db;
const request = indexedDB.open("MiBaseDeDatos", 1);

request.onerror = (event) => {
  console.log("Error al abrir la base de datos", event);
};

request.onsuccess = (event) => {
  db = event.target.result;
  mostrarDatos();
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore("personas", { keyPath: "id", autoIncrement: true });
  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("surnames", "surnames", { unique: false });
  objectStore.createIndex("city", "city", { unique: false });
};

// Función para insertar o actualizar un dato
document.getElementById("dataForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const surnames = document.getElementById("surnames").value;
  const city = document.getElementById("city").value;

  const transaction = db.transaction(["personas"], "readwrite");
  const objectStore = transaction.objectStore("personas");

  if (id) {
    // Actualizar
    const request = objectStore.put({ id: Number(id), name, surnames, city });
    request.onsuccess = () => {
      console.log("Datos actualizados");
      limpiarFormulario();
      mostrarDatos();
    };
  } else {
    // Insertar
    const request = objectStore.add({ name, surnames, city });
    request.onsuccess = () => {
      console.log("Datos guardados");
      limpiarFormulario();
      mostrarDatos();
    };
  }
});

// Mostrar los datos en la tabla
function mostrarDatos() {
  const dataList = document.getElementById("dataList");
  dataList.innerHTML = ''; // Limpiar la tabla
  const transaction = db.transaction(["personas"], "readonly");
  const objectStore = transaction.objectStore("personas");

  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cursor.value.id}</td>
        <td>${cursor.value.name}</td>
        <td>${cursor.value.surnames}</td>
        <td>${cursor.value.city}</td>
        <td>
          <button onclick="editarDato(${cursor.value.id})">Editar</button>
          <button onclick="eliminarDato(${cursor.value.id})">Eliminar</button>
        </td>
      `;
      dataList.appendChild(row);
      cursor.continue();
    }
  };
}

// Función para editar un dato
function editarDato(id) {
  const transaction = db.transaction(["personas"], "readonly");
  const objectStore = transaction.objectStore("personas");
  const request = objectStore.get(id);

  request.onsuccess = () => {
    const data = request.result;
    document.getElementById("id").value = data.id;
    document.getElementById("name").value = data.name;
    document.getElementById("surnames").value = data.surnames;
    document.getElementById("city").value = data.city;
  };
}

// Función para eliminar un dato
function eliminarDato(id) {
  const transaction = db.transaction(["personas"], "readwrite");
  const objectStore = transaction.objectStore("personas");
  const request = objectStore.delete(id);

  request.onsuccess = () => {
    console.log("Datos eliminados");
    mostrarDatos();
  };
}

// Limpiar el formulario
function limpiarFormulario() {
  document.getElementById("id").value = '';
  document.getElementById("name").value = '';
  document.getElementById("surnames").value = '';
  document.getElementById("city").value = '';
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration);
        })
        .catch((error) => {
          console.log('Error al registrar el Service Worker:', error);
        });
    });
  }