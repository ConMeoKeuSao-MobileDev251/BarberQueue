import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginReqDto, AuthResponseDto, RegisterDto } from 'src/dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: "User sign up new account"})
  @ApiOkResponse({
    description: 'User sign up successfully',
    type: AuthResponseDto
  })
  async register(@Body() registerDto: RegisterDto){
    return await this.authService.register(registerDto)
  }

  @Post('login')
  @ApiOperation({ summary: "User login to the system" })
  @ApiOkResponse({
    description: 'User login successfully',
    type: AuthResponseDto
  })
  async login(@Body() loginDto: LoginReqDto){
    return await this.authService.login(loginDto)
  }
}
