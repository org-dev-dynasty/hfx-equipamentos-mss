/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MissingParameters,
  WrongTypeParameters,
} from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from '../../../shared/helpers/external_interfaces/http_codes'
import { DeleteModelOfProductUsecase } from './delete_model_of_product_usecase'
import { DeleteModelOfProductViewModel } from './delete_model_of_product_viewmodel'

export class DeleteModelOfProductController {
  constructor(private readonly usecase: DeleteModelOfProductUsecase) {}

  async handle(request: IRequest) {
    try {
      if (!request.data.productId || !request.data.modelId) {
        throw new MissingParameters('productId and modelId are required')
      }

      if (typeof request.data.productId !== 'string') {
        throw new WrongTypeParameters(
          'productId',
          'string',
          typeof request.data.productId,
        )
      }

      if (typeof request.data.modelId !== 'string') {
        throw new WrongTypeParameters(
          'modelId',
          'string',
          typeof request.data.modelId,
        )
      }

      const updatedProduct = await this.usecase.execute(
        request.data.productId,
        request.data.modelId,
      )
      const viewmodel = new DeleteModelOfProductViewModel(updatedProduct)

      return new OK(viewmodel.toJSON())
    } catch (error: any) {
      if (error instanceof NoItemsFound || error instanceof EntityError) {
        return new NotFound(error.message)
      }
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters
      ) {
        return new BadRequest(error.message)
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message)
      }
    }
  }
}
