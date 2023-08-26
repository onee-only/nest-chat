import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordManager {
    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async compare(hashed: string, candidate: string): Promise<boolean> {
        return await bcrypt.compare(candidate, hashed);
    }
}
