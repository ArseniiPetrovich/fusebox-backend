import { Transport } from '@nestjs/microservices'
import { NestFactory } from '@nestjs/core'
import { ChargeApiServiceModule } from 'apps/charge-api-service/src/charge-api-service.module'
import { apiServiceHost } from '@app/common/constants/microservices.constants'
import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import { ApiDocsModule } from './api-docs/api-docs.module'

async function bootstrap () {
  const app = await NestFactory.create(ChargeApiServiceModule)

  const microServiceOptions = {
    transpot: Transport.TCP,
    options: {
      host: apiServiceHost,
      port: process.env.API_TCP_PORT
    }
  }
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Charge API')
    .setDescription('Charge API Docs')
    .setVersion('0.0')
    .addTag('charge')
    .build()

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true
    },
    customSiteTitle: 'My API Docs'
  }

  const option:SwaggerDocumentOptions = {
    include: [ApiDocsModule],
    deepScanRoutes: true
  }
  const document = SwaggerModule.createDocument(app, config, option);

  SwaggerModule.setup('api', app, document, customOptions)

  app.connectMicroservice(microServiceOptions)
  await app.startAllMicroservices()
  await app.listen(process.env.API_PORT)
}
bootstrap()
