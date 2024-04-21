/* eslint-disable @typescript-eslint/no-explicit-any */
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Resource, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import { Duration } from 'aws-cdk-lib'
import * as path from 'path'

export class LambdaStack extends Construct {
  functionsThatNeedDynamoPermissions: lambda.Function[] = []
  lambdaLayer: lambda.LayerVersion

  loginFunction: lambda.Function
  getAllProductsFunction: lambda.Function
  getProductByIdFunction: lambda.Function
  createProductFunction: lambda.Function
  updateProductFunction: lambda.Function
  deleteProductFunction: lambda.Function
  deleteModelOfProductFunction: lambda.Function
  uploadProductImageFunction: lambda.Function

  createLambdaApiGatewayIntegration(moduleName: string, method: string, mssStudentApiResource: Resource, environmentVariables: Record<string, any>) {
    const modifiedModuleName = moduleName.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    
    const lambdaFunction = new NodejsFunction(this, modifiedModuleName, {
      functionName: `${modifiedModuleName}`,
      entry: path.join(__dirname, `../../src/modules/${moduleName}/app/${moduleName}_presenter.ts`),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      layers: [this.lambdaLayer],
      environment: environmentVariables,
      timeout: Duration.seconds(15),
      memorySize: 512
    })

    mssStudentApiResource.addResource(moduleName.replace(/_/g,'-')).addMethod(method, new LambdaIntegration(lambdaFunction))
    
    return lambdaFunction
  }

  constructor(scope: Construct, apiGatewayResource: Resource, environmentVariables: Record<string, any>) {
    super(scope, 'HfxLambdaStack')

    this.lambdaLayer = new lambda.LayerVersion(this, 'HfxMss_Layer', {
      code: lambda.Code.fromAsset('./shared'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
    })

    this.loginFunction = this.createLambdaApiGatewayIntegration('login', 'POST', apiGatewayResource, environmentVariables)
    this.getAllProductsFunction = this.createLambdaApiGatewayIntegration('get_all_products', 'GET', apiGatewayResource, environmentVariables)
    this.getProductByIdFunction = this.createLambdaApiGatewayIntegration('get_product_by_id', 'GET', apiGatewayResource, environmentVariables)
    this.createProductFunction = this.createLambdaApiGatewayIntegration('create_product', 'POST', apiGatewayResource, environmentVariables)
    this.updateProductFunction = this.createLambdaApiGatewayIntegration('update_product', 'PUT', apiGatewayResource, environmentVariables)
    this.deleteProductFunction = this.createLambdaApiGatewayIntegration('delete_product', 'DELETE', apiGatewayResource, environmentVariables)
    this.deleteModelOfProductFunction = this.createLambdaApiGatewayIntegration('delete_model_of_product', 'DELETE', apiGatewayResource, environmentVariables)
    this.uploadProductImageFunction = this.createLambdaApiGatewayIntegration('upload_product_image', 'POST', apiGatewayResource, environmentVariables)

    this.functionsThatNeedDynamoPermissions = [
      this.loginFunction,
      this.getAllProductsFunction,
      this.getProductByIdFunction,
      this.createProductFunction,
      this.updateProductFunction,
      this.deleteProductFunction,
      this.deleteModelOfProductFunction
    ]
  }
}