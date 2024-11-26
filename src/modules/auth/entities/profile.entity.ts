import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ImgUser: string; // URL or path to the user's profile image

  @Column({ type: 'varchar', length: 255, nullable: true })
  ImgCover: string; // URL or path to the user's cover image

  @Column({ type: 'varchar', length: 100, default: 'user' })
  Role: string; // User role (e.g., 'user', 'admin')

  @Column({ type: 'varchar', length: 255 })
  FullName: string; // User's full name

  @Column({ type: 'varchar', length: 255 })
  Email: string; // User email (should be unique)

  @Column({ type: 'varchar', length: 255, nullable: true })
  Address: string; // User address

  @Column({ type: 'varchar', length: 255, nullable: true })
  CompanyName: string; // User's company name

  @Column({ type: 'varchar', length: 255 })
  Password: string; // Hashed password

  @Column({ type: 'boolean' })
  isVerified: boolean; // Whether the user is verified
  @Column({ type: 'boolean' })
  isActive: boolean;
  @Column({ type: 'boolean' })
  isAdmin: boolean; // Whether the user has admin privileges

  @Column({ type: 'varchar', length: 30, default: false })
  account_type: boolean; // Type of account (e.g., "basic", "premium")

  @Column({ type: 'varchar', length: 30 })
  code_id: string; // Verification code ID

  @Column({
    type: 'varchar',
  })
  code_expired: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreateDate: Date;
}
