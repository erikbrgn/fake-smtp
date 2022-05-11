const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require("mailparser").simpleParser;

const options = {};

const server = new SMTPServer({
  onAuth(auth, session, callback) {
    console.info("SMTP login for user: " + auth.username);
    callback(null, {
      user: auth.username,
    });
  },
  onData(stream, session, callback) {
    parseEmail(stream).then((mail) => {
      console.debug(JSON.stringify(mail, null, 2));
      callback();
    }, callback);
  },
});

function parseEmail(stream) {
  return simpleParser(stream).then((email) => {
    return email;
  });
}

console.info("SMTP server is listening on port 25.");

server.on("error", (err) => {
  console.error(err);
});

server.listen(587);
