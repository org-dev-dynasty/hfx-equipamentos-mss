/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Environments } from '../../../shared/environments'
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { GetAllProductsController } from './get_all_products_controller'
import { GetAllProductsUsecase } from './get_all_products_usecase'

const repo = Environments.getProductRepo()
const usecase = new GetAllProductsUsecase(repo)
const controller = new GetAllProductsController(usecase)

export async function getAllProductsPresenter(event: Record<string, any>) {
  const httpRequest = new LambdaHttpRequest(event)
  const response = await controller.handle(httpRequest)
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers,
  )

  return httpResponse.toJSON()
}

export async function handler(event: any, context: any) {
  const response = await getAllProductsPresenter(event)
  return response
}
