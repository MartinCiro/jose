// IndexedDBManager.js
class IndexedDBManager {
    constructor(dbName, storeName, fields) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.fields = fields; // Un array de campos
        this.db = null;
        this.init();
    }

    init() {
        const request = indexedDB.open(this.dbName, 1);

        request.onerror = (event) => {
            console.error("Error al abrir la base de datos", event);
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            this.mostrarDatos();
        };

        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            const objectStore = this.db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
            this.fields.forEach(field => {
                objectStore.createIndex(field, field, { unique: false });
            });
        };
    }

    async insertar(data) {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const objectStore = transaction.objectStore(this.storeName);
        const request = objectStore.add(data);

        request.onsuccess = () => {
            console.log("Datos guardados");
            this.mostrarDatos();
        };
    }

    async actualizar(data) {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const objectStore = transaction.objectStore(this.storeName);
        const request = objectStore.put(data);

        request.onsuccess = () => {
            console.log("Datos actualizados");
            this.mostrarDatos();
        };
    }

    async eliminar(id) {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const objectStore = transaction.objectStore(this.storeName);
        const request = objectStore.delete(id);

        request.onsuccess = () => {
            console.log("Datos eliminados");
            this.mostrarDatos();
        };
    }

    mostrarDatos() {
        const dataList = document.getElementById("dataList");
        dataList.innerHTML = ''; // Limpiar la tabla
        const transaction = this.db.transaction([this.storeName], "readonly");
        const objectStore = transaction.objectStore(this.storeName);

        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const row = document.createElement("tr");
                row.innerHTML = `
            <td>${cursor.value.id}</td>
            <td>${cursor.value.firstName}</td>
            <td>${cursor.value.lastName}</td>
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
}

export default IndexedDBManager;  