import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./user.dto";

export class RegisterDto extends PickType(CreateUserDto, ['username','password','fullName','phoneNumber']){}