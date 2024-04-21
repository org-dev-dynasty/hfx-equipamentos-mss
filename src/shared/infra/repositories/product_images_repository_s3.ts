/* eslint-disable @typescript-eslint/no-unused-vars */
import { S3 } from 'aws-sdk'
import env from '../../../..'

export class ImageRepositoryS3 {
  private s3: S3

  constructor() {
    this.s3 = new S3({
      region: env.REGION,
    })
  }

  // Método para fazer upload de uma imagem
  async uploadImage(_file: File): Promise<string> {
    // const params = {
    //   Bucket: env.S3_BUCKET_NAME,
    //   Key: `images/${file.originalname}`,
    //   Body: file.buffer,
    //   ContentType: file.mimetype,
    //   ACL: 'public-read', // ou use 'private' para restringir o acesso
    // }
    throw new Error('Not implemented yet')

    // const uploadResult = await this.s3.upload(params).promise()
    // return uploadResult.Location // Retorna a URL da imagem no S3
  }

  async listImageUrls(): Promise<string[]> {
    const params = {
      Bucket: env.S3_BUCKET_NAME as string,
    }

    const s3Objects = await this.s3.listObjectsV2(params).promise()

    // Constrói a URL da imagem baseada no nome do arquivo retornado
    const imageUrls = s3Objects.Contents?.map(s3Object => 
      `https://${params.Bucket}.s3.${this.s3.config.region}.amazonaws.com/${s3Object.Key}`
    ) || []

    return imageUrls
  }

  // Método para gerar uma URL pré-assinada para download de uma imagem
  async downloadImage(imageKey: string): Promise<string> {
    const params = {
      Bucket: env.S3_BUCKET_NAME,
      Key: imageKey,
      Expires: 60 * 5 // URL válida por 5 minutos, por exemplo
    }

    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('getObject', params, (error, url) => {
        if (error) {
          reject(error)
        } else {
          resolve(url)
        }
      })
    })
  }
}