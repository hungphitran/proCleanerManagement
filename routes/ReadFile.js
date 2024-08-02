
var fs = require('fs');

exports.readAvatar = function (req, res) {
  var urlTemp = req.url+'';
  var urlRequest = checkParamVersion(req,urlTemp);
  var fileType = getFileType(urlRequest);
  switch(fileType)
  {
    case '.jpg' :
        readFileJPG('public/images/'+urlRequest, req, res);
        break;
    case '.png' :
        readFilePNG('public/images/'+urlRequest, req, res);
        break;
    case '.gif' :
        readFileGIF('public/images/'+urlRequest, req, res);
        break;
    case '.jpeg' :
        readFileJPEG('public/images/'+urlRequest, req, res);
        break;
    case '.JPG' :
        readFileJPG('public/images/'+urlRequest, req, res);
        break;
    case '.PNG' :
        readFilePNG('public/images/'+urlRequest, req, res);
        break;
    case '.GIF' :
        readFileGIF('public/images/'+urlRequest, req, res);
        break;
    case '.JPEG' :
        readFileJPEG('public/images/'+urlRequest, req, res);
        break;   
  }
}


exports.readFile = function (req, res) {

  var urlTemp = req.url+'';
  var urlRequest = checkParamVersion(req,urlTemp);
  var fileType = getFileType(urlRequest);
  
  switch(fileType)
  {
    case '.html' :
        readFileHTML(urlRequest, req, res);
        break;
    case '.css' :
        readFileCSS(urlRequest, req, res);
        break;
    case '.js' :
        readFileJS(urlRequest, req, res);
        break;
    case '.jpg' :
        readFileJPG('AngularJS'+urlRequest, req, res);
        break;
    case '.png' :
        readFilePNG('AngularJS'+urlRequest, req, res);
        break;
    case '.gif' :
        readFileGIF('AngularJS'+urlRequest, req, res);
        break;
    case '.jpeg' :
        readFileJPEG('AngularJS'+urlRequest, req, res);
        break;
    case '.tff' :
        readFileTFF(urlRequest, req, res);
        break;
    case '.woff' :
        readFileWOFF(urlRequest, req, res);
        break; 
    case '.HTML' :
        readFileHTML(urlRequest, req, res);
        break;
    case '.CSS' :
        readFileCSS(urlRequest, req, res);
        break;
    case '.js' :
        readFileJS(urlRequest, req, res);
        break;
    case '.JPG' :
        readFileJPG('AngularJS'+urlRequest, req, res);
        break;
    case '.PNG' :
        readFilePNG('AngularJS'+urlRequest, req, res);
        break;
    case '.GIF' :
        readFileGIF('AngularJS'+urlRequest, req, res);
        break;
    case '.JPEG' :
        readFileJPEG('AngularJS'+urlRequest, req, res);
        break;
    case '.TFF' :
        readFileTFF(urlRequest, req, res);
        break;
    case '.WOFF' :
        readFileWOFF(urlRequest, req, res);
        break;     
    default : 
        readFileHOME(urlRequest, req, res);
        break;
  }
}

function readFileWOFF(url, req, res) {

  fs.readFile('AngularJS'+url, function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }

    else {
       res.writeHead(200, { 'Content-Type': 'application/font-woff' });
       res.end(content, 'utf-8');
      }
    });
}

function readFileTFF(url, req, res) {

  fs.readFile('AngularJS'+url, function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }

    else {
       res.writeHead(200, { 'Content-Type': 'application/x-font-ttf' });
       res.end(content, 'utf-8');
      }
    });
}

function readFileJPEG(url, req, res) {

  fs.readFile(url, function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }

    else {
       res.writeHead(200, { 'Content-Type': 'image/jpeg' });
       res.end(content, 'utf-8');
      }
    });
}

function readFilePNG(url, req, res) {

  fs.readFile(url, function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }

    else {
       res.writeHead(200, { 'Content-Type': 'image/png' });
       res.end(content, 'utf-8');
      }
    });
}

function readFileGIF(url, req, res) {

  fs.readFile(url, function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }

    else {
       res.writeHead(200, { 'Content-Type': 'image/gif' });
       res.end(content, 'utf-8');
      }
    });
}

function readFileJPG(url, req, res) {

  fs.readFile(url, function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }

    else {
       res.writeHead(200, { 'Content-Type': 'image/jpg' });
       res.end(content, 'utf-8');
      }
    });
}

function readFileJS(url, req, res) {

  fs.readFile('AngularJS'+url, function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }

    else {
       res.writeHead(200, { 'Content-Type': 'text/javascript' });
       res.end(content, 'utf-8');
      }
    });
}
function readFileCSS(url,req, res) {

  fs.readFile('AngularJS'+url, function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }

    else {
       res.writeHead(200, { 'Content-Type': 'text/css' });
       res.end(content, 'utf-8');
      }
    });
}

function readFileHTML(url,req, res) {

  fs.readFile('AngularJS'+url, function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }

    else {
       res.writeHead(200, { 'Content-Type': 'text/html' });
       res.end(content, 'utf-8');
      }
    });
}
function readFileHOME(url,req, res) {

  fs.readFile('AngularJS/Views/index.html', function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }
    else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
      }
    });
}

function getFileType(url)
{
    var position = url.lastIndexOf('.');
    return url.substring(position,url.length);
}

function checkParamVersion(req,url)
{
    var v = req.params;
    return v['0'];
}