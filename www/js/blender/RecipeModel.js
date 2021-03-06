/**
 * Each services for the Blender application
 */
angular.module('blenderModelRecipe', [])

/**
* Class User
*/
.factory('RecipeModel', ['$q', '$http', function ($q, $http) {
 
    /**
    * Constructor, with class name
    */
    function Recipe() {
        this.uuid;
        this.name;
        this.author;
        this.forked;
        this.updated;
        this.steps = [];
    }

    /**
     * Public method
     * @return {string} uuid
     */
    Recipe.prototype.getUuid = function () {
        return this.uuid;
    };

    /**
    * Public method
    * @return {string} name
    */
    Recipe.prototype.getName = function () {
        return this.name;
    };

    /**
    * Public method
    * @return {object} author
    */
    Recipe.prototype.getAuthor = function () {
        return this.author;
    };

    /**
     * Public method
     * @return {object} forked
     */
    Recipe.prototype.getForked = function () {
        return this.forked;
    };

    /**
     * Public method
     * @return {object} updated
     */
    Recipe.prototype.getUpdated = function () {
        return this.updated;
    };

    /**
    * Public method
    * @return {json} all steps
    */
    Recipe.prototype.getSteps = function () {
        return this.steps;
    };

    /**
     * Public method
     * @param {int} uuid
     * @return {void}
     */
    Recipe.prototype.setUuid = function(uuid){
        this.uuid = uuid;
    }

    /**
    * Public method
    * @param {string} name
    * @return {void}
    */
    Recipe.prototype.setName = function (name) {
        this.name = name;
    };

    /**
    * Public method
    * @param {object} author
    * @return {void}
    */
    Recipe.prototype.setAuthor = function (author) {
        this.author = author;
    };

    /**
     * Public method
     * @param {String} uuid
     * @return {void}
     */
    Recipe.prototype.setForked = function (uuid) {
        this.forked = uuid;
    };

    /**
     * Public method
     * @param {Date} date
     * @return {void}
     */
    Recipe.prototype.setUpdated = function (date) {
        this.updated = date;
    };

    /**
    * Public method
    * @param {json} steps
    */
    Recipe.prototype.setSteps = function (steps) {
        this.steps = steps;
    };

    /**
    * Public method
    * @param {int} order
    * @param {string} action
    * @param {json} value
    */
    Recipe.prototype.pushStep = function (order, action, value) {
        this.steps.push({order: order, action: action, value: value});
    };


    /**
     * Public mehod
     * Format data to post in string format
     * @return {string} Data format to send in post request
     */
    Recipe.prototype.formatToSend = function(){

        // Create data
        var data = {}
        data.uuid = this.getUuid();
        data.author = '';
        if(this.getAuthor() != undefined){

            if(typeof this.getAuthor() == 'string'){
                data.author = this.getAuthor();
            }else{
                data.author = this.getAuthor().getUuid();
            }
            
        }
        data.name = this.getName();
        data.forked = this.getForked();
        data.updated = this.getUpdated();
        data.steps = [];

        // Get all steps of recipe
        var thisSteps = this.getSteps();
        for(var key in thisSteps){
            var step = {};
            step.action = thisSteps[key].action;
            step.order = thisSteps[key].order;

            // Get all parameters of recipe
            step.parameters = [];
            step.parameters.push(
                {
                    name : 'ingredient',
                    value : thisSteps[key].value.uuid
                });
            step.parameters.push(
                {
                    name : 'dosage',
                    value : thisSteps[key].value.parameters
                });
            data.steps.push(step);
        }

        return JSON.stringify(data);

    }

    /**
    * Static method
    * Create new user
    * @return {User} (empty)
    */
    Recipe.build = function(data) {
        return new Recipe();
    };
    
    /**
    * Return the constructor function
    */
    return Recipe;

}])