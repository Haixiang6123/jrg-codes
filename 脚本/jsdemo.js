#!/usr/bin/env node

var fs = require('fs')
var path = require('path')

var dirName = process.argv[2];

if (fs.existsSync(dirName)) {
    console.error('Error: directory ' + dirName + ' exists')
    process.exit(1)
}
else {
    // mkdir dirName
    fs.mkdirSync(dirName)
    // cd dirName
    process.chdir(dirName)

    // mkdir css, js
    fs.mkdirSync('css')
    fs.mkdirSync('js')

    // touch index.html
    fs.writeFileSync('index.html', '<!DOCTYPE>\n<title>Hello</title>\n<h1>Hi</h1>')
    fs.writeFileSync(path.join('css', 'styles.css'), 'h1{color: red;}')
    fs.writeFileSync(path.join('js', 'main.js'), 'var string = "Hello World"\nalert(string)')

    console.log('Success!')
    process.exit(0)
}