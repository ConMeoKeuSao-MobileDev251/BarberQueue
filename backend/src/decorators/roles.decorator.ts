import { SetMetadata } from "@nestjs/common"
import { Role } from "src/enums/role.enum"

export const ROLES = 'roles'
export const Roles = (...role: Role[]) => SetMetadata(ROLES, role)