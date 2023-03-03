import fs from 'fs/promises'

class ProductManager {
    constructor(path) {
        //instancio el id en cero para luego incrementarlo por cada producto creado.
        this.id = 0;
        this.path = path
        this.products = [];
    }

    async loadProducts(){
        const json = await fs.readFile(this.path, 'utf-8');
        //Si el archivo esta vacio le inserto un array vacio.
        if (!json) {
            await this.saveProducts();
        } else {
            const products = JSON.parse(json);
            if (products.length > 0){
                this.products = products;
                this.id = this.products[this.products.length - 1].id; //Tomo el ultimo id utilizado en el archivo y lo guardo.
            }
        }    
    }

    //Guardo el producto en el archivo
    async saveProducts(){
        const json = JSON.stringify(this.products, null, 2)
        await fs.writeFile(this.path, json)
    }

    async addProduct(title, description, price, thumbail, code, stock){
        //Cargo los datos del archivo
        await this.loadProducts();
        //valido que no se repita el campo code y que todos los campos sean obligatorios
        if (title && description && price && thumbail && code && stock){
            const existCode = this.products.some(product => product.code === code) // valido que el producto no exista
            if (existCode){
                throw new Error("Code ya existe");
            } else {
                //agrego al array vacio el nuevo producto con sus propiedades y id autogenerado.
                this.products.push({ id: ++this.id, title, description, price, thumbail, code, stock});
                await this.saveProducts(); //espero hasta que se guarde el producto
            }
        } else {
            throw new Error("Faltan campos");
        }  
    }

    async getProducts(){
        await this.loadProducts();
        console.log(this.products)
    }

    async getProductById(id){
        await this.loadProducts();
        const indexID = this.products.find(product => product.id == id);
        if (indexID){
            console.log("El producto con el id es: ", indexID);
        } else {
            throw new Error("Not Found")
        }
    }

    async updateProduct(id, data){
        await this.loadProducts();
        const indexID = this.products.findIndex(product => product.id === id);
        if (indexID !== -1){
            this.products[indexID] = {
                ...this.products[indexID], //Mantengo las propiedades del producto anterior
                ...data //sobreescribo los datos con los nuevos datos.
            }
            await this.saveProducts();
        } else {
            throw new Error("Not Found")
        }
    }

    async deleteProduct(id){
        await this.loadProducts();
        const existID = this.products.findIndex(product => product.id === id);
        if (existID !== -1){
            this.products.splice(existID, 1)
            await this.saveProducts()
        } else {
            throw new Error("Not Found")
        }
    }
} 



//PRUEBAS
const products = new ProductManager("./products.txt");


export default ProductManager;

