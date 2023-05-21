// Generated by CoffeeScript 2.7.0
(function() {
  var fs, i18nStringsFiles;

  fs = require('fs');

  i18nStringsFiles = function() {};

  i18nStringsFiles.prototype.readFile = function(file, options, callback) {
    var encoding, wantsComments;
    encoding = null;
    wantsComments = false;
    // check if encoding was excluded and callback specified as 2nd param
    if (typeof callback === "undefined" && typeof options === "function") {
      callback = options;
      encoding = null;
    } else if (typeof options === "string") { // for backward compatibility
      encoding = options;
    } else if (typeof options === "object") {
      encoding = options['encoding'];
      wantsComments = options['wantsComments'];
    }
    // read passed in file
    return fs.readFile(file, (err, buffer) => {
      var data, str;
      // if there's an error, callback with it and return
      if (err) {
        return typeof callback === "function" ? callback(err, null) : void 0;
      }
      // convert buffer from file into utf-8 string, then parse
      str = this.convertBufferToString(buffer, encoding);
      data = this.parse(str, wantsComments);
      return typeof callback === "function" ? callback(null, data) : void 0;
    });
  };

  i18nStringsFiles.prototype.readFileSync = function(file, options) {
    var buffer, encoding, str, wantsComments;
    encoding = null;
    wantsComments = false;
    if (typeof options === 'string') {
      encoding = options;
    } else if (typeof options === 'object') {
      encoding = options['encoding'];
      wantsComments = options['wantsComments'];
    }
    // read the passed in file and convert to utf-8 string
    buffer = fs.readFileSync(file);
    str = this.convertBufferToString(buffer, encoding);
    // pass file contents string to parse() and return
    return this.parse(str, wantsComments);
  };

  i18nStringsFiles.prototype.writeFile = function(file, data, options, callback) {
    var buffer, encoding, str, wantsComments;
    encoding = null;
    wantsComments = false;
    // check if encoding was excluded and callback specified as 2nd param
    if (typeof callback === "undefined" && typeof options === "function") {
      callback = options;
      encoding = null;
    } else if (typeof options === "string") { // for backward compatibility
      encoding = options;
    } else if (typeof options === "object") {
      encoding = options['encoding'];
      wantsComments = options['wantsComments'];
    }
    // build string and convert from utf-8 to output buffer
    str = this.compile(data, options);
    buffer = this.convertStringToBuffer(str, encoding);
    // write buffer to file
    return fs.writeFile(file, buffer, (err) => {
      return typeof callback === "function" ? callback(err) : void 0;
    });
  };

  i18nStringsFiles.prototype.writeFileSync = function(file, data, options) {
    var buffer, encoding, str, wantsComments;
    encoding = null;
    wantsComments = false;
    if (typeof options === 'string') {
      encoding = options;
    } else if (typeof options === 'object') {
      encoding = options['encoding'];
      wantsComments = options['wantsComments'];
    }
    // build string and convert from utf-8 to output buffer
    str = this.compile(data, options);
    buffer = this.convertStringToBuffer(str, encoding);
    // write buffer to file
    return fs.writeFileSync(file, buffer);
  };

  i18nStringsFiles.prototype.convertBufferToString = function(buffer, encoding) {
    if (!encoding) {
      encoding = 'utf8';
    }
    // convert buffer to utf-8 string and return
    return buffer.toString(encoding);
  };

  i18nStringsFiles.prototype.convertStringToBuffer = function(str, encoding) {
    if (!encoding) {
      encoding = 'utf8';
    }
    // convert string from utf-8 to buffer in output encoding
    return Buffer.from(str, encoding);
  };

  i18nStringsFiles.prototype.parse = function(input, wantsComments) {
    var currentComment, currentId, currentValue, lines, nextLineIsComment, nextLineIsValue, reAssign, reCommentEnd, reLineEnd, result;
    if (!wantsComments) {
      wantsComments = false;
    }
    // patterns used for parsing
    reAssign = /[^\\]" = "/;
    reLineEnd = /";$/;
    reCommentEnd = /\*\/$/;
    // holds resulting hash
    result = {};
    // splt into lines
    lines = input.split("\n");
    // previous comment
    currentComment = '';
    currentValue = '';
    currentId = '';
    nextLineIsComment = false;
    nextLineIsValue = false;
    // process line by line
    lines.forEach(function(line) {
      var msgid, msgstr, val;
      // strip extra whitespace
      line = line.trim();
      // normalize spacing around assignment operator
      line = line.replace(/([^\\])("\s*=\s*")/g, "$1\" = \"");
      // remove any space between final quote and semi-colon
      line = line.replace(/"\s+;/g, '";');
      // check if starts with '/*', store it in currentComment var
      if (nextLineIsComment) {
        if (line.search(reCommentEnd) === -1) {
          currentComment += '\n' + line.trim();
          return;
        } else {
          nextLineIsComment = false;
          currentComment += '\n' + line.substr(0, line.search(reCommentEnd)).trim();
          return;
        }
      } else if (line.substr(0, 2) === '//') {
        currentComment = line.substr(2).trim();
        return;
      } else if (line.substr(0, 2) === '/*' && !nextLineIsValue) {
        if (line.search(reCommentEnd) === -1) {
          nextLineIsComment = true;
          currentComment = line.substr(2).trim();
          return;
        } else {
          nextLineIsComment = false;
          currentComment = line.substr(2, line.search(reCommentEnd) - 2).trim();
          return;
        }
      }
      msgid = '';
      msgstr = '';
      if (line === '' && !nextLineIsValue) {
        return;
      }
      // check if starts with '/*', store it in currentComment var
      if (nextLineIsValue) {
        if (line.search(reLineEnd) === -1) {
          currentValue += '\n' + line.trim();
          return;
        } else {
          nextLineIsValue = false;
          currentValue += '\n' + line.substr(0, line.search(reLineEnd)).trim();
          msgid = currentId;
          msgstr = currentValue;
          currentId = '';
          currentValue = '';
        }
      } else if (line.search(reLineEnd) === -1 && !nextLineIsComment) {
        nextLineIsValue = true;
        currentId = line;
        currentId = currentId.substr(1);
        currentId = currentId.substr(0, currentId.search(reAssign) + 1);
        currentId = currentId.replace(/\\"/g, "\"");
        currentValue = line;
        currentValue = currentValue.substr(currentValue.search(reAssign) + 6);
        return;
      } else {
        // get msgid
        msgid = line;
        msgid = msgid.substr(1);
        msgid = msgid.substr(0, msgid.search(reAssign) + 1);
        // get msg str
        msgstr = line;
        msgstr = msgstr.substr(msgstr.search(reAssign) + 6);
        msgstr = msgstr.substr(0, msgstr.search(reLineEnd));
        // convert escaped quotes
        msgid = msgid.replace(/\\"/g, "\"");
      }
      msgstr = msgstr.replace(/\\"/g, "\"");
      // convert escaped new lines
      msgid = msgid.replace(/\\n/g, "\n");
      msgstr = msgstr.replace(/\\n/g, "\n");
      if (!wantsComments) {
        return result[msgid] = msgstr;
      } else {
        val = {
          'text': msgstr
        };
        if (currentComment) {
          val['comment'] = currentComment;
          currentComment = '';
        }
        return result[msgid] = val;
      }
    });
    // return resulting object
    return result;
  };

  i18nStringsFiles.prototype.compile = function(data, wantsComments) {
    var comment, msgid, msgstr, output, val;
    if (!wantsComments) {
      wantsComments = false;
    }
    // make sure data is an object
    if (typeof data !== "object") {
      return "";
    }
    // output string
    output = "";
// loop through hash
    for (msgid in data) {
      val = data[msgid];
      msgstr = '';
      comment = null;
      if (typeof val === 'string') {
        msgstr = val;
      } else {
        if (val.hasOwnProperty('text')) {
          msgstr = val['text'];
        }
        if (wantsComments && val.hasOwnProperty('comment')) {
          comment = val['comment'];
        }
      }
      // escape quotes in msgid, msgstr
      msgid = msgid.replace(/"/g, "\\\"");
      msgstr = msgstr.replace(/"/g, "\\\"");
      // escape new lines in msgid, msgstr
      msgid = msgid.replace(/\n/g, "\\n");
      msgstr = msgstr.replace(/\r?\n/g, "\\n");
      // add comment if available
      if (comment) {
        if (/^(MARK|TODO|FIXME)/.test(comment) && comment.indexOf('\n') === -1) {
          output = output + "// " + comment + " \n";
        } else {
          output = output + "/* " + comment + " */\n";
        }
      }
      // add line to output
      output = output + "\"" + msgid + "\" = \"" + msgstr + "\";\n";
    }
    // return output string
    return output;
  };

  module.exports = new i18nStringsFiles();

}).call(this);
