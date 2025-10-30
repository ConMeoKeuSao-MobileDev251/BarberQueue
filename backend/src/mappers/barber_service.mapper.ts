import { Service } from "generated/prisma";


export class BarberServiceMapper {
    static toResponse(service: Service) {
        return {
            id: service.id,
            name: service.name,
            duration: service.duration,
            price: service.price,
        }
    }

    static toListResponse(services: Service[]) {
        return services.map(service => this.toResponse(service));
    }
}