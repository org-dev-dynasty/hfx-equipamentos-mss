import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { InvalidRequest } from '../../../shared/helpers/errors/ModuleError'

export class DeleteProductUsecase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new InvalidRequest('id')
    }
    await this.productRepository.deleteProduct(id)
  }
}
