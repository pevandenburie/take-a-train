
function getUserPictureUrl(user) {
  return 'http://wwwin.cisco.com/dir/photo/std/' + user + '.jpg';
}

function getUserDirectoryUrl(user) {
  return 'http://wwwin-tools.cisco.com/dir/details/' + user;
}

function getUserIMUrl(user) {
  return 'xmpp:' + user + '@cisco.com';
}

function getUserMailtoUrl(user) {
  return 'mailto:' + user + '@cisco.com';
}
