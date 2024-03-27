import chalk from "chalk";

const styledLog = (...args: any[]) => console.log(...args);
Object.setPrototypeOf(styledLog, console.log);

styledLog.success = (...messages: any[]) => {
  const styledMessages = messages.map(message => chalk.green(message));
  styledLog(...styledMessages);
};

styledLog.error = (...messages: any[]) => {
  const styledMessages = messages.map(message => chalk.red.bold(message));
  styledLog(...styledMessages);
};

styledLog.warning = (...messages: any[]) => {
  const styledMessages = messages.map(message => chalk.yellow(message));
  styledLog(...styledMessages);
};

styledLog.info = (...messages: any[]) => {
  const styledMessages = messages.map(message => chalk.blue(message));
  styledLog(...styledMessages);
};

styledLog.muted = (...messages: any[]) => {
  const styledMessages = messages.map(message => chalk.gray(message));
  styledLog(...styledMessages);
};

styledLog.underline = (...messages: any[]) => {
  const styledMessages = messages.map(message => chalk.underline(message));
  styledLog(...styledMessages);
};

styledLog.bold = (...messages: any[]) => {
  const styledMessages = messages.map(message => chalk.bold(message));
  styledLog(...styledMessages);
};

styledLog.inverse = (...messages: any[]) => {
  const styledMessages = messages.map(message => chalk.inverse(message));
  styledLog(...styledMessages);
};

export default styledLog;
