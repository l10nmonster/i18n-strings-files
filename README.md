i18n-strings-files
==================

[![Build Status](https://travis-ci.org/justinklemm/i18n-strings-files.png)](https://travis-ci.org/justinklemm/i18n-strings-files)

Node.js module for processing .strings files used for localization in iOS/OSX development

## Installing with [npm](http://npmjs.org/)

```
npm install i18n-strings-files
```

## Usage

i18n-strings-files can be used to read a .strings file and parse it into an object, or to compile an object into .strings format and write it to a file. The intermediate functions for parsing and compiling can also be used directly.

Note that specifying an encoding is optional. If an encoding is not specified, utf8 will be used.

### readFile(filename, [encoding or options], callback)
```js
// Include i18n-strings-files
var i18nStringsFiles = require('i18n-strings-files');

// Read 'Localizable.strings' and pass an object containing the key/value pairs to a callback
i18nStringsFiles.readFile('Localizable.strings', 'utf8', function(err, data){
    console.log(data);
});

// Read 'Localizable.strings' and pass an object containing the key/value pairs (each value contains 'text' and 'comment') to a callback
i18nStringsFiles.readFile('Localizable.strings', { 'encoding' : 'utf8', 'wantsComments' : true }, function(err, data){
    console.log(data);
});
```

### readFileSync(filename, [encoding or options])
```js
// Include i18n-strings-files
var i18nStringsFiles = require('i18n-strings-files');

// Read 'Localizable.strings' and return it as an object containing the key/value pairs
var data = i18nStringsFiles.readFileSync('Localizable.strings', 'utf8');
console.log(data);

// Read 'Localizable.strings' and return it as an object containing the key/value (each value contains 'text' and 'comment') pairs
var data = i18nStringsFiles.readFileSync('Localizable.strings', { 'encoding' : 'utf8', 'wantsComments' : true });
console.log(data);
```

### writeFile(filename, data, [encoding], callback)
```js
// Include i18n-strings-files
var i18nStringsFiles = require('i18n-strings-files');

// An object containing some properties
var data = {
    'key1': 'value1',
    'key2': 'value2'
};

// Write an object containing key/value pairs to file 'Localizable.strings', execute callback when done
i18nStringsFiles.writeFile('Localizable.strings', data, 'utf8', function(err){
    if(err) return console.log(err);
    console.log('File written');
});
```

### writeFile(filename, data, [options], callback)
```js
// Include i18n-strings-files
var i18nStringsFiles = require('i18n-strings-files');

// An object containing some properties
var data = {
    'key1': { 'text' : 'value1', 'comment' : 'comment1' },
    'key2': { 'text' : 'value2', 'comment' : 'comment2' }
};

// Write an object containing key/value pairs (with comments) to file 'Localizable.strings', execute callback when done
i18nStringsFiles.writeFile('Localizable.strings', data, { 'encoding' : 'utf8', 'wantsComments' : true }, function(err){
    if(err) return console.log(err);
    console.log('File written');
});
```

### writeFileSync(filename, data, [encoding or options])
```js
// Include i18n-strings-files
var i18nStringsFiles = require('i18n-strings-files');

// Write an object containing key/value pairs to file 'Localizable.strings'
i18nStringsFiles.writeFileSync('Localizable.strings', data, 'utf8');
console.log('File written');

// Write an object containing key/value pairs (with comments) to file 'Localizable.strings'
i18nStringsFiles.writeFileSync('Localizable.strings', data, { 'encoding' : 'utf8', 'wantsComments' : true });
console.log('File written');
```

### parse(input, [options])
```js
// Include i18n-strings-files
var i18nStringsFiles = require('i18n-strings-files');

// A string in the .strings file format
var input = '"key1" = "value1";'

// Parse .strings format string into object containing the key/value pairs
var data = i18nStringsFiles.parse(input);

// A string in the .strings file format
input = '/* comment1 */\n"key1" = "value1";'

// Parse .strings format string into object containing the key/value pairs
data = i18nStringsFiles.parse(input, { 'wantsComments' : true });
```

### compile(data, [options])
```js
// Include i18n-strings-files
var i18nStringsFiles = require('i18n-strings-files');

// An object containing some properties
var data = {
    'key1': 'value1',
    'key2': 'value2'
};

// Compile an object containing key/value pairs into a string in .strings file format
var str = i18nStringsFiles.compile(data);

// An object containing some properties
data = {
    'key1': { 'text' : 'value1', 'comment' : 'comment1' },
    'key2': { 'text' : 'value2', 'comment' : 'comment2' }
};

// Compile an object containing key/value pairs into a string in .strings file format
var str = i18nStringsFiles.compile(data, { 'wantsComments' : true });
```
