/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingParameters, WrongTypeParameters } from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
// import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { BadRequest, InternalServerError, NotFound, OK } from '../../../shared/helpers/external_interfaces/http_codes'
import { UploadProductImageUsecase } from './upload_product_image_usecase'
import  Busboy  from 'busboy'

export class UploadProductImageController {
  constructor(private readonly usecase: UploadProductImageUsecase) {}

  async handle(request: Record<string, any>) {
    console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] request', request)
    const contentType = request.headers['content-type'] || request.headers['Content-Type']
    console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] contentType', contentType)
    const body = {
      'content-type': contentType,
    }
    const busboy = Busboy({ headers: body })

    console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] busboy', busboy)
    const result = {
      files: [],
      fields: {},
    }

    busboy.on('file', (_fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
      console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] file', file)
      console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] filename', filename)
      console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] encoding', encoding)
      console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] mimetype', mimetype)
      file.on('data', (data: any) => {
        console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] data', data)
        // result.files.push(data)
      })
    })
    console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] result', result)


    try {
      console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] request.data.body', request.data.body)
      console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] formData', request.data.body)
      // console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] formDataRequest', formDataRequest)
      // const productId = formDataRequest.get('productId')?.toString() as string
      // console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] productId', productId)
      const productId = request.data.productId as string
      if (request.data.productId === undefined) {
        throw new MissingParameters('productId')
      }

      if (typeof request.data.productId !== 'string') {
        throw new WrongTypeParameters('productId', 'string', typeof request.data.productId)
      }

      if (request.data.image === undefined) {
        throw new MissingParameters('image')
      }

      if (typeof request.data.image !== 'string') {
        throw new WrongTypeParameters('image', 'string', typeof request.data.image)
      }
      const image = request.data.image

      await this.usecase.execute(productId, image)

      return new OK('Image uploaded successfully')
    } catch (error: any) {
      if (error instanceof EntityError) {
        return new BadRequest(error.message)
      }
      if (error instanceof NoItemsFound) {
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