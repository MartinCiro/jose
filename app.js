// app.js
import IndexedDBManager from './IndexedDBManager.js';

const dbManager = new IndexedDBManager("MiBaseDeDatos", "personas", ["firstName", "lastName", "city"]);

// Manejador de eventos para el formulario
document.getElementById("dataForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = document.getElementById("id").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const city = document.getElementById("city").value;

  const data = { id: id ? Number(id) : undefined, firstName, lastName, city };

  if (id) {
    dbManager.actualizar(data);
  } else {
    dbManager.insertar(data);
  }

  limpiarFormulario();
});

// Función para editar un dato
window.editarDato = function(id) {
  const transaction = dbManager.db.transaction([dbManager.storeName], "readonly");
  const objectStore = transaction.objectStore(dbManager.storeName);
  const request = objectStore.get(id);

  request.onsuccess = () => {
    const data = request.result;
    document.getElementById("id").value = data.id;
    document.getElementById("firstName").value = data.firstName;
    document.getElementById("lastName").value = data.lastName;
    document.getElementById("city").value = data.city;
  };
};

// Función para eliminar un dato
window.eliminarDato = function(id) {
  dbManager.eliminar(id);
};

// Limpiar el formulario
function limpiarFormulario() {
  document.getElementById("id").value = '';
  document.getElementById("firstName").value = '';
  document.getElementById("lastName").value = '';
  document.getElementById("city").value = '';
}

// Código para el Service Worker (opcional)
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
