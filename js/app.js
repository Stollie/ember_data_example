$(function() {
/************************** * Application **************************/ 
    App = Ember.Application.create({});
    // Sideloads
//    DS.RESTAdapter.configure('App.Motionlog', {
//        sideloadsAs: 'motionlogs'
//    });

/************************** * ChartConfig **************************/ 
    App.ChartConfig = Ember.Object.extend({
        chart: null,
        setChart : function() {
            var chart = {
                renderTo : 'graph1',
                type: 'line',
                zoomType: 'x'
            };
            this.set('chart', chart);
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 5000 // 5 sec
        },
        yAxis: {
             title: {
                 text: 'x 1000'
             }
         },
        plotOptions: {
            series: {
                 pointInterval: 500 // 0.5 sec
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b><br/>',
            shared: true
        },
        series : null
    });

    App.graphController = Ember.ObjectController.create({
        content : null,
        createGraph : function(seriesData) {
            var chart = App.ChartConfig.create();
            chart.set('series', seriesData);
            chart.setChart();
            this.set('content', chart);
        },
        renderChart : function() {
            var data = this.get('content');
            new Highcharts.Chart($.extend({}, data));
        }
    });
/************************** * RESTAdapter **************************/  
    // Prefix for url
    DS.RESTAdapter.reopen({
      namespace: 'api/v1'
    });

    // Data Store
    App.Store = DS.Store.extend({
        revision: 12,
        adapter: 'DS.RESTAdapter'
    });
    
/************************** * Routes **************************/    
    App.Router.map(function() {
        this.resource("exercise", {path: "/exercises/:exercise_id"});
        this.resource("editExercise", {path: "/exercises/:exercise_id/edit"});
    });
    
    App.ExerciseRoute = Ember.Route.extend({
        model: function(params) {
            return App.Exercise.find(params.exercise_id);
        },
        setupController: function(controller, model) {
            var data = App.Exercise.find(model.id);
            controller.set('model',data);
            controller.set('content',data);
	    // Timeout for creating the graph. Wait on data from API.
	    // There should be a nicer fix with ember?
            setTimeout(function(){
                controller.addGraph();  
            }, 3000);
        }
    });
    /*
     * Default route
     */
    App.ApplicationRoute = Ember.Route.extend({
        model: function() {
	    // Load Exercises
            return App.ExerciseListing.find();
        }        
    });
/************************** * Models **************************/
    /*
     * List model
     *  Gets the all the exercises  
    */
    App.ExerciseListing = DS.Model.extend({
        name: DS.attr('string'),
        createdAt: DS.attr('string')
    });
    /*
     * Exercise model
     */
    App.Exercise = DS.Model.extend({
        name: DS.attr('string'),
        createdAt: DS.attr('string'),
        updatedAt: DS.attr('string'),
        motionlogs: DS.hasMany('App.Motionlog')
    });
    /*
     * Motionlog Model
     */
    App.Motionlog = DS.Model.extend({
        roll: DS.attr('number'),
        pitch: DS.attr('number'),
        yaw: DS.attr('number'),
        accelx: DS.attr('number'),
        accely: DS.attr('number'),
        accelz: DS.attr('number'),
        gyrox: DS.attr('number'),
        gyroy: DS.attr('number'),
        gyroz: DS.attr('number'),
        exercise: DS.belongsTo('App.Exercise')
    });

/************************** * Views **************************/
App.ExerciseView = Ember.View.extend({
    click: function(evt) {
        this.get('controller').send('startDisco'); 
    }
});
/************************** * Controllers **************************/
    App.ExerciseController = Ember.ObjectController.extend({
        addGraph: function(){
            var content = this.get('content');
            var data = content.get('motionlogs');
            
            var pitch = new Array();
            var roll = new Array();
            var yaw = new Array();
            
            var accelX = new Array();
            var accelY = new Array();
            var accelZ = new Array();
            var gyroX = new Array();
            var gyroY = new Array();
            var gyroZ = new Array();
            
            var oefening1couter = 0;
            // Put all data in new arrays for the graph
            data.forEach(function(element, index){
                pitch.push(parseFloat(element.get('pitch')) );
                roll.push(parseFloat(element.get('roll')) );
                yaw.push(parseFloat(element.get('yaw')) );
                
                accelX.push(parseFloat(element.get('accelx')) );
                accelY.push(parseFloat(element.get('accely')) );
                accelZ.push(parseFloat(element.get('accelz')) );
                
                // Check for motion, an example for our project
                if (parseFloat(Math.round(parseFloat(element.get('gyroy')))) > 3) {
                    oefening1couter = oefening1couter + 1;
                    $("#counter").html(oefening1couter);
                }
                gyroX.push(parseFloat(element.get('gyrox')) );
                gyroY.push(parseFloat(element.get('gyroy')) );
                gyroZ.push(parseFloat(element.get('gyroz')) );                
            });

            var graphdata = [
                {name:"Pitch values", data: pitch},
                {name:"Roll values", data: roll},
                {name:"Yaw values", data: yaw},
                {name:"Accel X", data: accelX},
                {name:"Accel Y", data: accelY},
                {name:"Accel Z", data: accelZ},
                {name:"Gyro X", data: gyroX},
                {name:"Gyro Y", data: gyroY},
                {name:"Gyro X", data: gyroZ}
            ];
            App.graphController.createGraph(graphdata);
            App.graphController.renderChart();                
        },
        startDisco: function() {
            var content = this.get('content');
            var data = content.get('motionlogs');
            var $colorbox = $("#colorbox");
            var $colorbox_console = $("#colorbox-console");
            $colorbox.html('');
            
	    // Need to muliply the data to get good colors.
            var multi = 1000;
            var counter = 0;
            data.forEach(function(element, index){
                counter ++;
                setTimeout(function(){
		    // Show the gradient data @ page
                    var bgcolor = 'linear-gradient('+Math.round(parseFloat(element.get('roll'))*100)+'deg, rgb('+Math.round(parseFloat(element.get('accelx'))*multi)+','+Math.round(parseFloat(element.get('accely'))*multi)+','+Math.round(parseFloat(element.get('accelz'))*multi)+') 0%,rgb('+Math.round(parseFloat(element.get('gyrox'))*multi)+','+Math.round(parseFloat(element.get('gyroy'))*multi)+','+Math.round(parseFloat(element.get('gyroz'))*multi)+') 100%)';
                    $colorbox_console.html(bgcolor);
		    // Set background
                    $colorbox.css("background", bgcolor);
                }, counter * 1400);                
            });
        }               
    });
});