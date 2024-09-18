import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Link } from './LinkEntity';
import { Store } from './StoreEntity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'uuid', nullable: false, unique: true })
  avKey: string;

  @Column({ length: 31, nullable: false })
  firstName: string;

  @Column({ length: 31, default: 'resident', nullable: true })
  lastName: string;

  @Column({ length: 63, nullable: false })
  username: string;

  @ManyToMany(() => Store, (store) => store.customers)
  @JoinTable({
    name: 'user_stores',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'store_id', referencedColumnName: 'id' },
  })
  stores: Store[];

  @OneToOne(() => Link, (link: Link) => link.user)
  link: Link;
}
