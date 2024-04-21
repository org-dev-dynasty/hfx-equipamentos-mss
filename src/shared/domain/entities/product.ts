/* eslint-disable @typescript-eslint/no-explicit-any */

import { EntityError } from '../../helpers/errors/domain_errors'

export type ProductProps = {
  id: string
  name: string
  description: string
  // models será um array de strings, essas strings terão esse formato: "nome_do_modelo#id_do_produto"
  // const id = models.split('#')[1]
  models?: string[] | null
  categories?: string[] | null
  attributes?: Record<string, any>[] | null
  // If models is !== undefined, first element of an attribute will be the modelId
  // If models is === undefined, first element of an attribute will be the categoryId
  /* [
    { 
      "modelId" : "uuid" ,
      "nome_do_atributo" : "valor_do_atributo"
      "nome_do_atributo" : "valor_do_atributo"
      "nome_do_atributo" : "valor_do_atributo"
      "nome_do_atributo" : "valor_do_atributo"
      "nome_do_atributo" : "valor_do_atributo"
      "nome_do_atributo" : "valor_do_atributo"
    }
  ] 

  */
  videos?: string[] | null
}

export class Product {
  constructor(private props: ProductProps) {
    // if (!Product.validateId(props.id)) {
    //   throw new EntityError('props.id')
    // }
    this.props.id = props.id

    if (!Product.validateName(props.name)) {
      throw new EntityError('props.name')
    }
    this.props.name = props.name

    if (!Product.validateDescription(props.description)) {
      throw new EntityError('props.description')
    }
    this.props.description = props.description

    // if (props.models !== undefined && props.models !== null) {
    //   if (!Product.validateModel(props.models)) {
    //     throw new EntityError('props.models')
    //   }
    //   this.props.models = props.models
    // }

    if (props.categories !== undefined && props.categories !== null) {
      if (!Product.validateCategory(props.categories)) {
        throw new EntityError('props.categories')
      }
      this.props.categories = props.categories
    }

    // if (props.attributes !== undefined && props.attributes !== null) {
    //   if (!Product.validateAttributes(props.attributes)) {
    //     throw new EntityError('props.attributes')
    //   }
    //   this.props.attributes = props.attributes
    // }

    if (props.videos !== undefined && props.videos !== null) {
      if (!Product.validateVideos(props.videos)) {
        throw new EntityError('props.videos')
      }
      this.props.videos = props.videos
    }
  }

  get id() {
    return this.props.id
  }

  set setId(id: string) {
    if (!Product.validateId(id)) {
      throw new EntityError('props.id')
    }
    this.props.id = id
  }

  get name() {
    return this.props.name
  }

  set setName(name: string) {
    if (!Product.validateName(name)) {
      throw new EntityError('props.name')
    }
    this.props.name = name
  }

  get description() {
    return this.props.description
  }

  set setDescription(description: string) {
    if (!Product.validateDescription(description)) {
      throw new EntityError('props.description')
    }
    this.props.description = description
  }

  get models() {
    return this.props.models
  }

  set setModels(models: string[]) {
    if (!Product.validateModel(models)) {
      throw new EntityError('props.models')
    }
    this.props.models = models
  }

  get categories() {
    return this.props.categories
  }

  set setCategories(categories: string[]) {
    if (!Product.validateCategory(categories)) {
      throw new EntityError('props.categories')
    }
    this.props.categories = categories
  }

  get attributes() {
    return this.props.attributes
  }

  set setAttributes(attributes: Record<string, any>[]) {
    if (!Product.validateAttributes(attributes)) {
      throw new EntityError('props.attributes')
    }
    this.props.attributes = attributes
  }

  get videos() {
    return this.props.videos
  }

  set setVideos(videos: string[]) {
    if (!Product.validateVideos(videos)) {
      throw new EntityError('props.videos')
    }
    this.props.videos = videos
  }

  static validateId(id: string) {
    if (id.length !== 36) return false
    if (id === '') return false
    if (id === null) return false
    if (typeof id !== 'string') return false
    return true
  }

  static validateName(name: string) {
    if (name.length < 3) return false
    if (name.length > 255) return false
    if (name === '') return false
    if (name === null) return false
    if (typeof name !== 'string') return false
    return true
  }

  static validateDescription(description: string) {
    if (description.length < 3) return false
    if (description === '') return false
    if (description === null) return false
    if (typeof description !== 'string') return false
    return true
  }

  static validateModel(models: string[]) {
    if (models.length === 0) return false
    if (Array.isArray(models) === false) return false
    models.map((value) => {
      if (value.split('#').length !== 2) return false
      if (value.split('#')[0] === '') return false
      if (value.split('#')[1] === '') return false
      if (models.includes(value.split('#')[0])) return false
      if (typeof value !== 'string') return false
    })
    
    return true
  }
  
  static validateCategory(categories: string[]) {
    if (categories.length === 0) return false
    if (Array.isArray(categories) === false) return false
    categories.map((value) => {
      if (value.split('#').length !== 2) return false
      if (value.split('#')[0] === '') return false
      if (value.split('#')[1] === '') return false
      if (value === '') return false
      if (value === null) return false
      if (typeof value !== 'string') return false
    })
      
    return true
  }

  static validateAttributes(attributes: Record<string, any>[]) {
    if (attributes.length === 0) return false
    if (Array.isArray(attributes) === false) return false
    attributes.map((value) => {
      if (!value) return false
      if (typeof value !== 'object') return false
      if (value.modelId !== null || value.modelId !== undefined) {
        if (typeof value.modelId !== 'string') return false
        if (value.modelId === '') return false
        if (value.modelId.split('#')[1].length !== 36) return false
        if (value.categoryId !== undefined) return false
      } else {
        if (typeof value.categoryId !== 'string') return false
        if (value.categoryId === '') return false
        if (value.categoryId.split('#')[1].length !== 36) return false
        if (value.modelId !== undefined) return false
      }
    })
    return true
  }

  static validateVideos(videos: string[]) {
    if (videos.length === 0) return false
    if (Array.isArray(videos) === false) return false
    videos.map((value) => {
      if (value === '') return false
      if (value === null) return false
      if (typeof value !== 'string') return false
    })
    return true
  }
}