import { Module } from '@nestjs/common'
import { ProjectsService } from '@app/accounts-service/projects/projects.service'
import { ProjectsController } from '@app/accounts-service/projects/projects.controller'
import { DatabaseModule } from '@app/common'
import { projectsProviders } from '@app/accounts-service/projects/projects.providers'
import { UsersModule } from '@app/accounts-service/users/users.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import {
  apiService,
  apiServiceHost,
  relayService,
  relayServiceHost
} from '@app/common/constants/microservices.constants'

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    ClientsModule.register([
      {
        name: apiService,
        transport: Transport.TCP,
        options: {
          host: apiServiceHost,
          port: parseInt(process.env.API_TCP_PORT)
        }
      }
    ]),
    ClientsModule.register([
      {
        name: relayService,
        transport: Transport.TCP,
        options: {
          host: relayServiceHost,
          port: parseInt(process.env.RELAY_TCP_PORT)
        }
      }
    ])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ...projectsProviders],
  exports: [ProjectsService]
})
export class ProjectsModule {}