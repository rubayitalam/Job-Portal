
// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity()
// export class Template {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   // @Column('text')
//   // filecontent: string;

//   // @Column('bytea') // For PostgreSQL, use 'bytea', for MySQL use 'BLOB'
//   // filecontent: Buffer;
// }
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('bytea') // Store the file content as binary data (PostgreSQL)
  filecontent: Buffer; // This will store the actual file content
}
