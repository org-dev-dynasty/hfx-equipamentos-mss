import { Product } from '../../../shared/domain/entities/product'
import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'

export class UploadProductImageUsecase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(productId: string, images: Buffer[], fieldNames: string[], isModel: boolean) {
    if (!Product.validateId(productId)) {
      throw new EntityError('id')
    }
    if (typeof isModel !== 'boolean') {
      throw new EntityError('isModel')
    }
    console.log('[chegou no usecase do upload]')
    console.log('[Upload usecase] - productId ', productId)
    console.log('[Upload usecase] - images ', images)
    const imagesUrls = await this.repo.uploadProductImage(productId, images, fieldNames, isModel)
    console.log('[Upload usecase] - imagesUrls ', imagesUrls)
    return imagesUrls
  }
}