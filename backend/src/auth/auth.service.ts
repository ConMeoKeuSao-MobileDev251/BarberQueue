import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ClientRegisterDto, LoginReqDto, StaffOrOwnerRegisterDto, ForgotPasswordDto, ResetPasswordDto } from 'src/dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { tokenBlacklist } from './blacklist.store';
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from "@getbrevo/brevo";

interface DecodeResetTokenPayload {
    email: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    private signAccessToken(userId: number, phoneNumber: string, fullName: string, role: string) {
        return this.jwtService.sign({ userId, phoneNumber, fullName, role }, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1h'
        })
    }

    async clientRegister(registerDto: ClientRegisterDto) {
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

            return {
                accessToken: this.signAccessToken(user.id, user.phoneNumber, user.fullName, user.role),
                phoneNumber: user.phoneNumber,
                fullName: user.fullName,
                role: user.role
            }
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async staffOrOwnerRegister(registerDto: StaffOrOwnerRegisterDto) {
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


            return {
                accessToken: this.signAccessToken(user.id, user.phoneNumber, user.fullName, user.role),
                phoneNumber: user.phoneNumber,
                fullName: user.fullName,
                role: user.role
            }
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }

            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async login(loginReqDto: LoginReqDto) {
        try {
            const user = await this.prismaService.user.findUnique({ where: { phoneNumber: loginReqDto.phoneNumber } });
            if (!user) throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: 'phone number is incorrect'
            })

            const isPasswordMatch = await bcrypt.compare(loginReqDto.password, user.password);
            if (!isPasswordMatch) throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: 'password is incorrect'
            })

            const accessToken = this.signAccessToken(user.id, user.phoneNumber, user.fullName, user.role);

            return {
                accessToken,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        } catch (error) {
            if (!(error instanceof InternalServerErrorException)) {
                throw error;
            }

            throw new InternalServerErrorException('Error when logging in', error);
        }

    }

    async logout(token: string | undefined) {
        if (!token) {
            throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Authorization token is missing'
            });
        }

        tokenBlacklist.add(token);

        return {
            message: 'User logged out successfully'
        };
    }

    initBrevoClient(): TransactionalEmailsApi {
        const transactionalEmailsApi = new TransactionalEmailsApi();
        transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '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');
        return transactionalEmailsApi ;
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        try {
            const { email } = forgotPasswordDto;
            if (!email) {
                throw new BadRequestException('Email is required.');
            }

            const user = await this.prismaService.user.findUnique({ where: { email } });
            if (!user) {
                throw new NotFoundException('User with the provided email does not exist.');
            }

            const jwtPayload: DecodeResetTokenPayload = { email: user.email! };
            const resetToken = this.jwtService.sign(jwtPayload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '5m'
            });
            const transactionalEmailsApi = this.initBrevoClient();
            const sendSmtpEmail = this.configResetPasswordEmail(email, user.fullName, resetToken);
            await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);

            return { message: 'Reset password email sent successfully.' };
        } catch (error) {
            console.error('Error sending reset password email:', error);
            throw new BadRequestException('Không thể gửi email reset password');
        }
    }

    private configResetPasswordEmail(email: string, fullName: string, resetToken: string) {
        const sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.subject = 'Reset Password - BarberQueue';
        sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Reset Password</h2>
          <p>Xin chào ${fullName},</p>
          <p>Bạn đã yêu cầu reset mật khẩu cho tài khoản BarberQueue.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">Mã xác nhận của bạn là:</p>
            <h3 style="color: #007bff; margin: 10px 0; font-size: 24px;">${resetToken}</h3>
          </div>
          <p style="color: #666;">Mã này sẽ hết hạn sau 5 phút.</p>
        </div>
      `;
        sendSmtpEmail.sender = {
            name: 'BarberQueue',
            email: 'webhk242@gmail.com',
        };
        sendSmtpEmail.to = [{ email: email, name: fullName }];

        return sendSmtpEmail;
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        try {
            const { resetToken, password } = resetPasswordDto;
            if (!resetToken || !password) {
                throw new BadRequestException('Reset token and new password are required.');
            }

            if(tokenBlacklist.has(resetToken)) {
                throw new BadRequestException('Reset token has been used or is invalid.');
            }

            const decodedToken = this.jwtService.verify<DecodeResetTokenPayload>(resetToken, { secret: process.env.JWT_SECRET || '' });
            const email = decodedToken.email;
            await this.prismaService.user.update({
                where: { email },
                data: {
                    password: await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
                }
            });

            tokenBlacklist.add(resetToken);

            return { message: 'Password has been reset successfully.' };
        } catch (error) {
            console.error('Error resetting password:', error);
            throw new BadRequestException('Invalid or expired reset token.');
        }
    }
}
