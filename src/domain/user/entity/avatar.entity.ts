import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Avatar {
    @Column({ unique: true })
    nickname: string;

    @Column()
    bio: string;

    @Column()
    profileURL: string;

    @OneToOne(() => User, (user) => user.avatar)
    user: User;
}
