import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'

export class DeleteModelOfProductUsecase {
  constructor(private repo: IProductRepository) {}

  async execute(productId: string, modelId: string) {
    const product = await this.repo.getProductById(productId)

    if (!product) {
      throw new EntityError('Product not found')
    }

    const updatedModels =
      product.models && product.models.length > 0
        ? product.models.filter((model) => model.split('#')[0] !== modelId)
        : []

    const updatedAttributes = product.attributes
      ? product.attributes.filter((attribute) => {
        const attributeModelId = attribute.modelId.split('#')[0]
        return attributeModelId !== modelId
      })
      : []

    const updatedProduct = await this.repo.updateProduct(
      productId,
      undefined,
      undefined,
      undefined,
      updatedModels,
      undefined,
      updatedAttributes,
      undefined,
    )

    return updatedProduct
  }
}