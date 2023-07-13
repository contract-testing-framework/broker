import morgan from "morgan";
import rfs from "rotating-file-stream";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const srcDir = dirname(fileURLToPath(import.meta.url));

const reqLogString =
  '[:date[web]] REQ ":method :url HTTP/:http-version" - :req[Ngrok-Auth-User-Email]';

const resLogString =
  '[:date[web]] RES ":method :url HTTP/:http-version" - :req[Ngrok-Auth-User-Email] - :status - :res[content-length] bytes in :response-time[3] ms';

// create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(srcDir, "/../log"),
});

export default {
  console: {
    req() {
      return morgan(reqLogString, {
        immediate: true,
        skip(req, _res) {
          return /(png|favicon|javascripts|stylesheets)/.test(req.path);
        },
      });
    },
    res() {
      return morgan(resLogString, {
        skip(req, res) {
          return (
            /(png|favicon|javascripts|stylesheets)/.test(req.path) &&
            res.statusCode < 400
          );
        },
      });
    },
  },
  file: {
    req() {
      return morgan(reqLogString, {
        immediate: true,
        stream: accessLogStream,
        skip(req, _res) {
          return /(png|favicon|javascripts|stylesheets)/.test(req.path);
        },
      });
    },
    res() {
      return morgan(resLogString, {
        stream: accessLogStream,
        skip(req, res) {
          return (
            /(png|favicon|javascripts|stylesheets)/.test(req.path) &&
            res.statusCode < 400
          );
        },
      });
    },
  },
  new(formatString, immediate = false, stream = undefined) {
    const options = {};
    if (immediate) {
      options.immediate = true;
    }
    if (stream) {
      options.stream = stream;
    }
    return morgan(formatString, options);
  },
  accessLogStream,
  reqLogString,
  resLogString,
};
