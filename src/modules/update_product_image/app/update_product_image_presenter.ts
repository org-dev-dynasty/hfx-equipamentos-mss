/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Environments } from '../../../shared/environments'
import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { UpdateProductImageController } from './update_product_image_controller'
import { UpdateProductImageUsecase } from './update_product_image_usecase'


const repo = Environments.getProductRepo()
const usecase = new UpdateProductImageUsecase(repo)
const controller = new UpdateProductImageController(usecase)

export async function updateProductImagePresenter(event: Record<string, any>) {
  const httpRequest = new LambdaHttpRequest(event)
  const response = await controller.handle(event)
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.body.queryStringParameters,
  )

  return httpResponse.toJSON()
}

export async function handler(event: any, context: any) {
  const response = await updateProductImagePresenter(event)
  return response
}
