import { Product } from '../entities/product'

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>
  getProductById(id: string): Promise<Product>
  createProduct(product: Product): Promise<Product>
  updateProduct(product: Product): Promise<Product>
  deleteProduct(id: string): Promise<Product>
}