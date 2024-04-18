import { STAGE } from './domain/enums/stage_enum'
import { IUserRepository } from './domain/repositories/user_repository_interface'
import { UserRepositoryDynamo } from './infra/repositories/user_repository_dynamo'
// import { UserRepositoryMock } from './infra/repositories/user_repository_mock'
import env from '../../'
import { IProductRepository } from './domain/repositories/product_repository_interface'
import { ProductRepositoryMock } from './infra/repositories/product_repository_mock'
import { ProductRepositoryDynamo } from './infra/repositories/product_repository_dynamo'

export class Environments {
  stage: STAGE = STAGE.TEST
  s3BucketName: string = ''
  region: string = ''
  endpointUrl: string = ''
  dynamoTableName: string = ''
  dynamoProductsTableName: string = ''
  dynamoPartitionKey: string = ''
  dynamoSortKey: string = ''
  cloudFrontGetUserPresenterDistributionDomain: string = ''
  mssName: string = ''

  configureLocal() {
    console.log('env.STAGE - [ENVIRONMENTS - { CONFIGURE LOCAL }] - ', env.STAGE)
    env.STAGE = env.STAGE || 'TEST'
  }

  loadEnvs() {
    if (!env.STAGE) {
      this.configureLocal()
    }

    
    this.stage = env.STAGE as STAGE

    console.log('env.STAGE - [CHEGOU NO LOAD_ENVS] - ', env.STAGE)
    console.log('env.DYNAMO_TABLE_NAME - [CHEGOU NO LOAD_ENVS] - ', env.DYNAMO_TABLE_NAME)
    console.log('env.DYNAMO_PRODUCTS_TABLE_NAME - [CHEGOU NO LOAD_ENVS] - ', env.DYNAMO_PRODUCTS_TABLE_NAME)
    console.log('env.ENDPOINT_URL - [CHEGOU NO LOAD_ENVS] - ', env.ENDPOINT_URL)
    console.log('env.REGION - [CHEGOU NO LOAD_ENVS] - ', env.REGION)
    console.log('this.stage - [CHEGOU NO LOAD_ENVS] - ', this.stage)
    console.log('this.DYNAMOTABLENAME - [CHEGOU NO LOAD_ENVS] - ', this.dynamoTableName)
    this.mssName = env.MSS_NAME as string

    if (this.stage === STAGE.TEST) {
      this.s3BucketName = 'bucket-test'
      this.region = 'sa-east-1'
      this.endpointUrl = 'http://localhost:8000'
      this.dynamoTableName = 'UserMssTemplateTable'
      this.dynamoPartitionKey = 'PK'
      this.dynamoSortKey = 'SK'
      this.cloudFrontGetUserPresenterDistributionDomain = 'https://d3q9q9q9q9q9q9.cloudfront.net'
    } else {
      this.s3BucketName = env.S3_BUCKET_NAME as string
      this.region = env.REGION 
      this.endpointUrl = env.ENDPOINT_URL 
      this.dynamoTableName = env.DYNAMO_TABLE_NAME 
      this.dynamoProductsTableName = env.DYNAMO_PRODUCTS_TABLE_NAME 
      this.dynamoPartitionKey = env.DYNAMO_PARTITION_KEY 
      this.dynamoSortKey = env.DYNAMO_SORT_KEY 
      this.cloudFrontGetUserPresenterDistributionDomain = env.CLOUD_FRONT_DISTRIBUTION_DOMAIN as string

      console.log('this.region - [CHEGOU NO LOAD_ENVS] - ', this.region)
      console.log('this.dynamoTableName - [CHEGOU NO LOAD_ENVS] - ', this.dynamoTableName)
      console.log('this.dynamoProductsTableName - [CHEGOU NO LOAD_ENVS] - ', this.dynamoProductsTableName)
      console.log('this.dynamoPartitionKey - [CHEGOU NO LOAD_ENVS] - ', this.dynamoPartitionKey)
      console.log('this.dynamoSortKey - [CHEGOU NO LOAD_ENVS] - ', this.dynamoSortKey)
      console.log('this.cloudFrontGetUserPresenterDistributionDomain - [CHEGOU NO LOAD_ENVS] - ', this.cloudFrontGetUserPresenterDistributionDomain)
    }
  }

  static getUserRepo(): IUserRepository {
    console.log('Environments.getEnvs().stage - [ENVIRONMENTS - { GET USER REPO }] - ', Environments.getEnvs().stage)

    if (Environments.getEnvs().stage === STAGE.TEST) {
      throw new Error('Invalid STAGE')
    } else if (Environments.getEnvs().stage === STAGE.DEV || Environments.getEnvs().stage === STAGE.PROD) {
      return new UserRepositoryDynamo()
    } else {
      throw new Error('Invalid STAGE')
    }
  }

  static getProductRepo(): IProductRepository {
    console.log('Environments.getEnvs().stage - [ENVIRONMENTS - { GET PRODUCT REPO }] - ', Environments.getEnvs().stage)

    if (Environments.getEnvs().stage === STAGE.TEST) {
      return new ProductRepositoryMock()
    } else if (Environments.getEnvs().stage === STAGE.DEV || Environments.getEnvs().stage === STAGE.PROD) {
      return new ProductRepositoryDynamo()
    } else {
      throw new Error('Invalid STAGE')
    }
  }

  static getEnvs() {
    const envs = new Environments()
    envs.loadEnvs()

    console.log('envs - [ENVIRONMENTS - { GET ENVS }] - ', envs)
    return envs
  }
}
