/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../domain/entities/product'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export type ProductDynamoDTOProps = {
  id: string
  name: string
  description: string
  littleDescription?: string[]
  models?: string[] | null
  categories?: string[] | null
  attributes?: Record<string, any>[] | null
  modelsImages?: string[] | null
  categoriesImages?: string[] | null
  videos?: string[] | null
}

export class ProductDynamoDTO {
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

  constructor(props: ProductDynamoDTOProps) {
    if (this.models === undefined) {
      this.models = null
    }
    if (this.categories === undefined) {
      this.categories = null
    }
    if (this.attributes === undefined) {
      this.attributes = null
    }
    if (this.videos === undefined) {
      this.videos = null
    }
    if (this.modelsImages === undefined) {
      this.modelsImages = null
    }
    if (this.categoriesImages === undefined) {
      this.categoriesImages = null
    }

    this.id = props.id
    this.name = props.name
    this.description = props.description
    this.littleDescription = props.littleDescription
    this.models = props.models
    this.categories = props.categories
    this.attributes = props.attributes
    this.modelsImages = props.modelsImages
    this.categoriesImages = props.categoriesImages
    this.videos = props.videos
  }

  static fromEntity(product: Product): ProductDynamoDTO {
    return new ProductDynamoDTO({
      id: product.id,
      name: product.name,
      description: product.description,
      littleDescription: product.littleDescription,
      models: product.models,
      categories: product.categories,
      attributes: product.attributes,
      modelsImages: product.modelsImages,
      categoriesImages: product.categoriesImages,
      videos: product.videos,
    })
  }

  toDynamo() {
    return {
      'entity': 'product',
      'id': this.id,
      'name': this.name,
      'description': this.description,
      'littleDescription': this.littleDescription || null,
      'models': this.models || null,
      'categories': this.categories || null,
      'attributes': this.attributes || null,
      'modelsImages': this.modelsImages || null,
      'categoriesImages': this.categoriesImages || null,
      'videos': this.videos || null
    }

  }

  static fromDynamo(productData: any) {
    const { id, name, description, littleDescription, models, categories, attributes, modelsImages, categoriesImages, videos } = unmarshall(productData)

    return new ProductDynamoDTO({
      id,
      name,
      description,
      littleDescription,
      models,
      categories,
      attributes,
      modelsImages,
      categoriesImages,
      videos
    })
  }

  toEntity() {
    console.log('[ProductDynamoDTO] - toEntity - this: ', this)
    return new Product({
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
    })
  }
}
