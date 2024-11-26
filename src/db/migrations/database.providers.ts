import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'signup',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      });
      if (!dataSource.isInitialized) {
        try {
          await dataSource.initialize();
          console.log('Database connection established successfully  ');
        } catch (error) {
          console.error('Failed to connect to the database', error);
        }
      }

      return dataSource;
    },
  },
];
