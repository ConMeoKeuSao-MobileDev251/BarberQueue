import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RegisterDto, RegisterResponseDto } from 'src/dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') 
  @ApiOperation({ summary: "User sign up new account"})
  @ApiOkResponse({ 
    description: 'User sign up successfully',
    type: RegisterResponseDto
  })
  async register(@Body() registerDto: RegisterDto){
    return await this.authService.register(registerDto)
  }
}
