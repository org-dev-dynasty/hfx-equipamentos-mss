/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../../shared/domain/entities/product'
import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'

export class UpdateProductUsecase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(
    id: string,
    name?: string,
    description?: string,
    models?: string[],
    categories?: string[],
    attributes?: Record<string, any>[],
    videos?: string[],
  ) {
    if (name && !Product.validateName(name)) {
      throw new EntityError('name')
    }
    if (description && !Product.validateDescription(description)) {
      throw new EntityError('description')
    }
    if (models && !Product.validateModel(models)) {
      throw new EntityError('models')
    }
    if (categories && !Product.validateCategory(categories)) {
      throw new EntityError('categories')
    }
    if (attributes && !Product.validateAttributes(attributes)) {
      throw new EntityError('attributes')
    }
    if (videos && !Product.validateVideos(videos)) {
      throw new EntityError('videos')
    }

    const updatedProduct = await this.repo.updateProduct(
      id,
      name,
      description,
      models,
      categories,
      attributes,
      videos,
    )

    return updatedProduct
  }
}