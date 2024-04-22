import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'

export class DeleteCategoryOfProductUsecase {
  constructor(private repo: IProductRepository) {}

  async execute(productId: string, categoryId: string) {
    const product = await this.repo.getProductById(productId)

    if (!product) {
      throw new EntityError('Product not found')
    }

    const updatedCategories =
      product.categories && product.categories.length > 0
        ? product.categories.filter((category) => {
          return category && category.split('#')[0] !== categoryId
        })
        : []

    const updatedAttributes = product.attributes
      ? product.attributes.filter((attribute) => {
        const attributeCategoryId =
          attribute.categoryId && attribute.categoryId.split('#')[0]
        return attributeCategoryId !== categoryId
      })
      : []

    const updatedProduct = await this.repo.updateProduct(
      productId,
      undefined,
      undefined,
      undefined,
      updatedCategories,
      undefined,
      updatedAttributes,
      undefined,
    )

    return updatedProduct
  }
}
