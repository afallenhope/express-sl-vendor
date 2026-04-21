import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './UserEntity';

@Entity({ name: 'stores' })
export class Store extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column()
  description: string;

  @ManyToMany((type) => User, (user) => user.stores)
  @JoinTable({
    name: 'user_stores',
    joinColumn: { name: 'store_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  customers: User[];
}
