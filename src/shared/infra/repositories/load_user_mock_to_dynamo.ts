/* eslint-disable @typescript-eslint/no-unused-vars */
import * as AWS from 'aws-sdk'

import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient, waitUntilTableExists, ListTablesCommand, CreateTableCommand } from '@aws-sdk/client-dynamodb'

import { Environments } from '../../environments'
import { UserRepositoryDynamo } from './user_repository_dynamo'
import env from '../../../../index'
import { User } from '../../domain/entities/user'

async function setupDynamoTable(): Promise<void> {
  const dynamoTableName = env.DYNAMO_TABLE_NAME
  if (!dynamoTableName) throw new Error('DYNAMO_TABLE_NAME is undefined')
  console.log('dynamoTableName - [SETUP_DYNAMO_TABLE] - ', dynamoTableName)
  // AWS.config.update({ region: 'sa-east-1' })

  console.log('Setting up DynamoDB table...')

  const dynamoClient = new DynamoDBClient({
    region: env.REGION,
    endpoint: env.ENDPOINT_URL,
  })
  console.log('DynamoDB client created')


  const tables = (await dynamoClient.send(new ListTablesCommand({}))).TableNames || []

  if (!tables.includes(dynamoTableName)) {
    console.log('Creating table...')
    await dynamoClient.send(
      new CreateTableCommand({
        TableName: dynamoTableName,
        AttributeDefinitions: [
          { AttributeName: 'PK', AttributeType: 'S' },
          { AttributeName: 'SK', AttributeType: 'S' },
        ],
        KeySchema: [
          { AttributeName: 'PK', KeyType: 'HASH' },
          { AttributeName: 'SK', KeyType: 'RANGE' },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      })
    )

    console.log('Waiting for table to be created...')

    // Adicione um atraso aqui antes de verificar se a tabela existe.
    await new Promise(resolve => setTimeout(resolve, 10000)) // Ajuste o tempo conforme necessário.

    await waitUntilTableExists({
      client: dynamoClient,
      maxWaitTime: 200,
    }, { TableName: dynamoTableName })

    console.log(`Table ${env.DYNAMO_TABLE_NAME} created!`)
  } else {
    console.log('Table already exists!')
  }
}

async function loadMockToLocalDynamo() {
  // const mock = new UserRepositoryMock()
  const dynamoRepo = new UserRepositoryDynamo()

  console.log('Loading mock to local DynamoDB...')
  
  const user = new User({
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'Teste123$'
  })

  await dynamoRepo.createUser(user)  

  console.log(`${user.name} loaded to local DynamoDB`)
}

async function loadMockToRealDynamo() {
  const dynamoRepo = new UserRepositoryDynamo()
  
  console.log('Loading mock to real DynamoDB...')
  // const users = generateAllUsersFromJson()

  // for(const user of users) {
  //   // console.log(`Loading user ${user.id} | ${user.name} to dynamoDB...`)
  //   await dynamoRepo.createUser(user)
  //   count += 1
  // }

  const user = new User({
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'Teste123$'
  })

  await dynamoRepo.createUser(user) 

  console.log(`${user.name} loaded to real DynamoDB`)
  
}


if (require.main === module) {
  (async () => {
    await setupDynamoTable()
    // await loadMockToLocalDynamo()
    await loadMockToRealDynamo()
  })()
} else {
  (async () => {
    await setupDynamoTable()
    // await loadMockToLocalDynamo()
    await loadMockToRealDynamo()
  })()
}