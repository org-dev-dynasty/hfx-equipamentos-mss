/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MissingParameters,
  WrongTypeParameters,
} from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { ConflictItems, NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from '../../../shared/helpers/external_interfaces/http_codes'
import { UpdateProductUsecase } from './update_product_usecase'
import { UpdateProductViewModel } from './update_product_viewmodel'
import Busboy from 'busboy'

export class UpdateProductController {
  constructor(private readonly usecase: UpdateProductUsecase) {}

  async handle(request: Record<string, any>) {
    try {
      if (request.data.id === undefined) {
        throw new MissingParameters('id')
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
      
      if (request.data.description && typeof request.data.description !== 'string') {
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
      
      const models: string[] = []
      if (
        request.data.models !== undefined &&
        request.data.models !== null // Verificação adicionada para null
      ) {
        if (typeof request.data.models === 'string') {
          models.push(JSON.parse(request.data.models as string))
        } else {
          throw new WrongTypeParameters(
            'models',
            'string',
            typeof request.data.models,
          )
        }
        // Restante do seu código de verificação...
      }
      console.log('[Após if models]')
      const categories: string[] = []
      if (request.data.categories !== undefined) {
        categories.push(JSON.parse(request.data.categories as string))
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
      console.log('[Após if categories]')
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
      
      console.log('[Após if attributes]')
      const videos: string[] = []
      if (request.data.videos !== undefined && request.data.videos !== null) {
        videos.push(JSON.parse(request.data.videos as string))
        if (!Array.isArray(videos)) {
          throw new WrongTypeParameters(
            'videos',
            'array',
            typeof request.data.videos,
          )
        }
        if (videos.length === 0) {
          throw new EntityError('videos')
        }
        if (
          !videos.every(
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
        request.data.name,
        request.data.description,
        models,
        categories,
        request.data.attributes,
        videos,
      )
      const viewmodel = new UpdateProductViewModel(updatedProduct)
      console.log('[Após if videos]')
      
      console.log('[UPDATE PRODUCT CONTROLLER] request.data.models', request.data.models)
      console.log('[UPDATE PRODUCT CONTROLLER] request.data.categories', request.data.categories)
      console.log('[UPDATE PRODUCT CONTROLLER] request.data.attributes', request.data.attributes)
      
      return new OK(viewmodel.toJSON())
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message)
      }
      if (
        error instanceof MissingParameters ||
        error instanceof WrongTypeParameters ||
        error instanceof EntityError ||
        error instanceof ConflictItems
      ) {
        return new BadRequest(error.message)
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message)
      }
    }
  }
}
