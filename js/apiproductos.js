var urlAPI = "https://dummyjson.com/products";
var listaProductos = [];

function extraerProductos() {
    let endPoint = urlAPI;

    fetch(endPoint)
        .then(respuesta => respuesta.json())
        .then(respuestaJSON => {
            listaProductos = respuestaJSON.products;
            mostrarProductos(listaProductos);
        })
        .catch(error => {
            document.getElementById("mensaje").textContent =
                "No se pudieron cargar los productos. Revisa tu conexión a internet.";
            console.log("Error al consultar la API:", error);
        });
}

function mostrarProductos(productos) {
    let divPadre = document.getElementById("gridContainer");
    divPadre.innerHTML = "";

    if (productos.length === 0) {
        document.getElementById("mensaje").textContent = "No se encontraron productos.";
        return;
    }

    document.getElementById("mensaje").textContent = "";

    productos.forEach(producto => {
        let divProducto = crearDivProducto(producto);
        adicionarElementoAContenedor(divProducto, divPadre);
    });
}

function crearDivProducto(producto) {
    let div = crearElemento("div");
    div.classList.add("colorDivHijo");

    let imagenProducto = crearImagen(producto.thumbnail, producto.title);
    imagenProducto.classList.add("tamanoImagen", "fondoImagen");
    imagenProducto.addEventListener("click", function () {
        window.location.href = "producto.html?id=" + producto.id;
    });
    adicionarElementoAContenedor(imagenProducto, div);

    let pCategoria = crearNodoConTexto("p", producto.category);
    pCategoria.classList.add("categoria");
    adicionarElementoAContenedor(pCategoria, div);

    let pNombre = crearNodoConTexto("p", producto.title);
    pNombre.classList.add("colorLetraTitulo");
    adicionarElementoAContenedor(pNombre, div);

    let divDatos = crearElemento("div");
    divDatos.classList.add("datosProducto");

    let pPrecio = crearNodoConTexto("p", "$" + Number(producto.price).toFixed(2));
    pPrecio.classList.add("precio");
    adicionarElementoAContenedor(pPrecio, divDatos);

    let pCalificacion = crearNodoConTexto("p", "★ " + Number(producto.rating).toFixed(2));
    pCalificacion.classList.add("calificacion");
    adicionarElementoAContenedor(pCalificacion, divDatos);
    adicionarElementoAContenedor(divDatos, div);

    let pStock = crearNodoConTexto("p", "Stock: " + producto.stock);
    pStock.classList.add("stock");
    adicionarElementoAContenedor(pStock, div);

    let boton = crearNodoConTexto("a", "Ver producto");
    boton.classList.add("boton");
    boton.href = "producto.html?id=" + producto.id;
    adicionarElementoAContenedor(boton, div);

    return div;
}

function extraerDatosProducto(idProducto) {
    if (!idProducto) {
        document.getElementById("mensaje").textContent =
            "No se recibió el identificador del producto. Regresa al catálogo y selecciona uno.";
        return;
    }

    let endPoint = urlAPI + "/" + idProducto;

    fetch(endPoint)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error("No se encontró el producto.");
            }
            return respuesta.json();
        })
        .then(respuestaJSON => {
            mostrarDatosProducto(respuestaJSON);
        })
        .catch(error => {
            document.getElementById("mensaje").textContent =
                "No se pudo cargar el detalle del producto.";
            console.log("Error al consultar el producto:", error);
        });
}

function mostrarDatosProducto(producto) {
    let contenedor = document.getElementById("detalleProducto");
    contenedor.innerHTML = "";

    let divImagen = crearElemento("div");
    divImagen.classList.add("detalleImagen");

    let imagen = crearImagen(
        (producto.images && producto.images.length > 0) ? producto.images[0] : producto.thumbnail,
        producto.title
    );
    adicionarElementoAContenedor(imagen, divImagen);

    let divInformacion = crearElemento("div");
    divInformacion.classList.add("detalleInformacion");

    let pCategoria = crearNodoConTexto("p", producto.category);
    pCategoria.classList.add("categoria");
    adicionarElementoAContenedor(pCategoria, divInformacion);

    let h2 = crearNodoConTexto("h2", producto.title);
    adicionarElementoAContenedor(h2, divInformacion);

    let pPrecio = crearNodoConTexto("p", "$" + Number(producto.price).toFixed(2));
    pPrecio.classList.add("precioDetalle");
    adicionarElementoAContenedor(pPrecio, divInformacion);

    let pDescripcion = crearNodoConTexto("p", producto.description);
    pDescripcion.classList.add("descripcion");
    adicionarElementoAContenedor(pDescripcion, divInformacion);

    let divDatos = crearElemento("div");
    divDatos.classList.add("datosDetalle");

    adicionarElementoAContenedor(crearDato("Calificación", "★ " + Number(producto.rating).toFixed(2)), divDatos);
    adicionarElementoAContenedor(crearDato("Stock", producto.stock), divDatos);
    adicionarElementoAContenedor(crearDato("Marca", producto.brand || "No especificada"), divDatos);
    adicionarElementoAContenedor(crearDato("Descuento", Number(producto.discountPercentage).toFixed(2) + "%"), divDatos);

    adicionarElementoAContenedor(divDatos, divInformacion);
    adicionarElementoAContenedor(divImagen, contenedor);
    adicionarElementoAContenedor(divInformacion, contenedor);
}

function crearDato(titulo, valor) {
    let div = crearElemento("div");
    div.classList.add("dato");

    let pTitulo = crearNodoConTexto("p", titulo);
    pTitulo.classList.add("etiquetaDato");

    let pValor = crearNodoConTexto("p", String(valor));

    adicionarElementoAContenedor(pTitulo, div);
    adicionarElementoAContenedor(pValor, div);
    return div;
}

function filtrarProductos(texto) {
    let busqueda = texto.toLowerCase();
    let productosFiltrados = listaProductos.filter(producto =>
        (producto.title + " " + producto.category + " " + (producto.brand || ""))
            .toLowerCase().includes(busqueda)
    );
    mostrarProductos(productosFiltrados);
}
