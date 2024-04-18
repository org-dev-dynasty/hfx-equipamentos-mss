/* eslint-disable @typescript-eslint/no-unused-vars */
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
      Environments.getEnvs().dynamoProductsTableName,
      Environments.getEnvs().dynamoPartitionKey,
      Environments.getEnvs().region,
      undefined,
      undefined,
      Environments.getEnvs().endpointUrl,
      Environments.getEnvs().dynamoSortKey,
    ),
  ) {

    console.log('[ProductRepositoryDynamo] - Environments.getEnvs(): ', Environments.getEnvs())
    console.log('[ProductRepositoryDynamo] - Environments.getEnvs().dynamoProductsTableName: ', Environments.getEnvs().dynamoProductsTableName)
  }

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
    const finalProducts: Product[] = []
    console.log('[async getAllProducts()] - envs: ', console.log(Environments.getEnvs()))
    const resp = await this.dynamo.getAllItems()
    console.log('[async getAllProducts()] - resp: ', resp)
    resp.Items.map((product: Record<any, any>) => {
      console.log('[async getAllProducts()] - product: ', product)
      const productEntity = ProductDynamoDTO.fromDynamo(product).toEntity()
      finalProducts.push(productEntity)
      console.log('[async getAllProducts()] - ProductDynamoDTO.fromDynamo(product): ', ProductDynamoDTO.fromDynamo(product))
      console.log('[async getAllProducts()] - ProductDynamoDTO.fromDynamo(product).toEntity(): ', ProductDynamoDTO.fromDynamo(product).toEntity())
    })    
    console.log('[async getAllProducts()] - finalProducts: ', finalProducts)
    return Promise.resolve(finalProducts)
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
    // Obtém o produto atual do DynamoDB

    let itemsToUpdate: Record<string, any> = {}

    // Atualiza os campos do produto
    if (name) {
      itemsToUpdate = { ...itemsToUpdate, name }
    }
    if (description) {
      itemsToUpdate = { ...itemsToUpdate, description }
    }
    if (models) {
      itemsToUpdate = { ...itemsToUpdate, models }
    }
    if (categories) {
      itemsToUpdate = { ...itemsToUpdate, categories }
    }
    if (attributes) {
      itemsToUpdate = { ...itemsToUpdate, attributes }
    }
    if (videos) {
      itemsToUpdate = { ...itemsToUpdate, videos }
    }

    // Atualiza o produto no DynamoDB
    await this.dynamo.updateItem(
      ProductRepositoryDynamo.partitionKeyFormat(id),
      ProductRepositoryDynamo.sortKeyFormat(id),
      itemsToUpdate,
    )

    // Retorna o produto atualizado
    const product = await this.getProductById(id)
    return Promise.resolve(product)
    
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
