/**
 * Each services for the Blender application
 */
angular.module('blenderService', [])

.factory('NavService', ['$rootScope', '$timeout', function($rootScope, $timeout){

    $rootScope.nav = {
        home: false,
        create: false,
        setting: false
    };

    $rootScope.displayGlobalSuccessMessage = false;
    $rootScope.displayGlobalErrorMessage = false;

    return{
        active: function(page){
            for(var i in $rootScope.nav){
                if(i === page){
                    $rootScope.nav[i] = true;
                }else{
                    $rootScope.nav[i] = false;
                }
            };
            $rootScope.pageTitle = page;
        },
        hide: function(){
            $rootScope.showNav = false;
        },
        show: function(){
            $rootScope.showNav = true;
        },
        setSuccessMessage: function(msg) {
            $rootScope.displayGlobalSuccessMessage = true;
            $rootScope.displayGlobalErrorMessage = false;
            $rootScope.globalSuccessMessage = msg;
            $timeout(function () {
                $rootScope.displayGlobalSuccessMessage = false;
                $rootScope.globalSuccessMessage = '';
            }, 5000);
        },
        setErrorMessage: function(msg) {
            $rootScope.displayGlobalErrorMessage = true;
            $rootScope.displayGlobalSuccessMessage = false;
            $rootScope.globalErrorMessage = msg;
            $timeout(function () {
                $rootScope.displayGlobalErrorMessage = false;
                $rootScope.globalErrorMessage = '';
            }, 5000);
        },
        setPageTitle: function(title){
            $rootScope.pageTitle = title;
            $rootScope.displayGlobalSuccessMessage = false;
            $rootScope.displayGlobalErrorMessage = false;
        },
        setNavCommunityItemTo : function(value, inverse){
            $rootScope.server = value;
            $rootScope.serverInverse = inverse
        }
    }

}])
/**
* Service for Session Html5 storage
*/
.factory('SessionService', ['UserModel', 'NavService', function(UserModel, NavService){
    return {

        /**
        * User Session
        */
        Users : {
            /*
            * Set User to session storage
            * -> strigify objet and save it with key 'user'
            * @param {user} user
            */
            set: function(user){
                localStorage.setItem('user', JSON.stringify(user));
            },
            /*
            * get User to session storage
            * -> get key 'user' and JsonParse the string
            * -> create a new user
            * @return {user} user
            */
            get: function(){

                var SessionUser = JSON.parse(localStorage.getItem('user'));

                if(SessionUser == undefined){
                    return false;
                }

                user = UserModel.build();
                // Voir avec l'ami romain pour fair un truc plus propre :)
                if(SessionUser.uuid){
                    user.setUuid(SessionUser.uuid);
                }
                if(SessionUser.userName){
                    user.setUserName(SessionUser.userName);
                }
                if(SessionUser.email){
                    user.setEmail(SessionUser.email);
                }
                if(SessionUser.community){
                    user.setCommunitys(SessionUser.community);
                }

                return user;

            },
        },
        Server : {
            setCurrent: function(server){
                localStorage.setItem('server/current', server);
            },
            getCurrent: function(){
                server = localStorage.getItem('server/current');
                if( server == 'community' ){
                    NavService.setNavCommunityItemTo('master', 'community');
                }else{
                    NavService.setNavCommunityItemTo('community', 'master');
                }
                return server;
            },
            setIP: function(ip, port){
                console.log('SET');
                localStorage.setItem('server/ip', 'http://'+ip+':'+port);
            },
            getIP: function() {
                var ip = localStorage.getItem('server/ip');
                return ip;
            }
        }
       
    }
}])

/**
* Service for Resourse to call api
*/
.factory('ApiService', [
    '$resource',
    '$http',
    '$q',
    'SessionService',
    function($resource, $http, $q, SessionService){
        return {
            recipes: function(server){

                return $resource(
                    server.uri + '/recipes',
                    {uuid:'@id'},
                    {
                        query: {
                            isArray: false,
                            method: 'GET'
                        },
                        save: {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            method: 'POST'
                        },
                        update: {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            method: 'PUT'
                        }
                    });
            },
            removeRecipe: function(masterUri, recipe) {
                var defered = $q.defer();
                $http.delete(
                    masterUri + '/recipes/' + recipe.uuid,
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                )
                .success(function(response){
                    defered.resolve(response);
                })
                .error(function(response){
                    defered.fail(response);
                });

                return defered.promise;
            },
            blendIt: function(masterUri, recipe){

                var defered = $q.defer();
                $http.post(
                    masterUri + '/execute',
                    'recipe=' + JSON.stringify(recipe),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                    )
                    .success(function(response){
                        defered.resolve(response);
                    })
                    .error(function(response){
                        defered.fail(response);
                    });

                return defered.promise;

            },
            ingredients: function(){
                return $resource(
                    SessionService.Server.getIP()+'/api/blender/ingredients/:uuid',
                    {uuid:'@id'}
                    );
            },
            modules: function(){
                return $resource(
                    SessionService.Server.getIP()+'/api/blender/modules'
                );
            },
            addModule: function(module){

                var defered = $q.defer();
                $http.post(
                    SessionService.Server.getIP()+'/api/blender/modules',
                    'module=' + JSON.stringify(module),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                )
                    .success(function(response){
                        defered.resolve(response);
                    })
                    .error(function(response){
                        defered.fail(response);
                    });

                return defered.promise;
            },
            editModule: function(module){

                var defered = $q.defer();
                $http.put(
                    '/api/blender/modules',
                    'module=' + JSON.stringify(module),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                )
                .success(function(response){
                    defered.resolve(response);
                })
                .error(function(response){
                    defered.fail(response);
                });

                return defered.promise;
            },
            deleteModule: function(module){

                var defered = $q.defer();
                $http.delete(
                    SessionService.Server.getIP()+'/api/blender/modules/' + module.order,
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                )
                    .success(function(response){
                        defered.resolve(response);
                    })
                    .error(function(response){
                        defered.fail(response);
                    });

                return defered.promise;
            }
        }
    }
])


/**
* Service for user
*/
.factory('UserService', ['$http', function($http){

    return{
        api : {
            getAll: function(communityUri, token) {
                return $http.get(communityUri + '/users');
            },
            get: function(communityUri, token, uuid) {
                return $http.get(communityUri + '/users/' + uuid);
            }
        }
    }

}])
