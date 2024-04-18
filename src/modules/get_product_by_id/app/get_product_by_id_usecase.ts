/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../../shared/domain/entities/product'
import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { InvalidRequest } from '../../../shared/helpers/errors/ModuleError'

export class GetProductByIdUsecase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    if (!id) {
      throw new InvalidRequest('id')
    }
    const product = await this.productRepository.getProductById(id)
    return product
  }
}
