var token;

var Optimizely = function (token){

  this.api = 'https://www.optimizelyapis.com/experiment/v1/'
  this.token = token;

};

/* get a list of all the entities of a certain type with the parent entity id */

Optimizely.prototype.list = function(entityType, id){

  var endpoint;

  if (entityType === 'projects'){
    endpoint = this.api + 'projects/';
  }
  else if (entityType === 'experiments' && id.length > 0){
    endpoint = this.api + 'projects/' + id + '/experiments/';
  }
  else if (entityType === 'variations' && id.length > 0){
    endpoint = this.api + 'experiments/' + id + '/variations/';
  }
  else if (entityType === 'audiences' && id.length > 0){
    endpoint = this.api + 'projects/' + id + '/audiences/';
  }
  else{
    Logger.log("Enter a valid endpoint")
  }

  var data = this.callAPI(this.token, endpoint)

  return data

};

/* get an entity of a certain type with the entity id */

Optimizely.prototype.getEntity = function(entity, id){

  var endpoint;

  if (entity === 'project' && id.length){
    endpoint = this.api + 'projects/' + id + '/';
  }
  else if (entity === 'experiments' && id.length > 0){
    endpoint = this.api + 'experiments/' + id + '/';
  }
  else if (entity === 'variations' && id.length > 0){
    endpoint = this.api + 'vatiations/' + id + '/';
  }
  else if (entity === 'audiences' && id.length > 0){
    endpoint = this.api + 'audiences/' + id + '/';
  }
  else if (entity === 'goals' && id.length > 0){
    endpoint = this.api + 'goals/' + id + '/';
  }
  else{
    Logger.log("Enter a valid endpoint")
  }

  var data = this.callAPI(this.token, endpoint)

  return data

};

/* generic API call to get data from any Optimizely API endpoint */

Optimizely.prototype.callAPI = function(token, endpoint){

  var headers = {'token' : token};
  var params = {'headers': headers};
  var response = UrlFetchApp.fetch(endpoint, params);
  var data = JSON.parse(response);

  return data

};

/* iterates over all projects in account and uses callback to operate on each project obj */

Optimizely.prototype.projectIterator = function (project_status_Array, callback) {

  var projList = this.list('projects');

  for (var p = 0; p < projList.length; p ++){
    var proj = projList[p];

    if ( project_status_Array.contains(proj.project_status) ){
      Logger.log( "Project: " + proj.project_name + ", Project ID: " + proj.id.toString())

      callback(proj)

    }
  }
}

/* iterates over all experiments in project and uses callback to operate on each experiment obj */

Optimizely.prototype.experimentIterator = function (status_Array, projectID, callback) {

  var expList = this.list('experiments', projectID);

  for (var x = 0; x < expList.length; x ++){
    var exp = expList[x];

    if ( status_Array.contains(exp.status) ){
      Logger.log( "Experiment: " + exp.description + ", Experiment ID: " + exp.id.toString())

      callback(exp)

    }
  }
}


Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
