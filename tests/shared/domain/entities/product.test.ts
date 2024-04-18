import { test, expect } from 'vitest'

import { Product } from '../../../../src/shared/domain/entities/product'

test('should be able to create a product', () => {
  const product = new Product({
    id: '0195d92b-776d-4662-b233-1d14137b1f95',
    name: 'Rompedores',
    description: 'Os rompedores hidráulicos da HXF Equipamentos são verdadeiros aliados quando se trata de demolição e escavação. Com eficiência e robustez, eles enfrentam os desafios mais difíceis, seja na construção civil, mineração ou terraplanagem.',
    models: ['HR150#0195d92b-776d-4662-b233-1d14137b1f95'],
    attributes: [
      {
        modelId: 'HR150#0195d92b-776d-4662-b233-1d14137b1f95',
        peso: '150 kg',
        comprimento: '1000 mm',
        vazaoDeTrabalho: '20-40 l/min',
        pressaoDeAlivio: '160 kg/cm²',
        pressaoDeTrabalho: '90 kg/cm²',
      }
    ]
  })

  expect(product).toBeDefined()
  expect(product.id).toBe('0195d92b-776d-4662-b233-1d14137b1f95')
})