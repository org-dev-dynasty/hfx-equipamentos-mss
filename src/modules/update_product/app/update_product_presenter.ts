/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Environments } from '../../../shared/environments'
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { UpdateProductController } from './update_product_controller'
import { UpdateProductUsecase } from './update_product_usecase'

const repo = Environments.getProductRepo()
const usecase = new UpdateProductUsecase(repo)
const controller = new UpdateProductController(usecase)

export async function updateProductPresenter(event: Record<string, any>) {
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
  const response = await updateProductPresenter(event)
  return response
}
