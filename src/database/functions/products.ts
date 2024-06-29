import { DatabaseSchema, db } from "#database";

type SetData = DatabaseSchema["products"]["AssignArg"];
type UpdateData = DatabaseSchema["products"]["UpdateData"];

export async function getProductData(productId: string) {
    const productDocument = await db.products.get(db.products.id(productId));
    return { data: productDocument?.data };
}

export async function setProductData(productId: string, data: SetData) {
    return await db.products.set(db.products.id(productId), data);
}

export async function updateProductData(productId: string, data: UpdateData) {
    return await db.products.update(db.products.id(productId), data);
}

export function formatProductData(data: ProductSchema) {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: formatProductPrice(data.price),
        stock: data.stock.length === 0 ? "Vazio" : data.stock.length < 2 ? data.stock.length + " Item" : data.stock.length + " Itens"
    };
}

export function formatProductPrice(price: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(price);
}