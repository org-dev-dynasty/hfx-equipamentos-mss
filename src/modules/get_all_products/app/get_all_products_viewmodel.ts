/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductProps } from '../../../shared/domain/entities/product'

export class ProductViewModel {
  private id: string
  private name: string
  private description: string
  private models?: string[] | null
  private categories?: string[] | null
  private attributes?: Record<string, any>[] | null
  private videos?: string[] | null

  constructor(product: ProductProps) {
    this.id = product.id
    this.name = product.name
    this.description = product.description
    this.models = product.models
    this.categories = product.categories
    this.attributes = product.attributes
    this.videos = product.videos
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

export class GetAllProductViewModel {
  private products: ProductViewModel[]

  constructor(products: ProductProps[]) {
    this.products = products.map((product) => new ProductViewModel(product))
  }

  toJSON() {
    return {
      products: this.products.map((product) => product.toJSON()),
      message: 'Products have been retrieved successfully.',
    }
  }
}
