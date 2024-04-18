import { Product } from '../../../shared/domain/entities/product'
import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'

export class CreateProductUsecase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(product: Product): Promise<Product> {
    if (!Product.validateId(product.id)) throw new EntityError('id')
    if (!Product.validateName(product.name)) throw new EntityError('name')
    if (!Product.validateDescription(product.description)) throw new EntityError('description')
    if (product.models && !Product.validateModel(product.models)) throw new EntityError('models')
    if (product.categories && !Product.validateCategory(product.categories)) throw new EntityError('categories')
    if (product.attributes && !Product.validateAttributes(product.attributes)) throw new EntityError('attributes')
    if (product.videos && !Product.validateVideos(product.videos)) throw new EntityError('videos')

    const productCreated = await this.repo.createProduct(product)
    return productCreated
  }
}