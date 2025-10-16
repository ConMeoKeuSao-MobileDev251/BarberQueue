import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginReqDto, RegisterDto } from 'src/dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    private signAccessToken (userId: number, phoneNumber: string, role: string){
        return this.jwtService.sign({userId, phoneNumber, role}, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h'
        })
    }

    async register(registerDto: RegisterDto) {
        try {
            //check phone number exists in the database
            const existingPhoneNumber = await this.prismaService.user.findUnique({ where: { phoneNumber: registerDto.phoneNumber } })

            if (existingPhoneNumber) throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: 'this phone number has been registered'
            })

            //hash password
            const hashedPassword: string = await bcrypt.hash(registerDto.password, Number(process.env.SALT_ROUNDS))

            let user: User | null = null
            //Create new account
            if (registerDto.role === 'client') {
                user = await this.prismaService.$transaction(async (prisma) => {
                    if (
                        registerDto.addressText === undefined ||
                        registerDto.latitude === undefined ||
                        registerDto.longitude === undefined) throw new BadRequestException({
                            status: HttpStatus.BAD_REQUEST,
                            message: 'addressText, latitude, longitude must not be empty'
                        })

                    const address = await prisma.address.create({
                        data: {
                            addressText: registerDto.addressText,
                            latitude: registerDto.latitude,
                            longitude: registerDto.longitude
                        }
                    })

                    return await prisma.user.create({
                        data: {
                            phoneNumber: registerDto.phoneNumber,
                            password: hashedPassword,
                            fullName: registerDto.fullName,
                            role: registerDto.role,
                            email: registerDto.email,
                            birthDate: registerDto.birthDate,
                            addressId: address.id
                        }
                    })
                })
            } else {
                if (registerDto.branchId === undefined || registerDto.addressId === undefined) throw new BadRequestException({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'branchId and addressId must not be empty'
                })
                user = await this.prismaService.user.create({
                    data: {
                        phoneNumber: registerDto.phoneNumber,
                        password: hashedPassword,
                        fullName: registerDto.fullName,
                        role: registerDto.role,
                        email: registerDto.email,
                        birthDate: registerDto.birthDate,
                        addressId: registerDto.addressId,
                        branchId: registerDto.branchId
                    }
                })
            }

            return {
                accessToken: this.signAccessToken(user.id, user.phoneNumber, user.role),
                fullName: user.fullName,
                role: user.role
            }
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException(error)
        }
    }

    async login(loginReqDto: LoginReqDto) {
        const user = await this.prismaService.user.findUnique({where: {phoneNumber: loginReqDto.phone_number}});
        if(!user) throw new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            message: 'phone number is incorrect'
        })

        const isPasswordMatch = await bcrypt.compare(loginReqDto.password, user.password);
        if(!isPasswordMatch) throw new BadRequestException({
            status: HttpStatus.BAD_REQUEST,
            message: 'password is incorrect'
        })

        const accessToken = this.signAccessToken(user.id, user.phoneNumber, user.role);

        return {
            accessToken,
            fullName: user.fullName,
            role: user.role
        }
    }
}
