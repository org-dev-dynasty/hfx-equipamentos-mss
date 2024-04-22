/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from '../../domain/entities/product'
import { IProductRepository } from '../../domain/repositories/product_repository_interface'

export class ProductRepositoryMock implements IProductRepository {
  uploadProductImage(_id: string, _image: Buffer[]): Promise<string[]> {
    throw new Error('Method not implemented.')
  }
  downloadProductImage(_id: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  private products: Product[] = [
    new Product({
      id: '0195d92b-776d-4662-b233-1d14137b1f95',
      name: 'Rompedores',
      description: 'Os rompedores hidráulicos da HXF Equipamentos são verdadeiros aliados quando se trata de demolição e escavação. Com eficiência e robustez, eles enfrentam os desafios mais difíceis, seja na construção civil, mineração ou terraplanagem.',
      models: [
        'HR150#0195d92b-776d-4662-b233-1d14137b1f95',
        'HR190#0195d92b-776d-4662-b233-1d14137b1f95',
        'HR340#0195d92b-776d-4662-b233-1d14137b1f95',
        'HR480#0195d92b-776d-4662-b233-1d14137b1f95',
        'HR580#0195d92b-776d-4662-b233-1d14137b1f95',
        'HR950#0195d92b-776d-4662-b233-1d14137b1f95',
        'HR1680#0195d92b-776d-4662-b233-1d14137b1f95',
        'HR1850#0195d92b-776d-4662-b233-1d14137b1f95',
        'HR2750#0195d92b-776d-4662-b233-1d14137b1f95',
        'HR3100#0195d92b-776d-4662-b233-1d14137b1f95',
        'HR4150#0195d92b-776d-4662-b233-1d14137b1f95'
      ],
      attributes: [
        {
          modelId: 'HR150#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '150 kg',
          comprimento: '1000 mm',
          vazaoDeTrabalho: '20-40 l/min',
          pressaoDeAlivio: '160 kg/cm²',
          pressaoDeTrabalho: '90-120 kg/cm²',
          taxaDeImpacto: '500-1000 bpm',
          diametroPonteiro: '¢45 mm',
          diametroMangueiras: '1/2 inch',
          pressaoDoGas: '16 kg/cm²',
          pesoDaMaquinaPortadora: '1-2 ton',
        },
        {
          modelId: 'HR190#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '190 kg',
          comprimento: '1100 mm',
          vazaoDeTrabalho: '20-40 l/min',
          pressaoDeAlivio: '160 kg/cm²',
          pressaoDeTrabalho: '90-120 kg/cm²',
          taxaDeImpacto: '500-1000 bpm',
          diametroPonteiro: '¢53 mm',
          diametroMangueiras: '1/2 inch',
          pressaoDoGas: '16 kg/cm²',
          pesoDaMaquinaPortadora: '2-5 ton',
        },
        {
          modelId: 'HR340#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '340 kg',
          comprimento: '1300 mm',
          vazaoDeTrabalho: '36-60 l/min',
          pressaoDeAlivio: '170 kg/cm²',
          pressaoDeTrabalho: '110-140 kg/cm²',
          taxaDeImpacto: '500-900 bpm',
          diametroPonteiro: '¢68 mm',
          diametroMangueiras: '1/2 inch',
          pressaoDoGas: '16 kg/cm²',
          pesoDaMaquinaPortadora: '5-7 ton',
        },
        {
          modelId: 'HR480#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '480 kg',
          comprimento: '1719 mm',
          vazaoDeTrabalho: '50-90 l/min',
          pressaoDeAlivio: '170 kg/cm²',
          pressaoDeTrabalho: '110-140 kg/cm²',
          taxaDeImpacto: '400-800 bpm',
          diametroPonteiro: '¢75 mm',
          diametroMangueiras: '1/2 inch',
          pressaoDoGas: '16±0.5 kg/cm²',
          pesoDaMaquinaPortadora: '7-9 ton',
        },
        {
          modelId: 'HR580#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '580 kg',
          comprimento: '1737 mm',
          vazaoDeTrabalho: '60-100 l/min',
          pressaoDeAlivio: '190 kg/cm²',
          pressaoDeTrabalho: '130-160 kg/cm²',
          taxaDeImpacto: '400-800 bpm',
          diametroPonteiro: '¢85 mm',
          diametroMangueiras: '3/4 inch',
          pressaoDoGas: '16±0.5 kg/cm²',
          pesoDaMaquinaPortadora: '9-12 ton',
        },
        {
          modelId: 'HR950#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '950 kg',
          comprimento: '1900 mm',
          vazaoDeTrabalho: '80-120 l/min',
          pressaoDeAlivio: '190 kg/cm²',
          pressaoDeTrabalho: '150-170 kg/cm²',
          taxaDeImpacto: '400-700 bpm',
          diametroPonteiro: '¢100 mm',
          diametroMangueiras: '3/4 inch',
          pressaoDoGas: '16±0.5 kg/cm²',
          pesoDaMaquinaPortadora: '12-17 ton',
        },
        {
          modelId: 'HR1680#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '1680 kg',
          comprimento: '2300 mm',
          vazaoDeTrabalho: '130-170 l/min',
          pressaoDeAlivio: '210 kg/cm²',
          pressaoDeTrabalho: '160-180 kg/cm²',
          taxaDeImpacto: '400-650 bpm',
          diametroPonteiro: '¢135 mm',
          diametroMangueiras: '1 inch',
          pressaoDoGas: '16±0.5 kg/cm²',
          pressaoDoGasAcumulador: '60 kg/cm²',
          pesoDaMaquinaPortadora: '18-25 ton',
        },
        {
          modelId: 'HR1850#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '1850 kg',
          comprimento: '2420 mm',
          vazaoDeTrabalho: '150-190 l/min',
          pressaoDeAlivio: '210 kg/cm²',
          pressaoDeTrabalho: '160-180 kg/cm²',
          taxaDeImpacto: '400-500 bpm',
          diametroPonteiro: '¢140 mm',
          diametroMangueiras: '1 inch',
          pressaoDoGas: '16±0.5 kg/cm²',
          pressaoDoGasAcumulador: '60 kg/cm²',
          pesoDaMaquinaPortadora: '20-30 ton',
        },
        {
          modelId: 'HR2750#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '2750 kg',
          comprimento: '2620 mm',
          vazaoDeTrabalho: '170-220 l/min',
          pressaoDeAlivio: '230 kg/cm²',
          pressaoDeTrabalho: '180-200 kg/cm²',
          taxaDeImpacto: '300-400 bpm',
          diametroPonteiro: '¢155 mm',
          diametroMangueiras: '1 inch',
          pressaoDoGas: '16±0.5 kg/cm²',
          pressaoDoGasAcumulador: '60 kg/cm²',
          pesoDaMaquinaPortadora: '27-36 ton',
        },
        {
          modelId: 'HR3100#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '3100 kg',
          comprimento: '3015 mm',
          vazaoDeTrabalho: '200-250 l/min',
          pressaoDeAlivio: '240 kg/cm²',
          pressaoDeTrabalho: '200-220 kg/cm²',
          taxaDeImpacto: '250-400 bpm',
          diametroPonteiro: '¢165 mm',
          diametroMangueiras: '1¼ inch',
          pressaoDoGas: '16±0.5 kg/cm²',
          pressaoDoGasAcumulador: '60 kg/cm²',
          pesoDaMaquinaPortadora: '30-40 ton',
        },
        {
          modelId: 'HR4150#0195d92b-776d-4662-b233-1d14137b1f95',
          peso: '4150 kg',
          comprimento: '3055 mm',
          vazaoDeTrabalho: '250-280 l/min',
          pressaoDeAlivio: '240 kg/cm²',
          pressaoDeTrabalho: '200-240 kg/cm²',
          taxaDeImpacto: '250-350 bpm',
          diametroPonteiro: '¢175 mm',
          diametroMangueiras: '1¼ inch',
          pressaoDoGas: '16±0.5 kg/cm²',
          pressaoDoGasAcumulador: '60 kg/cm²',
          pesoDaMaquinaPortadora: '35-45 ton',
        }
      ]
    }),

    new Product({
      id: '9295eed8-ad58-4e5e-be61-99e4e3409934',
      name: 'Compactadores',
      description: 'Compactador / estaqueador vibratório operado hidraulicamente que vai dar múltipla utilidade às suas máquinas hidráulicas, que podem ser de pequenas retros até grandes escavadeiras.',
      models: [
        'ESTAPAC 200#9295eed8-ad58-4e5e-be61-99e4e3409934',
        'ESTAPAC 300#9295eed8-ad58-4e5e-be61-99e4e3409934',
        'ESTAPAC 400#9295eed8-ad58-4e5e-be61-99e4e3409934'
      ],
      attributes: [
        {
          modelId: 'ESTAPAC 200#9295eed8-ad58-4e5e-be61-99e4e3409934',
          peso: '280 kgf',
          placaBase: '400 x 740 mm',
          impulso: '24.000 N',
          frequencia: '2.000 rpm',
          vazao: '65 L/min',
          pressaoDeAlivio: '170 bar',
        },
        {
          modelId: 'ESTAPAC 300#9295eed8-ad58-4e5e-be61-99e4e3409934',
          peso: '380 kgf',
          placaBase: '400 x 740 mm',
          impulso: '24.000 N',
          frequencia: '2.000 rpm',
          vazao: '65 L/min',
          pressaoDeAlivio: '170 bar',
        },
        {
          modelId: 'ESTAPAC 400#9295eed8-ad58-4e5e-be61-99e4e3409934',
          peso: '400 kgf',
          placaBase: '610 x 710 mm',
          impulso: '25.000 N',
          frequencia: '2.000 rpm',
          vazao: '65 L/min',
          pressaoDeAlivio: '170 bar',
        }
      ]
    }),

    new Product({
      id: 'd77ffb97-c99e-470f-b788-0678e0aabcad',
      name: 'Engate Rápido',
      description: 'Um engate rápido é um dispositivo utilizado para conectar e desconectar de forma fácil e rápida mangueiras ou tubulações em sistemas hidráulicos, pneumáticos ou de fluidos em geral. Ele é composto por duas partes principais: um conector macho e um conector fêmea. Estes conectores são projetados para se encaixarem perfeitamente, proporcionando uma vedação eficiente e segura. A principal vantagem do engate rápido é a sua praticidade e agilidade na conexão e desconexão, o que facilita a manutenção e a operação de sistemas industriais e automotivos.',
      categories: [
        'HXFMini#d77ffb97-c99e-470f-b788-0678e0aabcad', 
        'HXF02#d77ffb97-c99e-470f-b788-0678e0aabcad', 
        'HXF04#d77ffb97-c99e-470f-b788-0678e0aabcad', 
        'HXF06#d77ffb97-c99e-470f-b788-0678e0aabcad', 
        'HXF08#d77ffb97-c99e-470f-b788-0678e0aabcad', 
        'HXF08S#d77ffb97-c99e-470f-b788-0678e0aabcad', 
        'HXF10#d77ffb97-c99e-470f-b788-0678e0aabcad', 
        'HXF17#d77ffb97-c99e-470f-b788-0678e0aabcad'
      ],
      attributes: [
        {
          categoria: 'HXFMini#d77ffb97-c99e-470f-b788-0678e0aabcad',
          comprimento: '300-450 mm',
          largura: '150-250 mm',
          altura: '225-270 mm',
          distEntreBuchas: '82-180 mm',
          larguraInferior: '78-146 mm',
          distanciaEntreCentrosDosPinos: '95-220 mm',
          diametroDosPinos: '20-45 mm',
          rangeDeAcoplamento: '95-200 mm',
          distanciaDosPinosSuperioresEInferiores: '170-190 mm',
          peso: '30-40 KG',
          pressaoDeOleo: '30-360 kg/cm²',
          vazao: '10-20 L/min',
          maquinaPortadora: '01-04 T',
        },
        {
          categoria: 'HXF02',
          comprimento: '520-542 mm',
          largura: '260-266 mm',
          altura: '312 mm',
          distEntreBuchas: '155-172 mm',
          larguraInferior: '151-168 mm',
          distanciaEntreCentrosDosPinos: '220-275 mm',
          diametroDosPinos: '40-45 mm',
          rangeDeAcoplamento: '200-300 mm',
          distanciaDosPinosSuperioresEInferiores: '200-210 mm',
          peso: '50-75 KG',
          pressaoDeOleo: '30-360 kg/cm²',
          vazao: '10-20 L/min',
          maquinaPortadora: '06-08 T',
        },
        {
          categoria: 'HXF04',
          comprimento: '581-610 mm',
          largura: '265-283 mm',
          altura: '318 mm',
          distEntreBuchas: '181-205 mm',
          larguraInferior: '178-200 mm',
          distanciaEntreCentrosDosPinos: '290-350 mm',
          diametroDosPinos: '45-55 mm',
          rangeDeAcoplamento: '300-350 mm',
          distanciaDosPinosSuperioresEInferiores: '240-255 mm',
          peso: '80-110 KG',
          pressaoDeOleo: '30-360 kg/cm²',
          vazao: '10-20 L/min',
          maquinaPortadora: '08-12 T',
        },
        {
          categoria: 'HXF06',
          comprimento: '760 mm',
          largura: '351-454 mm',
          altura: '400 mm',
          distEntreBuchas: '230-317 mm',
          larguraInferior: '226-313 mm',
          distanciaEntreCentrosDosPinos: '350-400 mm',
          diametroDosPinos: '50-70 mm',
          rangeDeAcoplamento: '340-440 mm',
          distanciaDosPinosSuperioresEInferiores: '240-255 mm',
          peso: '170-210 KG',
          pressaoDeOleo: '30-360 kg/cm²',
          vazao: '10-20 L/min',
          maquinaPortadora: '12-16 T',
        },
        {
          categoria: 'HXF08',
          comprimento: '920-955 mm',
          largura: '450-483 mm',
          altura: '512 mm',
          distEntreBuchas: '290-345 mm',
          larguraInferior: '286-340 mm',
          distanciaEntreCentrosDosPinos: '430-480 mm',
          diametroDosPinos: '70-80 mm',
          rangeDeAcoplamento: '420-510 mm',
          distanciaDosPinosSuperioresEInferiores: '300 mm',
          peso: '350-390 KG',
          pressaoDeOleo: '30-360 kg/cm²',
          vazao: '10-20 L/min',
          maquinaPortadora: '18-25 T',
        },
        {
          categoria: 'HXF08S',
          comprimento: '950-1000 mm',
          largura: '445-493 mm',
          altura: '512-540 mm',
          distEntreBuchas: '300-350 mm',
          larguraInferior: '298-346 mm',
          distanciaEntreCentrosDosPinos: '450-505 mm',
          diametroDosPinos: '80 mm',
          rangeDeAcoplamento: '450-530 mm',
          distanciaDosPinosSuperioresEInferiores: '320 mm',
          peso: '370-410 KG',
          pressaoDeOleo: '30-360 kg/cm²',
          vazao: '10-20 L/min',
          maquinaPortadora: '22-26 T',
        },
        {
          categoria: 'HXF10',
          comprimento: '965-1100 mm',
          largura: '543-572 mm',
          altura: '585 mm',
          distEntreBuchas: '345-425 mm',
          larguraInferior: '340-420 mm',
          distanciaEntreCentrosDosPinos: '485-530 mm',
          diametroDosPinos: '90-100 mm',
          rangeDeAcoplamento: '460-560 mm',
          distanciaDosPinosSuperioresEInferiores: '350-370 mm',
          peso: '410-520 KG',
          pressaoDeOleo: '30-360 kg/cm²',
          vazao: '10-20 L/min',
          maquinaPortadora: '26-30 T',
        },
        {
          categoria: 'HXF17',
          comprimento: '1005-1150 mm',
          largura: '602-666 mm',
          altura: '560-615 mm',
          distEntreBuchas: '380-480 mm',
          larguraInferior: '376-476 mm',
          distanciaEntreCentrosDosPinos: '520-630 mm',
          diametroDosPinos: '100-110 mm',
          rangeDeAcoplamento: '500-600 mm',
          distanciaDosPinosSuperioresEInferiores: '370-380 mm',
          peso: '550-650 KG',
          pressaoDeOleo: '30-360 kg/cm²',
          vazao: '10-20 L/min',
          maquinaPortadora: '30-40 T',
        }
      ]
    }),

    new Product({
      id: 'fdab69d1-a87a-4d21-a7e4-77d214bb4924',
      name: 'Tesoura Hidráulica',
      description: 'A tesoura hidráulica é um equipamento utilizado para cortar materiais metálicos, como chapas, vigas, perfis, entre outros. Ela é composta por uma lâmina superior e uma inferior, que se movem em direções opostas para realizar o corte. O acionamento da tesoura é feito por meio de um sistema hidráulico, que proporciona maior precisão e eficiência no corte. Além disso, a tesoura hidráulica é um equipamento versátil, que pode ser utilizada em diversos segmentos, como serralherias, metalúrgicas, indústrias de construção civil, entre outros.',
      models: [
        'HXF180R#fdab69d1-a87a-4d21-a7e4-77d214bb4924',
        'HXF280R#fdab69d1-a87a-4d21-a7e4-77d214bb4924',
        'HXF350R#fdab69d1-a87a-4d21-a7e4-77d214bb4924',
        'HXF450R#fdab69d1-a87a-4d21-a7e4-77d214bb4924'
      ],
      attributes: [
        {
          modelo: 'HXF180R',
          instalacaoDoBraco: '13-17 ton',
          instalacaoDaLanca: '10-12 ton',
          pressaoNoTrabalho: '250-300 bar',
          fluxoDeTrabalho: '90-110 lpm',
          peso: '1100 kg',
          fluxoRotativo: '30-40 lpm',
          pressaoRotativa: '90-100 bar',
          abertura: '375 mm',
          profundidadeDeCorte: '395 mm',
          comprimentoTotal: '2100 mm'
        },
        {
          modelo: 'HXF280R',
          instalacaoDoBraco: '18-27 ton',
          instalacaoDaLanca: '14-18 ton',
          pressaoNoTrabalho: '320-350 bar',
          fluxoDeTrabalho: '150-200 lpm',
          peso: '2148 kg',
          fluxoRotativo: '30-40 lpm',
          pressaoRotativa: '100-115 bar',
          abertura: '480 mm',
          profundidadeDeCorte: '395 mm',
          comprimentoTotal: '3169 mm'
        },
        {
          modelo: 'HXF350R',
          instalacaoDoBraco: '30-40 ton',
          instalacaoDaLanca: '20-30 ton',
          pressaoNoTrabalho: '320-350 bar',
          fluxoDeTrabalho: '200-250 lpm',
          peso: '3362 kg',
          fluxoRotativo: '30-40 lpm',
          pressaoRotativa: '100-115 bar',
          abertura: '572 mm',
          profundidadeDeCorte: '750 mm',
          comprimentoTotal: '3848 mm'
        },
        {
          modelo: 'HXF450R',
          instalacaoDoBraco: '40-50 ton',
          instalacaoDaLanca: '30-40 ton',
          pressaoNoTrabalho: '350-380 bar',
          fluxoDeTrabalho: '250-300 lpm',
          peso: '3600 kg',
          fluxoRotativo: '40-50 lpm',
          pressaoRotativa: '120-145 bar',
          abertura: '600 mm',
          profundidadeDeCorte: '750 mm',
          comprimentoTotal: '3942 mm'
        }
      ]
    })
  ]

  async createProduct(product: Product): Promise<Product> {
    this.products.push(product)
    return Promise.resolve(product)
  }

  async getProductById(id: string): Promise<Product> {
    const product = this.products.find(product => product.id === id)
    if (!product) throw new Error('Product not found')
    return Promise.resolve(product)    
  }

  async getAllProducts(): Promise<Product[]> {
    return Promise.resolve(this.products)
  }

  async updateProduct(
    id: string,
    name?: string,
    description?: string,
    models?: string[],
    categories?: string[],
    attributes?: Record<string, any>[],
    videos?: string[],
  ): Promise<Product> {
    const product = this.products.find(product => product.id === id)
    if (!product) throw new Error('Product not found')
    if (name !== undefined) {
      product.setName = name
    }
    if (description !== undefined) {
      product.setDescription = description
    }
    if (models !== undefined) {
      product.setModels = models
    }
    if (categories !== undefined) {
      product.setCategories = categories
    }
    if (attributes !== undefined) {
      product.setAttributes = attributes
    }
    if (videos !== undefined) {
      product.setVideos = videos
    }
    return Promise.resolve(product)
  }

  async deleteProduct(id: string): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Product not found')
    const product = this.products[index]
    this.products.splice(index, 1)
    return Promise.resolve(product)
  }
}