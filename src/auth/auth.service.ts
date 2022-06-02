import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(username);
    const isMatch = await bcrypt.compare(pass, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<any> {
    const jwtpayload = {
      username: user.email,
      sub: {
        id: user.id,
        uuid: user.uuid,
        fullName: (user.firstName || '').concat(user.lastName || ''),
      },
    };
    //TODO get menus,
    const menus = [];
    return {
      access_token: this.jwtService.sign(jwtpayload),
      user,
      menus,
    };
  }
}
