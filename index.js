const fs = require ("fs");
const { json } = require("stream/consumers");

class ProductManager {
    constructor(){
        this.path = "./productos.txt"
        this.products = [];
    }
    readProduct = async () => {
        let respuesta = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(respuesta) 
    }

    getProduct = async () => {
        let productosEnCarro = await this.readProduct()
        console.log(productosEnCarro)
    }

    addProduct = async (title, description, price, thumbnail, code, stock) =>{

        const codigoExiste = this.products.some((producto) => producto.code === code)
            if(codigoExiste){
                console.log(`El codigo ${code} esta repetido, por lo que no se añadió el producto ${title}`)
            } else {
                const productoId = this.products.length + 1
                const producto = {
                    title, 
                    description, 
                    price, 
                    thumbnail, 
                    code, 
                    stock, 
                    id: productoId
                }
                
                const valoresProducto = Object.values(producto);
                const valoresVacios = valoresProducto.includes(undefined)
                    if (valoresVacios){
                        console.log(`El producto ${producto.title} no se añadio porque al menos uno de sus campos esta vacio`)
                    }else{
                        this.products.push(producto)
                        await fs.promises.writeFile(this.path, JSON.stringify(this.products))
                        console.log(`El producto ${producto.title} ha sido añadido correctamente`)
                    }
            }
    }
    
    

    getProductById = async (id) => {
        let productosEnCarro = await this.readProduct()
        const productoExiste = productosEnCarro.find((producto) => producto.id === id)
        !productoExiste ?   console.log("Not Found")    :   console.log(productoExiste)
    }

    deleteProductById = async (id) => {
        let productosEnCarro = await this.readProduct()
        const carroSinProducto = productosEnCarro.filter((producto) => producto.id != id)
        await fs.promises.writeFile(this.path, JSON.stringify(carroSinProducto))
        console.log("Producto Eliminado")
    }
    updateProduct = async ({id, ...producto}) => {
        await this.deleteProductById(id)
        let productoOld = await this.readProduct()
        let modificado = [{...producto, id}, ...productoOld]
        await fs.promises.writeFile(this.path, JSON.stringify(modificado))
    }
}


//TESTING

const productos = new ProductManager


// productos.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

// productos.addProduct("producto prueba2", "Este es un producto prueba2", 200, "Sin imagen", "abc124", 25);

// productos.addProduct("producto prueba3", "Este es un producto prueba2", 200, "Sin imagen", "abc125", 25);


// productos.updateProduct({"title":"producto prueba8","description":"Este es un producto prueba8","price":800,"thumbnail":"Sin imagen","code":"abc128","stock":25,"id":2})

productos.getProduct()
