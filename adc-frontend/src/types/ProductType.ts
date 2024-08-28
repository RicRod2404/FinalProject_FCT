import {Category} from "./CategoryType.tsx";

export interface Product {
    name: string;
    internalCode: string;
    description: string;
    category: Category[];
    photo: string;
    price: number;
}