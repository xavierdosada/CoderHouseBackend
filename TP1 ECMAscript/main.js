class ProductManager {
    constructor(products = []) {
        this.products = products;
            //instancio el id en cero para luego incrementarlo por cada producto creado.
        this.id = 0;
    }
    addProduct(title, description, price, thumbail, code, stock){
        //valido que no se repita el campo code y que todos los campos sean obligatorios
        if (title && description && price && thumbail && code && stock){
            const existCode = this.products.some(product => product.code === code) // valido que el producto no exista
            if (existCode){
                throw new Error("Code ya existe");
            } else {
                //agrego al array vacio el nuevo producto con sus propiedades y id autogenerado.
                this.products.push({ id: ++this.id, title, description, price, thumbail, code, stock});
            }
        } else {
            throw new Error("Faltan campos");
        }  
    }

    getProducts(){
        console.log(this.products)
    }

    getProductById(id){
        const existID = this.products.find(product => product.id === id);
        if (existID){
            console.log("El producto con el id es: ", existID);
        } else {
            throw new Error("Not Found")
        }
    }
} 
