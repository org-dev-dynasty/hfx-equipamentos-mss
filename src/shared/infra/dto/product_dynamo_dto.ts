/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../domain/entities/product'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export type ProductDynamoDTOProps = {
  id: string
  name: string
  description: string
  models?: string[] | null
  categories?: string[] | null
  attributes?: Record<string, any>[] | null
  videos?: string[] | null
}

export class ProductDynamoDTO {
  private id: string
  private name: string
  private description: string
  private models?: string[] | null
  private categories?: string[] | null
  private attributes?: Record<string, any>[] | null
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

  static validateDynamoItemTypes(dynamoItem: Record<string, any>) {
    const expectedTypes: Record<string, 'S' | 'L' | 'NULL'> = {
      entity: 'S',
      id: 'S',
      name: 'S',
      description: 'S',
      models: 'L',
      categories: 'L',
      attributes: 'L',
      videos: 'L'
    }
  
    for (const [key, value] of Object.entries(dynamoItem)) {
      const expectedType = expectedTypes[key]
      if (!expectedType) {
        throw new Error(`Tipo inesperado para a chave '${key}' no DynamoDB item.`)
      }
      if (value.hasOwnProperty('NULL')) {
        continue // Permite valores nulos, então pula a verificação de tipo para essa chave
      }
      if (!value.hasOwnProperty(expectedType)) {
        throw new Error(`Tipo incorreto para a chave '${key}'. Esperado '${expectedType}', encontrado '${Object.keys(value)[0]}' no DynamoDB item.`)
      }
  
      // Validação específica para 'attributes'
      if (key === 'attributes' && expectedType === 'L') {
        if (!Array.isArray(value.L)) {
          throw new Error(`Esperado um array para 'attributes', encontrado ${typeof value.L}`)
        }
        value.L.forEach((attribute: Record<string, any>, index: number) => {
          if (!attribute.hasOwnProperty('M') || Array.isArray(attribute.M)) {
            throw new Error(`Esperado um objeto para 'attributes[${index}]', encontrado ${typeof attribute.M}`)
          }
        })
      }
    }
  }

  toDynamo() {
    return {
      'entity': 'product',
      'id': this.id,
      'name': this.name,
      'description': this.description,
      'models': this.models || null,
      'categories': this.categories || null,
      'attributes': this.attributes || null,
      'videos': this.videos || null
    }

  }

  static fromDynamo(productData: any) {
    console.log('[ProductDynamoDTO] - fromDynamo - productData: ', productData)
    

    console.log('[ProductDynamoDTO] - fromDynamo - unMarshall(productData): ', unmarshall(productData))

    // const id = productData['id'] && productData['id']['S'] ? productData['id']['S'] : null
    // const name = productData['name'] && productData['name']['S'] ? productData['name']['S'] : null
    // const description = productData['description'] && productData['description']['S'] ? productData['description']['S'] : null
    // const models = productData['models'] && productData['models'] ? productData['models'].map((model: Record<string, any>) => model['S']) : null
    // const categories = productData['categories'] && productData['categories']['M'] ? productData['categories'].map((category: Record<string, any>) => {
    //   const categories = unmarshall(category)
    //   return categories
    // }) : null
    // const attributes = productData['attributes'] && productData['attributes']['M'] ? productData['attributes'].map((attribute: Record<string, any>) => {
    //   const attributes = unmarshall(attribute)
    //   return attributes
    // }) : null
    // const videos = productData['videos'] && productData['videos'] ? productData['videos'].map((video: Record<string, any>) => video['S']) : null

    const { id, name, description, models, categories, attributes, videos } = unmarshall(productData)

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
      models,
      categories,
      attributes,
      videos
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