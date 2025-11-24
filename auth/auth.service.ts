import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';

interface User {
  id: number;
  email: string;
  password: string;
  role: 'client' | 'pro';
}

@Injectable()
export class AuthService {
  private users: User[] = [];

  async register(dto: RegisterDto) {
    const exists = this.users.find(u => u.email === dto.email);
    if (exists) throw new BadRequestException('Email déjà utilisé');

    const hash = await argon2.hash(dto.password, { type: argon2.argon2id });

    const user: User = {
      id: Date.now(),
      email: dto.email,
      password: hash,
      role: dto.role,
    };

    this.users.push(user);
    return { message: 'Compte créé', user: { email: user.email, role: user.role } };
  }

  async login(dto: LoginDto) {
    const user = this.users.find(u => u.email === dto.email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const valid = await argon2.verify(user.password, dto.password);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    return { message: 'Connexion réussie', user: { email: user.email, role: user.role } };
  }
}
