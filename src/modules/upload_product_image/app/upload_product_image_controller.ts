/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingParameters, WrongTypeParameters } from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
// import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { BadRequest, InternalServerError, NotFound, OK } from '../../../shared/helpers/external_interfaces/http_codes'
import { UploadProductImageUsecase } from './upload_product_image_usecase'
import  Busboy  from 'busboy'
import { UploadProductImageViewModel } from './upload_product_image_viewmodel'

export class UploadProductImageController {
  constructor(private readonly usecase: UploadProductImageUsecase) {}

  async parseMultipartFormData(request: Record<string, any>): Promise<Record<string, any>>{
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
    
    try {
      if (formData.fields.productId === undefined) {
        throw new MissingParameters('productId')
      }
      if (formData.files.length === 0) {
        throw new MissingParameters('image')
      }

      const productId = formData.fields.productId
      const isModel = formData.fields.isModel

      const imagesData = formData.files.map((file: any) => {
        return file.data
      }) as Buffer[]

      const fieldNames = formData.files.map((file: any) => {
        return file.fieldname
      }) as string[]

      const product = await this.usecase.execute(productId, imagesData, fieldNames, isModel)

      const viewmodel = new UploadProductImageViewModel(product)

      return new OK(viewmodel.toJSON())
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