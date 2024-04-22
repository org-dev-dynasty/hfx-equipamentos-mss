/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../../shared/domain/entities/product'

export class GetProductByIdViewModel {
  private id: string
  private name: string
  private description: string
  private littleDescription?: string[]
  private models?: string[] | null
  private categories?: string[] | null
  private attributes?: Record<string, any>[] | null
  private modelsImages?: string[] | null
  private categoriesImages?: string[] | null
  private videos?: string[] | null

  constructor(product: Product) {
    this.id = product.id
    this.name = product.name
    this.description = product.description
    this.littleDescription = product.littleDescription
    this.models = product.models
    this.categories = product.categories
    this.attributes = product.attributes
    this.modelsImages = product.modelsImages
    this.categoriesImages = product.categoriesImages
    this.videos = product.videos
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      littleDescription: this.littleDescription,
      models: this.models,
      categories: this.categories,
      attributes: this.attributes,
      modelsImages: this.modelsImages,
      categoriesImages: this.categoriesImages,
      videos: this.videos,
    }
  }
}
