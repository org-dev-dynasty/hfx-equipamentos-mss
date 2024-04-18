/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingParameters, WrongTypeParameters } from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { ForbiddenAction, NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { BadRequest, InternalServerError, NotFound, Unauthorized } from '../../../shared/helpers/external_interfaces/http_codes'
import { CreateProductUsecase } from './create_product_usecase'

export class CreateProductController {
  constructor(private usecase: CreateProductUsecase) {}

  async handle(request: IRequest) {
    try {
      if (request.data.id === undefined) {
        throw new MissingParameters('id')
      }
      if (request.data.name === undefined) {
        throw new MissingParameters('name')
      }
      if (request.data.description === undefined) {
        throw new MissingParameters('description')
      }
      if (request.data.models !== undefined) {
        if (!Array.isArray(request.data.models)) {
          throw new WrongTypeParameters('models', 'array', typeof request.data.models)
        }
        request.data.models.forEach((model: any) => {})
      }
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message)
      }
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message)
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message)
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message)
      }
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message as any)
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message)
      }
    }
  }
}