import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './UserEntity';

@Entity({ name: 'stores' })
export class Store extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column()
  description: string;

  @ManyToMany((type) => User, (user) => user.stores)
  customers: User[];
}
