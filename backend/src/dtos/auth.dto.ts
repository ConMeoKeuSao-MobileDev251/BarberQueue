import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./user.dto";

export class RegisterDto extends PickType(CreateUserDto, ['username','password','fullName','phoneNumber']){}