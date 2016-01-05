var ejs = require('ejs');
var pathFn = require('path');
var fs = require('fs');

ejs.filters.cdata = function(str){
  return str ? '<![CDATA[' + str + ']]>' : '';
};

var atomTmplSrc = pathFn.join(__dirname, '../atom.ejs');
var atomTmpl = ejs.compile(fs.readFileSync(atomTmplSrc, 'utf8'));
var rss2TmplSrc = pathFn.join(__dirname, '../rss2.ejs');
var rss2Tmpl = ejs.compile(fs.readFileSync(rss2TmplSrc, 'utf8'));
var itunesTmplSrc = pathFn.join(__dirname, '../itunes.ejs');
var itunesTmpl = ejs.compile(fs.readFileSync(itunesTmplSrc, 'utf8'));

module.exports = function(locals){
  var config = this.config;
  var feedConfig = config.feed;

  switch(feedConfig.type){
    case 'rss2':
      template = rss2Tmpl;
      break;
    case 'atom':
      template = atomTmpl;
      break;
    case 'itunes':
      template = itunesTmpl;
      break;
    default:
      template = rss2Tmpl;
      break;
  }

  var posts = locals.posts.sort('-date');
  if (feedConfig.limit) posts = posts.limit(feedConfig.limit);

  var url;

  // Sorry for that, it is hexo URL handling way.
  if (config.root === '/'){
    url = config.url + config.root;
  }
  else
  {
    url = config.url + '/';
  }

  // And sorry for that too.
  url = url.replace(/([^:])\/\//g, '$1/');

  var xml = template({
    config: config,
    url: url,
    posts: posts,
    feed_url: config.root + feedConfig.path
  });

  return {
    path: feedConfig.path,
    data: xml
  };
};