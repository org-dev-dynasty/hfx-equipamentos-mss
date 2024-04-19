/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../../shared/domain/entities/product'
import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { v4 as uuid } from 'uuid'
import { ConflictItems } from '../../../shared/helpers/errors/usecase_errors'

export class CreateProductUsecase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(
    name: string,
    description: string,
    models?: string[],
    categories?: string[],
    attributes?: Record<string, any>[],
    videos?: string[],
  ): Promise<Product> {
    const id = uuid()
    if (!Product.validateId(id)) throw new EntityError('id')
    if (!Product.validateName(name)) throw new EntityError('name')
    if (!Product.validateDescription(description)) throw new EntityError('description')
      
    if (models) {
      const modelsWithIds = models.map(model => `${model}#${id}`)
      models = modelsWithIds
      if (attributes) {
        const attributesWithIds = attributes.map(attribute => {
          const modelName = models?.map(model => model.split('#')[0])
          const attributesWithIds = modelName?.map(name => {
            const newModelId = `${name}#${id}`
            return { ...attribute, modelId: newModelId }
          })
          return attributesWithIds as Record<string, any>
          
        })
        attributes = attributesWithIds
      }
    }
    if (categories) {
      const categoriesWithIds = categories.map(category => `${category}#${id}`)
      categories = categoriesWithIds

      if (attributes) {
        const attributesWithIds = attributes.map(attribute => {
          const categoryName = categories?.map(category => category.split('#')[0])
          const attributesWithIds = categoryName?.map(name => {
            const newCategoryId = `${name}#${id}`
            return { ...attribute, categoryId: newCategoryId }
          })
          return attributesWithIds as Record<string, any>
        })
        attributes = attributesWithIds
      }
    }
    if (models && categories) {
      throw new ConflictItems('models and categories')
    }
    if (videos) {
      const videosWithIds = videos.map(video => `${video}#${id}`)
      videos = videosWithIds
    }

    console.log('[Update usecase] models:', models)
    console.log('[Update usecase] categories:', categories) 
    console.log('[Update usecase] attributes:', attributes)
    console.log('[Update usecase] videos:', videos)

    if (models && !Product.validateModel(models)) throw new EntityError('models')
    if (categories && !Product.validateCategory(categories)) throw new EntityError('categories')
    if (attributes && !Product.validateAttributes(attributes)) throw new EntityError('attributes')
    if (videos && !Product.validateVideos(videos)) throw new EntityError('videos')
      
    const product = new Product({
      id,
      name,
      description,
      models,
      categories,
      attributes,
      videos
    })
    
    const productCreated = await this.repo.createProduct(product)
    return productCreated
  }
}