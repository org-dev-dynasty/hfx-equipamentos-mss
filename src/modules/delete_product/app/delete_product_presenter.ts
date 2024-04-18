/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Environments } from '../../../shared/environments'
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { DeleteProductController } from './delete_product_controller'
import { DeleteProductUsecase } from './delete_product_usecase'

const repo = Environments.getProductRepo()
const usecase = new DeleteProductUsecase(repo)
const controller = new DeleteProductController(usecase)

export async function DeleteProductPresenter(event: Record<string, any>) {
  const httpRequest = new LambdaHttpRequest(event)
  const response = await controller.handle(httpRequest)
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.body.queryStringParameters,
  )

  return httpResponse.toJSON()
}

export async function handler(event: any, context: any) {
  const response = await DeleteProductPresenter(event)
  return response
}
