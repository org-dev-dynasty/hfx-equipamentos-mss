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
    littleDescription?: string[],
    models?: string[],
    categories?: string[],
    attributes?: Record<string, any>[],
    videos?: string[],
  ): Promise<Product> {
    const id = uuid()
    if (!Product.validateId(id)) throw new EntityError('id')
    if (!Product.validateName(name)) throw new EntityError('name')
    if (!Product.validateDescription(description))
      throw new EntityError('description')
    if (
      littleDescription &&
      !Product.validateLittleDescription(littleDescription)
    )
      throw new EntityError('littleDescription')

    if (models && categories && models.length > 0 && categories.length > 0) {
      throw new ConflictItems('models and categories')
    }

    const appendId = (item: string) => `${item}#${id}`
    if (models && models?.length > 0) {
      models = models.map((model) => appendId(model))
    }
    console.log('LOG ADICIONADO AQUI - [CATEGORIES] !!!! VENDO COMO CHEGA', categories)
    if (categories && categories?.length > 0) {
      categories = categories.map((category) => appendId(category))
    }

    console.log('LOG ADICIONADO AQUI - [Attrs] !!!! VENDO COMO CHEGA', attributes)
    if (attributes && attributes.length > 0) {
      attributes = attributes.map((attribute) => {
        const updatedAttribute = { ...attribute } // Clone the original attribute object

        console.log('LOG ADICIONADO AQUI - [MODEL] !!!! ->>> ', models)
        
        if (models && models.length > 0 && attribute.modelId) {
          updatedAttribute.modelId = models.find(model => model.includes(attribute.modelId))
        }
        
        if (categories && categories.length > 0 && attribute.categoryId) {
          updatedAttribute.categoryId = categories.find(category => category.includes(attribute.categoryId))
        }
        
        return updatedAttribute
      })
    }

    if (videos) {
      videos = videos.map((video) => appendId(video))
    }

    if (models && !Product.validateModel(models))
      throw new EntityError('models')
    console.log('LOG ADICIONADO AQUI - [VALIDACAO DE CATEGORIES] !!!! ->>> ', categories)
    if (categories && !Product.validateCategory(categories))
      throw new EntityError('categories')
    if (attributes && !Product.validateAttributes(attributes))
      throw new EntityError('attributes')
    if (videos && !Product.validateVideos(videos))
      throw new EntityError('videos')

    const product = new Product({
      id,
      name,
      description,
      littleDescription,
      models,
      categories,
      attributes,
      videos,
    })
    console.log('LOG ADICIONADO AQUI!!!!')
    console.log('[LOG DE PRODUCT INTEIRO] ',product)
    console.log('[LOG DE CATEGORIES ]',product.categories)
    const productCreated = await this.repo.createProduct(product)
    return productCreated
  }
}