/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Environments } from '../../../shared/environments'
import { LambdaHttpRequest, LambdaHttpResponse } from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { UploadProductImageController } from './upload_product_image_controller'
import { UploadProductImageUsecase } from './upload_product_image_usecase'


const repo = Environments.getProductRepo()
const usecase = new UploadProductImageUsecase(repo)
const controller = new UploadProductImageController(usecase)

export async function uploadProductImagePresenter(event: Record<string, any>) {
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
  console.log('[UPLOAD PRODUCT IMAGE PRESENTER] event', event)
  const response = await uploadProductImagePresenter(event)
  return response
}