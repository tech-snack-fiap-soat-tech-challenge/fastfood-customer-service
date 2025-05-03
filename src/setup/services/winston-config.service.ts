import { WinstonModuleOptions, WinstonModuleOptionsFactory } from 'nest-winston';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format, transports } from 'winston';
import { SPLAT } from 'triple-beam';
import { TransformableInfo } from 'logform';

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createWinstonModuleOptions(): WinstonModuleOptions {
    const logConfig = this.configService.get('log');

    return {
      level: logConfig.defaultLevel,
      levels: logConfig.levels,
      format: format.combine(
        format.label({ label: logConfig.appLabel }),
        format.timestamp({ format: logConfig.timestamp }),
        format.ms(),
        format.errors({ stack: true }),
        format.splat(),
        format.printf((options) => this.createCustomTemplate(options, logConfig.colors[options.level])),
      ),
      transports: [new transports.Console({ forceConsole: true })],
    };
  }

  private createCustomTemplate(info: TransformableInfo, accentColor: string): string {
    const { level, message, label, timestamp, ms, stack } = info;
    const [meta] = (info[SPLAT] as Record<string, string>[]) || [];

    const { colorize } = format.colorize({
      colors: {
        neutral: 'white',
        neutralBold: 'bold white',
        neutralDimmed: 'dim white',
        accent: `${accentColor}`,
        accentBold: `bold ${accentColor}`,
        accentDimmed: `dim ${accentColor}`,
      },
    });

    return [
      colorize('neutralBold', `[${colorize('accentBold', `${label}`)}] -`),
      timestamp,
      colorize('accentBold', `${level.padStart(5).toUpperCase()}`),
      colorize('neutral', `[${meta?.context || 'unknown'}]`),
      message,
      colorize('accentDimmed', `${ms}`),
      colorize('neutral', stack ? `\n${stack.toString()}` : ''),
    ].join(' ');
  }
}
