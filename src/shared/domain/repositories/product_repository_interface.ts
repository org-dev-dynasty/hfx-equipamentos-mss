/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../entities/product'

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>
  getProductById(id: string): Promise<Product>
  createProduct(product: Product): Promise<Product>
  updateProduct(
    id: string,
    name?: string,
    description?: string,
    models?: string[],
    categories?: string[],
    attributes?: Record<string, any>[],
    videos?: string[],
  ): Promise<Product>
  deleteProduct(id: string): Promise<Product>
}