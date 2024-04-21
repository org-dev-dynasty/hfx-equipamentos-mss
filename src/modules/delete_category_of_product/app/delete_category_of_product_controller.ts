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
import { DeleteCategoryOfProductUsecase } from './delete_category_of_product_usecase'
import { DeleteCategoryOfProductViewModel } from './delete_category_of_product_viewmodel'

export class DeleteCategoryOfProductController {
  constructor(private readonly usecase: DeleteCategoryOfProductUsecase) {}

  async handle(request: IRequest) {
    try {
      if (!request.data.productId || !request.data.categoryId) {
        throw new MissingParameters('productId and categoryId are required')
      }

      if (typeof request.data.productId !== 'string') {
        throw new WrongTypeParameters(
          'productId',
          'string',
          typeof request.data.productId,
        )
      }

      if (typeof request.data.categoryId !== 'string') {
        throw new WrongTypeParameters(
          'categoryId',
          'string',
          typeof request.data.modelId,
        )
      }

      const updatedProduct = await this.usecase.execute(
        request.data.productId,
        request.data.categoryId,
      )
      const viewmodel = new DeleteCategoryOfProductViewModel(updatedProduct)

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
