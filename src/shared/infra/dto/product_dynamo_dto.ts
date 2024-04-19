/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../domain/entities/product'
import { unmarshall } from '@aws-sdk/util-dynamodb'

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
    const { id, name, description, models, categories, attributes, videos } =
      unmarshall(productData)

    // Extrair os valores dos objetos no formato { "S": "valor" }
    const extractedModels = models
      ? models.map((model: any) => model.S)
      : undefined
    const extractedCategories = categories
      ? Object.values(categories).map((category: any) => category.S)
      : undefined
    const extractedAttributes = attributes
      ? Object.values(attributes)
      : undefined
    const extractedVideos = videos
      ? videos.map((video: any) => video.S)
      : undefined

    console.log('[ProductDynamoDTO] - fromDynamo - id: ', id)
    console.log('[ProductDynamoDTO] - fromDynamo - name: ', name)
    console.log('[ProductDynamoDTO] - fromDynamo - description: ', description)
    console.log('[ProductDynamoDTO] - fromDynamo - models: ', models)
    console.log('[ProductDynamoDTO] - fromDynamo - categories: ', categories)
    console.log('[ProductDynamoDTO] - fromDynamo - attributes: ', attributes)
    console.log('[ProductDynamoDTO] - fromDynamo - videos: ', videos)

    return new ProductDynamoDTO({
      id,
      name,
      description,
      models: extractedModels,
      categories: extractedCategories,
      attributes: extractedAttributes as Record<string, any>[],
      videos: extractedVideos,
    })
  }

  toEntity() {
    console.log('[ProductDynamoDTO] - toEntity - this: ', this)
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
