import {
  LambdaHttpRequest,
  LambdaHttpResponse,
} from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { Environments } from '../../../shared/environments'
import { LoginController } from './login_controller'
import { LoginUsecase } from './login_usecase'

const repo = Environments.getUserRepo()
const usecase = new LoginUsecase(repo)
const controller = new LoginController(usecase)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loginPresenter(event: Record<string, any>) {
  const httpRequest = new LambdaHttpRequest(event)
  const response = await controller.handle(httpRequest)
  const httpResponse = new LambdaHttpResponse(
    response?.body,
    response?.statusCode,
    response?.headers,
  )

  return httpResponse.toJSON()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handler(event: any) {
  const response = await loginPresenter(event)
  return response
}
