/**
 * Pre-start is where we want to place things that must run BEFORE the express 
 * server is started. This is useful for environment variables, command-line 
 * arguments, and cron-jobs.
 */

// NOTE: DO NOT IMPORT ANY SOURCE CODE HERE
import path from 'path';
import dotenv from 'dotenv';
import { parse } from 'ts-command-line-args';
import { validateLicense, getLicenseInfo } from './util/license';


// **** Types **** //

interface IArgs {
  env: string;
}


// **** License Validation **** //

try {
  validateLicense();
  // eslint-disable-next-line no-console
  console.log(getLicenseInfo());
  // eslint-disable-next-line no-console
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : String(error));
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}


// **** Setup **** //

// Command line arguments
const args = parse<IArgs>({
  env: {
    type: String,
    defaultValue: 'development',
    alias: 'e',
  },
});

// Set the env file
const result2 = dotenv.config({
  path: path.join(__dirname, `./env/${args.env}.env`),
});
if (result2.error) {
  throw result2.error;
}
