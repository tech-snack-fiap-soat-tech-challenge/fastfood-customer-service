import { readFileSync } from 'fs';
import { join } from 'path';

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

const formatPkgName = (name: string): string => {
  return name
    .replace(/[^a-zA-Z0-9-]/g, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export interface AppConfig {
  env: string;
  port: number;
  pkgName: string;
  pkgVersion: string;
  pkgDescription: string;
}

export interface LogsConfig {
  defaultLevel: string;
  appLabel: string;
  timestamp: string;
  levels: Record<string, number>;
  colors: Record<string, string | string[]>;
}

export interface DBConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  pswd: string;
  sslCert?:
    | {
        rejectUnauthorized: boolean;
        ca: string;
      }
    | false;
}

export default (): { app: AppConfig; log: LogsConfig; db: DBConfig } => {
  return {
    app: {
      env: process.env.NODE_ENV ?? 'development',
      port: Number(process.env.PORT ?? 3000),
      pkgName: formatPkgName(pkg.name ?? 'fastfood-customer-service'),
      pkgVersion: pkg.version ?? '1.0.0',
      pkgDescription: pkg.description ?? 'The FastFood App Customer service',
    },
    log: {
      defaultLevel: process.env.LOG_LEVEL ?? 'debug',
      timestamp: 'DD/MM/YYYY, HH:mm:ss',
      appLabel: formatPkgName(pkg.name ?? 'customer-api'),
      levels: { error: 0, warn: 1, info: 2, debug: 3 },
      colors: { error: 'red', warn: 'yellow', info: 'cyan', debug: 'green' },
    },
    db: {
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      name: process.env.DB_NAME ?? 'customer_db',
      user: process.env.DB_USERNAME ?? 'postgres',
      pswd: process.env.DB_PASSWORD ?? 'postgres',
      sslCert: false,
    },
  };
};
