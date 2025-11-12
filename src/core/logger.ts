/**
 * Logger module for pretty console output using chalk
 */

import chalk from 'chalk';

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

class Logger {
  private verbose: boolean = false;

  /**
   * Enable verbose logging
   */
  setVerbose(enabled: boolean): void {
    this.verbose = enabled;
  }

  /**
   * Log info message
   */
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  /**
   * Log success message
   */
  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  /**
   * Log warning message
   */
  warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  /**
   * Log banner message
   */
  banner(title: string, subtitle?: string): void {
    const width = Math.max(title.length, subtitle ? subtitle.length : 0) + 6;
    const border = '─'.repeat(width);
    console.log('');
    console.log(chalk.cyanBright(`┌${border}┐`));
    const titleLine = `│   ${title.padEnd(width - 6)}   │`;
    console.log(chalk.cyanBright(titleLine));
    if (subtitle) {
      const subtitleLine = `│   ${subtitle.padEnd(width - 6)}   │`;
      console.log(chalk.cyanBright(subtitleLine));
    }
    console.log(chalk.cyanBright(`└${border}┘`));
    console.log('');
  }

  /**
   * Log error message
   */
  error(message: string): void {
    console.error(chalk.red('✗'), message);
  }

  /**
   * Log debug message (only when verbose)
   */
  debug(message: string): void {
    if (this.verbose) {
      console.log(chalk.gray('🔍'), message);
    }
  }

  /**
   * Log raw message (no prefix)
   */
  raw(message: string): void {
    console.log(message);
  }
}

export const logger = new Logger();
