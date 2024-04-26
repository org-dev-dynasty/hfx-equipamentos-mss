/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MissingParameters,
  WrongTypeParameters,
} from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import {
  ConflictItems,
  ForbiddenAction,
  NoItemsFound,
} from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import {
  BadRequest,
  Created,
  InternalServerError,
  NotFound,
  Unauthorized,
} from '../../../shared/helpers/external_interfaces/http_codes'
import { CreateProductUsecase } from './create_product_usecase'
import { CreateProductViewModel } from './create_product_viewmodel'

export class CreateProductController {
  constructor(private usecase: CreateProductUsecase) {}

  async handle(request: IRequest) {
    try {
      let name = ''
      let description = ''
      let littleDescription: string[] = []
      let models: string[] = []
      let categories: string[] = []
      let attributes: Record<string, any>[] = []
      const videos: string[] = []

      if (request.data.name === undefined) {
        throw new MissingParameters('name')
      }
      if (request.data.description === undefined) {
        throw new MissingParameters('description')
      }
      if (typeof request.data.name !== 'string') {
        throw new WrongTypeParameters(
          'name',
          'string',
          typeof request.data.name,
        )
      }
      name = request.data.name
      if (typeof request.data.description !== 'string') {
        throw new WrongTypeParameters(
          'description',
          'string',
          typeof request.data.description,
        )
      }
      description = request.data.description
      if (request.data.littleDescription !== undefined && typeof request.data.littleDescription === 'string') {
        littleDescription = JSON.parse(request.data.littleDescription) as string[]
        if (!Array.isArray(littleDescription)) {
          throw new WrongTypeParameters(
            'littleDescription',
            'array',
            typeof littleDescription,
          )
        }
        if (littleDescription.length === 0) {
          throw new EntityError('littleDescription')
        }
      }
      if (request.data.models !== undefined && typeof request.data.models === 'string') {
        models = JSON.parse(request.data.models) as string[]
        if (!Array.isArray(models)) {
          throw new WrongTypeParameters(
            'models',
            'array',
            typeof models,
          )
        }
        if (models.length === 0) {
          throw new EntityError('models')
        }
        models.map((model) => {
          if (typeof model !== 'string') {
            throw new WrongTypeParameters(
              'models',
              'array of strings',
              typeof model,
            )
          }
        })
      }
      if (request.data.categories !== undefined && typeof request.data.categories === 'string') {
        categories = JSON.parse(request.data.categories) as string[]
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
        categories.map((category) => {
          if (typeof category !== 'string') {
            throw new WrongTypeParameters(
              'categories',
              'array of strings',
              typeof category,
            )
          }
        })
      }
      if (request.data.attributes !== undefined && typeof request.data.attributes === 'string') {
        console.log('LOG ADICIONADO AQUI - [ATTRIBUTES] !!!! ->>> ', request.data.attributes)
        attributes = JSON.parse(request.data.attributes) as Record<string, any>[]
        if (!Array.isArray(request.data.attributes)) {
          throw new WrongTypeParameters(
            'attributes',
            'array',
            typeof attributes,
          )
        }
        if (attributes.length === 0) {
          throw new EntityError('attributes')
        }
        attributes.map((attribute) => {
          if (typeof attribute !== 'object') {
            throw new WrongTypeParameters(
              'attributes',
              'array of objects',
              typeof attribute,
            )
          }
        })
      }

      if (request.data.videos !== undefined) {
        if (!Array.isArray(request.data.videos)) {
          throw new WrongTypeParameters(
            'videos',
            'array',
            typeof request.data.videos,
          )
        }
        request.data.videos.map((video) => {
          if (typeof video !== 'string') {
            throw new WrongTypeParameters(
              'videos',
              'array of strings',
              typeof video,
            )
          }
        })
        if (request.data.videos.length === 0) {
          throw new EntityError('videos')
        }
      }

      const product = await this.usecase.execute(
        name,
        description,
        littleDescription,
        models,
        categories,
        attributes,
        videos,
      )

      const viewModel = new CreateProductViewModel(product)

      return new Created(viewModel.toJSON())
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
      if (error instanceof ConflictItems) {
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
