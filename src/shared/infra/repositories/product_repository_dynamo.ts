/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { S3 } from 'aws-sdk'
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

    private s3: S3 = new S3({
      region: 'sa-east-1',
      endpoint: Environments.getEnvs().endpointUrl,
    }),
  ) {
    console.log(
      '[ProductRepositoryDynamo] - Environments.getEnvs(): ',
      Environments.getEnvs(),
    )
    console.log(
      '[ProductRepositoryDynamo] - Environments.getEnvs().dynamoProductsTableName: ',
      Environments.getEnvs().dynamoProductsTableName,
    )
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
    console.log(
      '[async getAllProducts()] - envs: ',
      console.log(Environments.getEnvs()),
    )
    const resp = await this.dynamo.getAllItems()
    console.log('[async getAllProducts()] - resp: ', resp)
    resp.Items.map((product: Record<any, any>) => {
      console.log('[async getAllProducts()] - product: ', product)
      const productEntity = ProductDynamoDTO.fromDynamo(product).toEntity()
      finalProducts.push(productEntity)
      console.log(
        '[async getAllProducts()] - ProductDynamoDTO.fromDynamo(product): ',
        ProductDynamoDTO.fromDynamo(product),
      )
      console.log(
        '[async getAllProducts()] - ProductDynamoDTO.fromDynamo(product).toEntity(): ',
        ProductDynamoDTO.fromDynamo(product).toEntity(),
      )
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

  async updateProductImage(
    id: string,
    name: string,
    newName: string,
    isModel: boolean,
    image: Buffer,
  ): Promise<Product> {    
    const oldProduct = await this.getProductById(id)
    const oldImages = oldProduct.categoriesImages || oldProduct.modelsImages
    const removedOldImageFilter = oldImages?.filter((oldImage) => {
      const oldImageName = oldImage.split('-')[0]
      if (oldImageName !== name) {
        return oldImage
      }
    })
    const oldImageKey = `${name}-${id}`
    await this.s3
      .deleteObject({
        Bucket: Environments.getEnvs().s3BucketName,
        Key: oldImageKey,
      })
      .promise()

    const newImageKey = `${newName}-${id}`
    await this.s3
      .putObject({
        Bucket: Environments.getEnvs().s3BucketName,
        Key: newImageKey,
        Body: image,
        ACL: 'public-read',
      })
      .promise()

    const url = `https://${Environments.getEnvs().s3BucketName}.s3.${
      Environments.getEnvs().region
    }.amazonaws.com/${newImageKey}`

    let itemsToUpdate: Record<string, any> = {}
    const modelsImagesNew: string[] = []
    const categoriesImagesNew: string[] = []

    if (!removedOldImageFilter) {
      return Promise.reject('Product does not have any images')
    }
    if (!oldImages) {
      return Promise.reject('Product does not have any images')
    }

    for (let i = 0; i < removedOldImageFilter.length; i++) {
      if (isModel) {
        modelsImagesNew.push(removedOldImageFilter[i])
      } else {
        categoriesImagesNew.push(removedOldImageFilter[i])
      }
    }

    if (isModel) {
      modelsImagesNew.push(url)
    } else {
      categoriesImagesNew.push(url)
    }

    if (isModel) {
      itemsToUpdate = { modelsImages: modelsImagesNew }
    } else {
      itemsToUpdate = { categoriesImages: categoriesImagesNew }
    }

    await this.dynamo.updateItem(
      ProductRepositoryDynamo.partitionKeyFormat(id),
      ProductRepositoryDynamo.sortKeyFormat(id),
      itemsToUpdate,
    )

    console.log(
      '[ProductRepositoryDynamo] - updateProduct - itemsToUpdate: ',
      itemsToUpdate,
    )
    const updatedProduct = await this.getProductById(id)
    return Promise.resolve(updatedProduct)
  }

  async deleteProduct(id: string): Promise<Product> {
    const product = await this.getProductById(id)
    await this.dynamo.deleteItem(
      ProductRepositoryDynamo.partitionKeyFormat(id),
      ProductRepositoryDynamo.sortKeyFormat(id),
    )

    return Promise.resolve(product)
  }

  async uploadProductImage(
    id: string,
    images: Buffer[],
    fieldNames: string[],
    isModel: boolean,
  ): Promise<Product> {
    const modelsImagesNew: string[] = []
    const categoriesImagesNew: string[] = []
    let itemsToUpdate: Record<string, any> = {}
    for (let i = 0; i < images.length; i++) {
      const params: AWS.S3.PutObjectRequest = {
        Bucket: Environments.getEnvs().s3BucketName,
        Key: `${fieldNames[i]}-${id}.png`,
        Body: images[i],
        ACL: 'public-read',
      }

      try {
        const responseS3: AWS.S3.PutObjectOutput = await this.s3.putObject(params).promise()

        console.log('{Upload} - responseS3: ', responseS3)

        const url = `https://${Environments.getEnvs().s3BucketName}.s3.${
          Environments.getEnvs().region
        }.amazonaws.com/${fieldNames[i]}-${id}.png`


        if (isModel) {
          modelsImagesNew.push(url)
        } else {
          categoriesImagesNew.push(url)
        }
      } catch (error) {
        console.error(
          `Erro ao fazer upload do arquivo ${fieldNames[i]}#${id}:`,
          error,
        )
      }
    }
    if (isModel) {
      itemsToUpdate = { modelsImages: modelsImagesNew }
    } else {
      itemsToUpdate = { categoriesImages: categoriesImagesNew }
    }

    console.log('{Upload} - itemsToUpdate: ', itemsToUpdate)
    
    const responseUpdate = await this.dynamo.updateItem(
      ProductRepositoryDynamo.partitionKeyFormat(id),
      ProductRepositoryDynamo.sortKeyFormat(id),
      itemsToUpdate,
    )
    console.log('{Upload} - responseUpdate: ', responseUpdate)

    const updatedProduct = await this.getProductById(id)

    console.log(
      '[ProductRepositoryDynamo] - uploadProductImage - fieldNames: ',
      fieldNames,
    )

    return Promise.resolve(updatedProduct)
  }

  async downloadProductImage(id: string): Promise<string> {
    const params = {
      Bucket: Environments.getEnvs().s3BucketName,
      Key: id,
    }

    const data = await this.s3.getObject(params).promise()

    return Promise.resolve(data.Body!.toString())
  }

  async updateProduct(
    id: string,
    name?: string | undefined,
    description?: string | undefined,
    littleDescription?: string[],
    models?: string[] | undefined,
    categories?: string[] | undefined,
    attributes?: Record<string, any>[] | undefined,
    videos?: string[] | undefined,
  ): Promise<Product> {
    let itemsToUpdate: Record<string, any> = {}

    if (name) {
      itemsToUpdate = { name }
    }

    if (description) {
      itemsToUpdate = { ...itemsToUpdate, description }
    }

    if (littleDescription) {
      itemsToUpdate = { ...itemsToUpdate, littleDescription }
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

    await this.dynamo.updateItem(
      ProductRepositoryDynamo.partitionKeyFormat(id),
      ProductRepositoryDynamo.sortKeyFormat(id),
      itemsToUpdate,
    )

    const updatedProduct = await this.getProductById(id)

    return Promise.resolve(updatedProduct)
  }
}
