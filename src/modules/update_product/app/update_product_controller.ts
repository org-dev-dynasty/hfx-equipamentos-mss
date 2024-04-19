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
import { UpdateProductUsecase } from './update_product_usecase'
import { UpdateProductViewModel } from './update_product_viewmodel'

export class UpdateProductController {
  constructor(private readonly usecase: UpdateProductUsecase) {}

  async handle(request: IRequest) {
    try {
      if (request.data.id === undefined) {
        throw new EntityError('id')
      }

      if (typeof request.data.id !== 'string') {
        throw new WrongTypeParameters('id', 'string', typeof request.data.id)
      }

      if (request.data.name && typeof request.data.name !== 'string') {
        throw new WrongTypeParameters(
          'name',
          'string',
          typeof request.data.name,
        )
      }

      if (
        request.data.description &&
        typeof request.data.description !== 'string'
      ) {
        throw new WrongTypeParameters(
          'description',
          'string',
          typeof request.data.description,
        )
      }

      console.log(
        '[UPDATE PRODUCT CONTROLLER] request.data.models',
        typeof request.data.models,
      )

      if (
        request.data.models !== undefined &&
        request.data.models !== null && // Verificação adicionada para null
        Array.isArray(request.data.models)
      ) {
        console.log('Antes do length', request.data.models.length)
        // Restante do seu código de verificação...
      }
      const categories: string[] = JSON.parse(request.data.categories as string)
      if (categories !== undefined) {
        if (!Array.isArray(categories)) {
          throw new WrongTypeParameters(
            'categories',
            'array',
            typeof categories,
          )
        }
        if (categories.length === 0) {
          throw new EntityError('categories')
        }
        if (
          !categories.every(
            (category: string) => typeof category === 'string',
          )
        ) {
          throw new WrongTypeParameters(
            'categories',
            'array of strings',
            typeof categories,
          )
        }
      }
      console.log('pssou aqui')
      if (request.data.attributes !== undefined) {
        if (!Array.isArray(request.data.attributes)) {
          throw new WrongTypeParameters(
            'attributes',
            'array',
            typeof request.data.attributes,
          )
        }
        if (request.data.attributes.length === 0) {
          throw new EntityError('attributes')
        }
        if (
          !request.data.attributes.every(
            (attribute: Record<string, any>) => typeof attribute === 'object',
          )
        ) {
          throw new WrongTypeParameters(
            'attributes',
            'array of objects',
            typeof request.data.attributes,
          )
        }
      }

      console.log('pssou aqui 2')
      if (request.data.videos !== undefined) {
        if (!Array.isArray(request.data.videos)) {
          throw new WrongTypeParameters(
            'videos',
            'array',
            typeof request.data.videos,
          )
        }
        if (request.data.videos.length === 0) {
          throw new EntityError('videos')
        }
        if (
          !request.data.videos.every(
            (video: string) => typeof video === 'string',
          )
        ) {
          throw new WrongTypeParameters(
            'videos',
            'array of strings',
            typeof request.data.videos,
          )
        }
      }

      const updatedProduct = await this.usecase.execute(
        request.data.id,
        request.data.name ? (request.data.name as string) : undefined,
        request.data.description
          ? (request.data.description as string)
          : undefined,
        request.data.models as string[] | undefined,
        categories,
        request.data.attributes,
        request.data.videos,
      )

      const viewmodel = new UpdateProductViewModel(updatedProduct)

      return new OK(viewmodel.toJSON())
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
