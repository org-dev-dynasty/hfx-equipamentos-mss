import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { Product } from '../../../shared/domain/entities/product'

export class GetAllProductsUsecase {
  constructor(private repo: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.repo.getAllProducts()
  }
}
