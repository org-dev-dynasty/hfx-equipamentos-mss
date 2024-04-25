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

    if (models && categories) {
      throw new ConflictItems('models and categories')
    }

    const appendId = (item: string) => `${item}#${id}`
    if (models) {
      models = models.map(appendId)
    }
    console.log('LOG ADICIONADO AQUI - [CATEGORIES] !!!! VENDO COMO CHEGA', categories)
    if (categories) {
      categories = categories.map(appendId)
    }

    if (attributes) {
      attributes = attributes.map((attribute) => {
        if (models) {
          return {
            ...attribute,
            modelId: models.find((model) => model.includes(attribute.modelId)),
          }
        }
        if (categories) {
          return {
            ...attribute,
            categoryId: categories.find((category) =>
              category.includes(attribute.categoryId),
            ),
          }
        }
        return attribute
      })
    }

    if (videos) {
      videos = videos.map(appendId)
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
