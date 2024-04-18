/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../../shared/domain/entities/product'
import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { v4 as uuid } from 'uuid'

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
    if (models && !Product.validateModel(models)) throw new EntityError('models')
    if (categories && !Product.validateCategory(categories)) throw new EntityError('categories')
    if (attributes && !Product.validateAttributes(attributes)) throw new EntityError('attributes')
    if (videos && !Product.validateVideos(videos)) throw new EntityError('videos')

    if (models) {
      const modelsWithIds = models.map(model => `${model}#${id}`)
      models = modelsWithIds
    }
    if (categories) {
      const categoriesWithIds = categories.map(category => `${category}#${id}`)
      categories = categoriesWithIds
    }
    if (attributes) {
      const attributesWithIds = attributes.map(attribute => {
        const modelId = attribute.modelId
        const newModelId = `${modelId}#${id}`
        return {
          ...attribute,
          modelId: newModelId
        }
      })
      attributes = attributesWithIds
    }
    if (videos) {
      const videosWithIds = videos.map(video => `${video}#${id}`)
      videos = videosWithIds
    }
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