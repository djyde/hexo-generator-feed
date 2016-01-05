var assign = require('object-assign');
var pathFn = require('path');

var config = hexo.config.feed = assign({
  type: 'atom',
  limit: 20
}, hexo.config.feed);

var type = config.type.toLowerCase();

// Check feed type
switch(type){
  case 'rss2':
    config.type = 'rss2';
    break;
  case 'atom':
    config.type = 'atom';
    break;
  case 'itunes':
    config.type = 'itunes';
    break;
  default:
    config.type = 'atom';
    break;
}

// Set default feed path
if (!config.path){
  config.path = config.type + '.xml';
}

// Add extension name if don't have
if (!pathFn.extname(config.path)){
  config.path += '.xml';
}

hexo.extend.generator.register('feed', require('./lib/generator'));