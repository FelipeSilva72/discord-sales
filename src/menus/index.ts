import { editProductMenu, editProductStockMenu } from "./product/edit.js";

export const menus = {
    products: {
        edit: editProductMenu,
        editStock: editProductStockMenu
    }  
};