import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { Public } from 'src/core/public.annotation';
import { AuthService } from './auth.service';
import { LoginGuard } from './login.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoginGuard)
  @Post('/login')
  @Public()
  async login(@Request() req) {
    const result = await this.authService.login(req.user);
    return result;
  }
}
