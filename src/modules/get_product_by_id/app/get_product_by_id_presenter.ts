/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Environments } from '../../../shared/environments'
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { GetProductByIdController } from './get_product_by_id_controller'
import { GetProductByIdUsecase } from './get_product_by_id_usecase'

const repo = Environments.getProductRepo()
const usecase = new GetProductByIdUsecase(repo)
const controller = new GetProductByIdController(usecase)

export async function GetProductByIdPresenter(event: Record<string, any>) {
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
  const response = await GetProductByIdPresenter(event)
  return response
}
