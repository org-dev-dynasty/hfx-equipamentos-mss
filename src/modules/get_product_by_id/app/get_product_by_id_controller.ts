import { InvalidRequest } from '../../../shared/helpers/errors/ModuleError'
import {
  MissingParameters,
  WrongTypeParameters,
} from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from '../../../shared/helpers/external_interfaces/http_codes'
import { HttpRequest } from '../../../shared/helpers/external_interfaces/http_models'
import { GetProductByIdUsecase } from './get_product_by_id_usecase'
import { GetProductByIdViewModel } from './get_product_by_id_viewmodel'

export class GetProductByIdController {
  public usecase: GetProductByIdUsecase

  constructor(usecase: GetProductByIdUsecase) {
    this.usecase = usecase
  }

  public async handle(request: HttpRequest) {
    try {
      if (!request) {
        throw new InvalidRequest()
      }
      const id = request.data.id

      if (!id) {
        throw new MissingParameters('id')
      }
      if (typeof id !== 'string') {
        throw new WrongTypeParameters('id', typeof id, 'string')
      }

      const response = await this.usecase.execute(id)
      const viewmodel = new GetProductByIdViewModel(response)
      return new OK(viewmodel.toJSON())

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message)
      }
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters ||
        error instanceof EntityError
      ) {
        return new BadRequest(error.message)
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message)
      }
    }
  }
}
