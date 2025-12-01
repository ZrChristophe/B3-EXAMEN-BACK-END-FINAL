import { UserRole } from '../../users/user.entity';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;

  encryptedMasterKey?: string | null;
  salt?: string | null;
  encryptedProfile?: string | null;
  role: UserRole;
}
