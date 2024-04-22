/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../../shared/domain/entities/product'
import { IProductRepository } from '../../../shared/domain/repositories/product_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'

export class UpdateProductImageUsecase {
  constructor(private readonly repo: IProductRepository) {}

  async execute(
    id: string,
    name: string,
    newName: string,
    isModel: boolean,
    image: Buffer,
  ) {
    console.log('[chegou no usecase do update]')

    if (name && !Product.validateName(name)) {
      throw new EntityError('name')
    }

    if (!Product.validateName(newName)) {
      throw new EntityError('newName')
    }
    if (!Product.validateName(name)) {
      throw new EntityError('name')
    }

    const updatedProduct = await this.repo.updateProductImage(
      id,
      name,
      newName,
      isModel,
      image,
    )
    
    return updatedProduct
  }
}