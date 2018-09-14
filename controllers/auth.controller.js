function AuthController(){
  let roles;
  function setRoles(role){
    roles = role;
  }
  function isAuthorized(neededRole){
    return roles.indexOf(neededRole) >= 0;
  }
  function isAuthorizedAsync(neededRole, cb){
    setTimeout(function(){cb(roles.indexOf(neededRole) >= 0)}, 1500);
  }
  function getIndex(req, res){
    res.render('index');
  }
  return {getIndex, isAuthorized, isAuthorizedAsync, setRoles};
}

module.exports = AuthController();