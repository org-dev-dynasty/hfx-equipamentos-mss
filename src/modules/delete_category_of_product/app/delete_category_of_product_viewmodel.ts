/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../../shared/domain/entities/product'

export class DeleteCategoryOfProductViewModel {
  private id: string
  private name: string
  private description: string
  private models?: string[]
  private categories?: string[]
  private attributes?: Record<string, any>[]
  private videos?: string[]

  constructor(product: Product) {
    this.id = product.id
    this.name = product.name
    this.description = product.description
    this.models = product.models ?? []
    this.categories = product.categories ?? []
    this.attributes = product.attributes ?? []
    this.videos = product.videos ?? []
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      models: this.models,
      categories: this.categories,
      attributes: this.attributes,
      videos: this.videos,
    }
  }
}