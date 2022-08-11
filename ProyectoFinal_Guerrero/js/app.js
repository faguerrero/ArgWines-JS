import { getData } from "./getData.js";

// DOM

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

const tiposDeVino = document.getElementById('selecTipo');
const buscador = document.getElementById('search');

const finalizarCompra = document.getElementById('finalizar');
const cantidad = document.getElementById('qty');


//Forma dinámica de mostrar productos de un array en la pagina

export async function mostrarProductos() {
    const stockProductos = await getData();
    contenedorProductos.innerHTML = ""
    stockProductos.forEach(elemento => {
        let div = document.createElement('div')
        div.className = 'producto'
        div.innerHTML = `<div class="card">
                            <div class="card-image"> 
                                <img src="${elemento.img}" class="imagenes">
                                <span class="card-title">${elemento.nombre}</span>
                            </div>
                            <div class="card-content">
                            <ul class="descripcionyPrecioCard">
                                <li>${elemento.descripcion}</li>
                                <li> $${elemento.precio}</li>
                                <li><a id="boton${elemento.id}" class="btn-floating halfway-fab waves-effect"><i class="material-icons">add_shopping_cart</i></a></li>
                            </ul>
                            </div>
                        </div>`
        
        contenedorProductos.appendChild(div)
        let btnAgregar = document.getElementById(`boton${elemento.id}`)
        btnAgregar.addEventListener('click', () => {
            Toastify({
                text: "Producto agregado al carrito",
                className: "info",
                duration: 3000,
                gravity: "bottom",
                position: "left",
                style: {
                        background: "#917591"
                }
            }).showToast();
            agregarAlCarrito(elemento.id)
        })
    })     

    let carritoDeCompras = []

    function agregarAlCarrito(id) {
        let productoAgregar = stockProductos.find(item => item.id === id)
        let productoDuplicado = carritoDeCompras.find(item => item.id === id)
        if(productoDuplicado == undefined){
            console.log("hola")
            carritoDeCompras.push(productoAgregar)
            actualizarCarrito()
            productoAgregar.cantidad ++
            mostrarCarrito(productoAgregar)
            console.log(cantidad)
        } else if(productoDuplicado.id == productoAgregar.id){
            carritoDeCompras.push(productoAgregar)
            actualizarCarrito()
            productoAgregar.cantidad ++
        }

        localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
    }
    
    function mostrarCarrito(productoAgregar) {

        let div = document.createElement('div')
        div.className = 'productoEnCarrito'
        div.innerHTML= `<p>${productoAgregar.nombre}</p>
                        <p id="qty">Cantidad: ${productoAgregar.cantidad}</p>
                        <p>Precio unitario: $${productoAgregar.precio}</p>
                        <button id=eliminar${productoAgregar.id} class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`
        contenedorCarrito.appendChild(div)
    
        let btnEliminar = document.getElementById(`eliminar${productoAgregar.id}`)
        btnEliminar.addEventListener('click',() => {
            btnEliminar.parentElement.remove()
            carritoDeCompras = carritoDeCompras.filter(elemento => elemento.id !== productoAgregar.id)
            actualizarCarrito()
            Toastify({
                text: "Producto eliminado del carrito",
                className: "info",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                        background: "#917591"
                }
            }).showToast();
    
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        })
    
    }
    
    
    function  actualizarCarrito (){
       contadorCarrito.innerText = " "+carritoDeCompras.length
       precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + el.precio, 0)
                                                                   
    }
    
    // FUNCION PARA RECUPERAR DATOS EN CASO DE CIERRE INESPERADO
    
    function recuperar() {
    
        let recuperarLS = JSON.parse(localStorage.getItem('carrito'))
        if(recuperarLS){
           for (const elemento of recuperarLS) {
            mostrarCarrito(elemento)
            carritoDeCompras.push(elemento)
            actualizarCarrito()
        } 
        }
        
    
    }
    
    recuperar()

// FUNCIÓN PARA VACIAR LA TOTALIDAD DEL CARRITO

finalizarCompra.addEventListener('click', () =>{
    localStorage.removeItem('carrito');
    console.log(finalizarCompra)
    actualizarCarrito();
    window.location.href = 'https://www.mercadopago.com.ar/';
})

}

//FILTRO 

async function filtrarProductos (){
    const stockFiltro = await getData();
    tiposDeVino.addEventListener('change', () => {
        console.log(tiposDeVino.value);
        tiposDeVino.value === 'all' ? mostrarProductos(stockFiltro) : mostrarProductos(stockFiltro.filter(elemento => elemento.descripcion == tiposDeVino.value));
    })
}

filtrarProductos();

//BUSCADOR
    
async function buscarProductos (){
    const stockBuscador = await getData();
    buscador.addEventListener('input',(evento) => {
        console.log(evento.target.value);
        let buscaResultados = stockBuscador.filter(elemento => elemento.nombre.toLowerCase().includes(evento.target.value.toLowerCase()))
        mostrarProductos(buscaResultados)
    })
}

buscarProductos();
