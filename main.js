const app = new Vue({
  el: "#app",
  data: {
    titulo: "Client Side Rendering con Vue",
    productos: [],
    categorias: [],
    nuevoNombre: "",
    nuevaCategoria: "",
    nuevoValorCompra: null,
    nuevoValorVenta: null,
    nuevoStock: null,
    estado: true,
    api: "http://localhost:5000/v1/inventario/api/",
  },
  methods: {
    async agregarProduto() {
      const idCategoria = await this.buscarIdCategoria(this.nuevaCategoria);

      const nuevoProducto = {
        nombre: this.nuevoNombre,
        costo: this.nuevoValorCompra,
        precio: this.nuevoValorVenta,
        minimo: this.nuevoStock,
        categoria: idCategoria,
      };

      const res = await fetch(`${this.api}productos`, {
        method: "POST",
        body: JSON.stringify(nuevoProducto),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      this.nuevoNombre = "";
      this.nuevaCategoria = "";
      this.nuevoValorCompra = null;
      this.nuevoValorVenta = null;
      this.nuevoStock = null;
      console.log(`exito `);
      this.productos = [];
      this.obtenerProductos();
    },

    async eliminarProducto(id) {
      const res = await fetch(`${this.api}productos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      this.productos = [];
      this.obtenerProductos();
    },

    async obtenerCategorias() {
      const res = await fetch(`${this.api}categorias`);
      const data = await res.json();

      for (let i = 0; i < data.total; i++) {
        const element = data.categorias[i];

        this.categorias.push(element.nombre);
      }
    },

    async buscarIdCategoria(categoria) {
      const res = await fetch(`${this.api}categorias`);
      const data = await res.json();
      for (let i = 0; i < data.total; i++) {
        const element = data.categorias[i];

        if (element.nombre === categoria) {
          return element._id;
        }
      }
    },

    async obtenerProductos() {
      const res = await fetch(`${this.api}productos`);
      const data = await res.json();

      for (let i = 0; i < data.total; i++) {
        const element = data.productos[i];
        const nuevoProducto = {
          id: element._id,
          nombre: element.nombre,
          valorCompra: element.costo,
          valorVenta: element.precio,
          stock: element.minimo,
          categoria: element.categoria.nombre,
        };
        this.productos.push(nuevoProducto);
      }
    },
  },

  mounted: function () {
    this.obtenerProductos();
    this.obtenerCategorias();
  },
});
