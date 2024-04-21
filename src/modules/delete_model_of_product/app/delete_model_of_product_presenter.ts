/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Environments } from '../../../shared/environments'
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { DeleteModelOfProductController } from './delete_model_of_product_controller'
import { DeleteModelOfProductUsecase } from './delete_model_of_product_usecase'

const repo = Environments.getProductRepo()
const usecase = new DeleteModelOfProductUsecase(repo)
const controller = new DeleteModelOfProductController(usecase)

export async function DeleteModelOfProductPresenter(event: Record<string, any>) {
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
  const response = await DeleteModelOfProductPresenter(event)
  return response
}
