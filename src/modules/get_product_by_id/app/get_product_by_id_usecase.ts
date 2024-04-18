/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../../shared/domain/entities/product'
import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { InvalidRequest } from '../../../shared/helpers/errors/ModuleError'
import { MissingParameters } from '../../../shared/helpers/errors/controller_errors'

export class GetProductByIdUsecase {
  constructor(private productRepository: IProductRepository) {}

  async execute(body: { [key: string]: any }): Promise<Product> {
    if (!body) {
      throw new InvalidRequest('Body')
    }
    if (!body.products.id) {
      throw new MissingParameters('id')
    }
    const product = await this.productRepository.getProductById(
      body.products.id,
    )
    return product
  }
}
