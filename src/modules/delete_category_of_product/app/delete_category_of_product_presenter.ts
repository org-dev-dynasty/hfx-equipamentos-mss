/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Environments } from '../../../shared/environments'
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { DeleteCategoryOfProductController } from './delete_category_of_product_controller'
import { DeleteCategoryOfProductUsecase } from './delete_category_of_product_usecase'

const repo = Environments.getProductRepo()
const usecase = new DeleteCategoryOfProductUsecase(repo)
const controller = new DeleteCategoryOfProductController(usecase)

export async function DeleteCategoryOfProductPresenter(event: Record<string, any>) {
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
  const response = await DeleteCategoryOfProductPresenter(event)
  return response
}
