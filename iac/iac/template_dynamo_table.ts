import { Construct } from 'constructs'
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb'
import { RemovalPolicy } from 'aws-cdk-lib'

export class TemplateDynamoTable extends Construct {
  public table: Table

  constructor(scope: Construct, constructId: string, dynamoTableName: string) {
    super(scope, constructId)

    this.table = new Table(this, 'HfxMssTable', {
      tableName: dynamoTableName,
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    })
  }
}
