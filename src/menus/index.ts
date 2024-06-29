import { editProductMenu, editProductStockMenu } from "./product/edit.js";
import { testingSalePrivateProduct, testingSalePublicProduct } from "./testing/product.js";

export const menus = {
    products: {
        edit: editProductMenu,
        editStock: editProductStockMenu
    },
    testing: {
        public: testingSalePublicProduct,
        private: testingSalePrivateProduct
    }
};