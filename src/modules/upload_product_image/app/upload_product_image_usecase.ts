import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'

export class UploadProductImageUsecase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(productId: string, image: string): Promise<void> {
    console.log('[chegou no usecase do upload]')
    console.log('[Upload usecase] - productId ', productId)
    console.log('[Upload usecase] - image ', image)
    await this.repo.uploadProductImage(productId, image)
  }
}