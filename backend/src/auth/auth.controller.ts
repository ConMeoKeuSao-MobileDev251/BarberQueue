import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginReqDto, AuthResponseDto, RegisterDto, ClientRegisterDto, StaffOrOwnerRegisterDto } from 'src/dtos/auth.dto';
import { SkipAuth } from 'src/decorators/public.decorator';
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/current_user.decorator';
import { CurrentUserDto } from 'src/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @SkipAuth()
  @ApiOperation({ summary: "User sign up new account for client", security: [] })
  @Post('register/client')
  @ApiOkResponse({
    description: 'User sign up successfully',
    type: AuthResponseDto
  })
  async clientRegister(@Body() registerDto: ClientRegisterDto) {
    return await this.authService.clientRegister(registerDto)
  }

  @SkipAuth()
  @ApiOperation({ summary: "User sign up new account for owner or staff", security: [] })
  @Post('register/staff-or-owner')
  @ApiOkResponse({
    description: 'User sign up successfully',
    type: AuthResponseDto
  })
  async register(@Body() registerDto: StaffOrOwnerRegisterDto) {
    return await this.authService.staffOrOwnerRegister(registerDto)
  }

  @SkipAuth()
  @ApiOperation({ summary: "User login to the system", security: [] })
  @Post('login')
  @ApiOkResponse({
    description: 'User login successfully',
    type: AuthResponseDto
  })
  @HttpCode(200)
  async login(@Body() loginDto: LoginReqDto) {
    return await this.authService.login(loginDto)
  }

  @ApiOperation({ summary: "Logout user" })
  @Post('logout')
  @ApiBearerAuth()
  async logout(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    return await this.authService.logout(token);
  }

  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get profile of logged in user" })
  async getProfile(@CurrentUser() user: CurrentUserDto) {
    return user;
  }
}
