/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../../shared/domain/entities/product'
import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { ConflictItems } from '../../../shared/helpers/errors/usecase_errors'

export class UpdateProductUsecase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(
    id: string,
    name: string,
    description: string,
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
    
    if (models && models.length > 0 && categories && categories.length > 0) {
      throw new ConflictItems('models and categories')
    }
    
    if (models && models.length > 0) {
      const modelsAlreadyExistent = (await this.repo.getProductById(id)).models
      
      const modelsWithIds = models.map(model => {
        if (modelsAlreadyExistent?.includes(model)) {
          return model
        }
        return `${model}#${id}`
      })
      
      if (attributes && attributes.length > 0) {
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
    
    if (categories && categories.length > 0) {
      const categoriesAlreadyExistent = (await this.repo.getProductById(id)).categories

      const categoriesWithIds = categories.map(category => {
        if (categoriesAlreadyExistent?.includes(category)) {
          return category
        }
        return `${category}#${id}`
      })
      
      if (attributes && attributes.length > 0) {
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

    if (!Product.validateName(name)) {
      throw new EntityError('name')
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
    
    console.log('[depois de criar o produto]')

    return updatedProduct
  }
}