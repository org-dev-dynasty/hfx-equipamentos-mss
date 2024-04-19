/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../../shared/domain/entities/product'
import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { ConflictItems } from '../../../shared/helpers/errors/usecase_errors'

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
    console.log('[chegou no usecase do update]')
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

    if (models && categories) {
      throw new ConflictItems('models and categories')
    }

    if (models) {
      const modelsAlreadyExistent = (await this.repo.getProductById(id)).models

      const modelsWithIds = models.map(model => {
        if (modelsAlreadyExistent?.includes(model)) {
          return model
        }
        return `${model}#${id}`
      })

      if (attributes) {
        const attributesWithIds = attributes.map(attribute => {
          const attributesWithIds = models?.map(name => {
            const newModelId = `${name}#${id}`
            return { ...attribute, modelId: newModelId }
          })
          return attributesWithIds as Record<string, any>
        })
        attributes = attributesWithIds
      }
      models = modelsWithIds
    }

    if (categories) {
      const categoriesAlreadyExistent = (await this.repo.getProductById(id)).categories

      const categoriesWithIds = categories.map(category => {
        if (categoriesAlreadyExistent?.includes(category)) {
          return category
        }
        return `${category}#${id}`
      })

      if (attributes) {
        const attributesWithIds = attributes.map(attribute => {
          const attributesWithIds = categories?.map(name => {
            const newCategoryId = `${name}#${id}`
            return { ...attribute, categoryId: newCategoryId }
          })
          return attributesWithIds as Record<string, any>
        })
        attributes = attributesWithIds
      }
      categories = categoriesWithIds
    }

    console.log('[antes de criar o produto]')

    const updatedProduct = await this.repo.updateProduct(
      id,
      name,
      description,
      models,
      categories,
      attributes,
      videos,
    )

    console.log('[depois de criar o produto]')

    return updatedProduct
  }
}