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

  async parseMultipartFormData(request: Record<string, any>) {
    const contentType = request.headers['content-type'] || request.headers['Content-Type']
    const busboy = Busboy({ headers: { 'content-type': contentType } })
    const result: Record<string, any> = {
      files: [],
      fields: {},
    }
  
    return new Promise((resolve, reject) => {
      busboy.on('file', (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
        console.log(`Recebendo arquivo: ${fieldname}`)
        const fileChunks: Buffer[] = []
        file.on('data', (data: Buffer) => {
          fileChunks.push(data)
        }).on('end', () => {
          console.log(`Arquivo recebido: ${fieldname}`)
          result.files.push({
            fieldname,
            filename,
            encoding,
            mimetype,
            data: Buffer.concat(fileChunks),
          })
        })
      })
  
      busboy.on('field', (fieldname: any, val: any) => {
        console.log(`Recebendo campo: ${fieldname}`)
        result.fields[fieldname] = val
      })
  
      busboy.on('finish', () => {
        console.log('Parse do form-data finalizado')
        resolve(result)
      })
  
      busboy.on('error', (error: any) => {
        console.log('Erro no parse do form-data:', error)
        reject(error)
      })
  
      // Inicia o parsing passando o corpo da requisição
      busboy.write(request.body, request.isBase64Encoded ? 'base64' : 'binary')
      busboy.end()
    })
  }

  async handle(request: Record<string, any>) {
    const formData = await this.parseMultipartFormData(request)

    console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] formData', formData)

    console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] request', request)
    const contentType = request.headers['content-type'] || request.headers['Content-Type']
    
    console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] contentType', contentType)

    const requestBody = Buffer.from(request.body, 'base64')
    console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] requestBody', requestBody)

    const busboy = Busboy({ headers: { 'content-type': contentType } })

    console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] busboy', busboy)
    const result: Record<string, any> = {
      files: [],
      fields: {},
    }
    console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] result', result)
    
    
    try {
      console.log('vai entrar no busboy')
      const parseForm = await new Promise((resolve, reject) => {
        busboy.on('file', (_fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
          console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] file', file)
          console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] filename', filename)
          console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] encoding', encoding)
          console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] mimetype', mimetype)
          const fileChunks: any[] = []
          file.on('data', (data: any) => {
            console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] data', data)
            fileChunks.push(data)
          }).on('end', () => {
            result.files.push({
              filename,
              encoding,
              mimetype,
              data: Buffer.concat(fileChunks), // Combine all the chunks
            })
          })
        })
        busboy.on('field', (fieldname: any, val: any) => {
          console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] fieldname', fieldname)
          console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] val', val)
          result.fields[fieldname] = val
        })
        busboy.on('finish', () => {
          console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] finish')
          resolve(result)
        })
        busboy.on('error', (error: any) => {
          console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] error', error)
          reject(error)
        })
        
      })

      console.log('[UPLOAD PRODUCT IMAGE CONTROLLER] parseForm', parseForm)
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