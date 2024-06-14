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
      const littleDescription: string[] = []
      const models: string[] = []
      const categories: string[] = []
      const attributes: Record<string, any>[] = []
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
      if (request.data.littleDescription !== undefined) {
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
        littleDescription.map((little) => {
          if (typeof little !== 'string') {
            throw new WrongTypeParameters(
              'littleDescription',
              'array of strings',
              typeof little,
            )
          }
        })

        littleDescription.push(...request.data.littleDescription as string[])
      }
      if (request.data.models !== undefined) {
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
        models.push(...request.data.models as string[])
      }
      if (request.data.categories !== undefined) {
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

        categories.push(...request.data.categories as string[])
      }
      if (request.data.attributes !== undefined) {
        console.log('LOG ADICIONADO AQUI - [ATTRIBUTES] !!!! ->>> ', request.data.attributes)
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
        request.data.attributes.map((attribute) => {
          if (typeof attribute !== 'object') {
            throw new WrongTypeParameters(
              'attributes',
              'array of objects',
              typeof attribute,
            )
          }
        })
        attributes.push(...request.data.attributes as Record<string, any>[])
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
        videos.push(...request.data.videos)
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
