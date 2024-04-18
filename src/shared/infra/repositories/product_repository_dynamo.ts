/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../domain/entities/product'
import { IProductRepository } from '../../domain/repositories/product_repository_interface'
import { Environments } from '../../environments'
import { ProductDynamoDTO } from '../dto/product_dynamo_dto'
import { DynamoDatasource } from '../external/dynamo/datasources/dynamo_datasource'

export class ProductRepositoryDynamo implements IProductRepository {
  static partitionKeyFormat(id: string): string {
    return `product#${id}`
  }

  static sortKeyFormat(id: string): string {
    return `#${id}`
  }

  constructor(
    private dynamo: DynamoDatasource = new DynamoDatasource(
      Environments.getEnvs().dynamoTableName,
      Environments.getEnvs().dynamoPartitionKey,
      Environments.getEnvs().region,
      undefined,
      undefined,
      Environments.getEnvs().endpointUrl,
      Environments.getEnvs().dynamoSortKey,
    ),
  ) {}

  async createProduct(product: Product): Promise<Product> {
    const productDto = ProductDynamoDTO.fromEntity(product)
    await this.dynamo.putItem(
      productDto.toDynamo(),
      ProductRepositoryDynamo.partitionKeyFormat(product.id),
      ProductRepositoryDynamo.sortKeyFormat(product.id),
    )

    return Promise.resolve(productDto.toEntity())
  }

  async getAllProducts(): Promise<Product[]> {
    const resp = await this.dynamo.getAllItems()
    const products = resp.Items.map((product: Record<any, any>) => ProductDynamoDTO.fromDynamo(product).toEntity())
    return Promise.resolve(products)    
  }

  async getProductById(id: string): Promise<Product> {
    const resp = await this.dynamo.getItem(
      ProductRepositoryDynamo.partitionKeyFormat(id),
      ProductRepositoryDynamo.sortKeyFormat(id),
    )
    if (!resp.Item) {
      return Promise.reject('Product not found')
    }

    const productDto = ProductDynamoDTO.fromDynamo(resp['Item'])

    return Promise.resolve(productDto.toEntity())    
  }

  async updateProduct(
    id: string,
    name?: string,
    description?: string,
    models?: string[],
    categories?: string[],
    attributes?: Record<string, any>[],
    videos?: string[],
  ): Promise<Product> {
    const itemsToUpdate: Record<string, any> = {}

    if (name) {
      itemsToUpdate['name'] = name
    }

    if (description) {
      itemsToUpdate['description'] = description
    }

    const product = await this.getProductById(id)

    if (models) {
      if (product.models) {
        const modelsIds = product.models.map((model) => model.split('#')[1])
        const newModels = models.map((model) => model.split('#')[1])

        const oldModels = modelsIds.filter((model) => !newModels.includes(model))

        

      }
      
    }

    throw new Error('Method not implemented.')
  }

  async deleteProduct(id: string): Promise<Product> {
    const product = await this.getProductById(id)
    await this.dynamo.deleteItem(
      ProductRepositoryDynamo.partitionKeyFormat(id),
      ProductRepositoryDynamo.sortKeyFormat(id),
    )

    return Promise.resolve(product)   
  }
}