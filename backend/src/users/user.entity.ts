
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 150,
    nullable: true,
  })
  email: string | null;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
