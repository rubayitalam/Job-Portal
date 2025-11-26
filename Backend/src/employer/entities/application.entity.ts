import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  jobId: string;

  @Column()
  candidateName: string;

  @Column()
  email: string;

  @Column()
  resumeLink: string;

  @Column({ default: 'Pending' })
  status: string; // Pending / Reviewed / Accepted / Rejected

  @CreateDateColumn()
  appliedAt: Date;
}
