import { DataSource } from 'typeorm';
import { Collection } from 'src/models/entities/collection.entity';

export const collectionsProviders = [
  {
    provide: 'COLLECTIONS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Collection),
    inject: ['DATA_SOURCE'],
  },
];
