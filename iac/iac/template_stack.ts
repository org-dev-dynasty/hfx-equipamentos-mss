import { Stack, StackProps } from 'aws-cdk-lib'
import { Cors, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'
import { TemplateDynamoTable } from './template_dynamo_table'
import { LambdaStack } from './lambda_stack'
import env from '../../index'

export class TemplateStack extends Stack {
  constructor(scope: Construct, constructId: string, props?: StackProps) {
    super(scope, constructId, props)

    const restApi = new RestApi(this, 'HfxMss_RestApi', {
      restApiName: 'HfxMss_RestApi',
      description: 'This is the backend for Hfx Equipamentos',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowHeaders: ['*']
      }
    })

    const apigatewayResource = restApi.root.addResource('mss-hfx', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowHeaders: Cors.DEFAULT_HEADERS
      }
    })

    const dynamoTable = new TemplateDynamoTable(this, 'HfxMssTable', env.DYNAMO_TABLE_NAME)
    
    const dynamoProductsTable = new TemplateDynamoTable(this, 'HfxMssProductsTable', env.DYNAMO_PRODUCTS_TABLE_NAME)

    const ENVIRONMENT_VARIABLES = {
      'STAGE': env.STAGE,
      'DYNAMO_TABLE_NAME': env.DYNAMO_TABLE_NAME,
      'DYNAMO_PRODUCTS_TABLE_NAME': env.DYNAMO_PRODUCTS_TABLE_NAME,
      'DYNAMO_PARTITION_KEY': 'PK',
      'DYNAMO_SORT_KEY': 'SK',
      'REGION': env.REGION,
      'ENDPOINT_URL': env.ENDPOINT_URL,
      'JWT_SECRET': env.JWT_SECRET
    }

    const lambdaStack = new LambdaStack(this, apigatewayResource, ENVIRONMENT_VARIABLES)

    dynamoTable.table.grantReadWriteData(lambdaStack.loginFunction)
    dynamoProductsTable.table.grantReadWriteData(lambdaStack.getAllProductsFunction)
    dynamoProductsTable.table.grantReadWriteData(lambdaStack.getProductByIdFunction)
    dynamoProductsTable.table.grantReadWriteData(lambdaStack.createProductFunction)
    dynamoProductsTable.table.grantReadWriteData(lambdaStack.updateProductFunction)
    dynamoProductsTable.table.grantReadWriteData(lambdaStack.deleteProductFunction)
  }
}