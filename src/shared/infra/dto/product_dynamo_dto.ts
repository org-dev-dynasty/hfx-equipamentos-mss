/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../domain/entities/product'

export type ProductDynamoDTOProps = {
  id: string
  name: string
  description: string
  models?: string[]
  categories?: string[]
  attributes?: Record<string, any>[] 
  videos?: string[]
}

export class ProductDynamoDTO {
  private id: string
  private name: string
  private description: string
  private models?: string[]
  private categories?: string[]
  private attributes?: Record<string, any>[]
  private videos?: string[]

  constructor(props: ProductDynamoDTOProps) {
    this.id = props.id
    this.name = props.name
    this.description = props.description
    this.models = props.models
    this.categories = props.categories
    this.attributes = props.attributes
    this.videos = props.videos
  }

  static fromEntity(product: Product): ProductDynamoDTO {
    return new ProductDynamoDTO({
      id: product.id,
      name: product.name,
      description: product.description,
      models: product.models,
      categories: product.categories,
      attributes: product.attributes,
      videos: product.videos,
    })
  }

  toDynamo() {
    return {
      entity: 'product',
      id: this.id,
      name: this.name,
      description: this.description,
      models: this.models,
      categories: this.categories,
      attributes: this.attributes,
      videos: this.videos,
    }
  }

  static fromDynamo(productData: any) {
    const id = productData['id'] && productData['id']['S'] ? productData['id']['S'] : null
    const name = productData['name'] && productData['name']['S'] ? productData['name']['S'] : null
    const description = productData['description'] && productData['description']['S'] ? productData['description']['S'] : null
    const models = productData['models'] && productData['models']['SS'] ? productData['models']['SS'] : null
    const categories = productData['categories'] && productData['categories']['SS'] ? productData['categories']['SS'] : null
    const attributes = productData['attributes'] && productData['attributes']['L'] ? productData['attributes']['L'] : null
    const videos = productData['videos'] && productData['videos']['SS'] ? productData['videos']['SS'] : null

    return new ProductDynamoDTO({
      id,
      name,
      description,
      models,
      categories,
      attributes,
      videos
    })
  }

  toEntity() {
    return new Product({
      id: this.id,
      name: this.name,
      description: this.description,
      models: this.models,
      categories: this.categories,
      attributes: this.attributes,
      videos: this.videos,
    })
  }
}