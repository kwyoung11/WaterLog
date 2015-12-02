var deviceApp = angular.module('deviceApp', ["highcharts-ng"]);

deviceApp.controller('deviceDetails', function ($scope) {
  $scope.pageClass = 'page-deviceDetails';
  //console.log(DataService.getRainFallData());

  $scope.getDeviceID = function(){
    var idNumber = 0;
    var sub="/devices/";
    var startPosition = sub.length;
    $scope.deviceID = window.location.pathname.substring(startPosition);
  };

  $scope.getDeviceID();

  $scope.randomizeData = function () {
    var all_series = this.chartConfig.series;
    for (var j = 0; j < all_series.length; j++){
      var series = all_series[j];
      for (var i = 0; i < series.data.length; i++){
        series.data[i] = Math.floor(Math.random() * 20) + 1;
      }
    }
  }

  $scope.swapChartType = function () {
    if (this.chartConfig.options.chart.type === 'line') {
      this.chartConfig.options.chart.type = 'bar'
    } else {
      this.chartConfig.options.chart.type = 'line'
      this.chartConfig.options.chart.zoomType = 'x'
    }
  }

  var pHRepeat = true;
  var tempRepeat = true;
  var turbidityRepeat = true;

  $scope.addpH = function (){
    console.log($scope.dateStart);
    DataService.getpHData($scope.deviceID).then(function(data){
      var times = [];
      var values = [];
      console.log(data);
      var i = 0;
      if (data.length - 50 >=0){
        i = data.length - 50;
      }
      for (; i < data.length; i++){
        times.push(data[i].time.substring(5,10));
        values.push(parseFloat(data[i].value));
      }
      if (!Array.isArray($scope.chartConfig.xAxis)){
        $scope.chartConfig.xAxis = [];
      }

      times.sort();

      if(pHRepeat == true){
        $scope.chartConfig.xAxis.push({categories: times});

        $scope.chartConfig.series.push({
          name: 'pH',
          color: '#4572A7',
          type: 'line',
          yAxis: 1,
          data: values,
          tooltip: {
            valueSuffix: ' mm'
          }
        });
        $scope.$apply();
        pHRepeat = false;
      }
    });
  }

  $scope.addTurbidity = function (){
    DataService.getTurbidityData($scope.deviceID).then(function(data){

      var times = [];
      var values = [];
      var i = 0;
      if (data.length - 50 >=0){
        i = data.length - 50;
      }
      for (; i < data.length; i++){
        times.push(data[i].time.substring(5,10));
        values.push(parseFloat(data[i].value));
      }
      if (!Array.isArray($scope.chartConfig.xAxis)){
        $scope.chartConfig.xAxis = [];
      }

      times.sort();

      if(turbidityRepeat == true){
        $scope.chartConfig.xAxis.push({categories: times});

        $scope.chartConfig.series.push({
          name: 'Turbidity',
          type: 'spline',
          color: '#AA4643',
          yAxis: 2,
          data: values,
          marker: {
            enabled: false
          },
          dashStyle: 'shortdot',
          tooltip: {
            valueSuffix: ' mb'
          }
        })
        turbidityRepeat = false;
        $scope.$apply();
      }
    });
  }

  $scope.addTemperature = function (){
    DataService.getTemperatureData($scope.deviceID).then(function(data){
      var times = [];
      var values = [];
      var i = 0;
      if (data.length - 50 >=0){
        i = data.length - 50;
      }
      for (; i < data.length; i++){
        times.push(data[i].time.substring(5,10));
        values.push(parseFloat(data[i].value));
      }
      if (!Array.isArray($scope.chartConfig.xAxis)){
        $scope.chartConfig.xAxis = [];
      }

      times.sort();

      if(tempRepeat == true){
        $scope.chartConfig.xAxis.push({categories: times});

        $scope.chartConfig.series.push({
          name: 'Temperature',
          type: 'column',
          color: '#89A54E',
          yAxis: 0,
          data: values,
          //dashStyle: 'shortdot',
          tooltip: {
            valueSuffix: '°C'
          }
        });
        $scope.$apply();
        tempRepeat = false;
     }
    });
  }



  $scope.chartConfig = {
      options: {
          chart: {
              type: 'bar'
          }
      },
      series: [{
          data: [10, 15, 12, 8, 7]
      }],
      title: {
          text: 'Hello'
      },
      loading: false
  }


  $scope.chartConfig = {
    options: {
      chart: {
        zoomType: 'xy'
      },
      title: {
        text: 'Device Water Data'
      },
      xAxis: [{
        categories: []
      }],
      yAxis: [{ //Primary yAxis
        labels: {
          formatter: function () {
            return this.value + '°C';
          },
          style: {
            color: '#89A54E'
          }
        },
        title: {
          text: 'Temperature',
          style: {
            color: '#89A54E'
          }
        },
        opposite: true

      }, { // Secondary yAxis
        gridLineWidth: 0,
        title: {
          text: 'pH',
          style: {
            color: '#4572A7'
          }
        },
        labels: {
          formatter: function () {
            return this.value + ' mm';
          },
          style: {
            color: '#4572A7'
          }
        }
      }, { // Tertiary yAxis
        gridLineWidth: 0,
        title: {
          text: 'Turbidity',
          style: {
            color: '#AA4643'
          }
        },
        labels: {
          formatter: function () {
            return this.value + ' mb';
          },
          style: {
            color: '#AA4643'
          }
        },
        opposite: true
      }],
      tooltip: {
        shared: true
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 80,
        floating: true,
        backgroundColor: '#FFFFFF'
      }
    },
    series: []
  };

  $scope.clearedChart = {};
  angular.copy($scope.chartConfig, $scope.clearedChart);


  $scope.addpH();
  $scope.addTemperature();
  $scope.addTurbidity();


  $scope.addTemperatureWithDates = function (){
    DataService.getTemperatureDataWithDates($scope.deviceID, $scope.dateStart,$scope.dateEnd).then(function(data){
      var times = [];
      var values = [];
      var i = 0;
      if (data.length - 50 >=0){
        i = data.length - 50;
      }

      for (; i < data.length; i++){
        times.push(data[i].time.substring(5,10));
        values.push(parseFloat(data[i].value));
      }
      if (!Array.isArray($scope.chartConfig.xAxis)){
        $scope.chartConfig.xAxis = [];
      }

      times.sort();

      if(tempRepeat == true){
        $scope.chartConfig.xAxis.push({categories: times});

        $scope.chartConfig.series.push({
          name: 'Temperature',
          type: 'column',
          color: '#89A54E',
          yAxis: 0,
          data: values,
          //dashStyle: 'shortdot',
          tooltip: {
            valueSuffix: '°C'
          }
        });
        $scope.$apply();
        tempRepeat = false;
     }
    });
  };

  $scope.addTurbidityWithDates = function (){
    DataService.getTurbidityDataWithDates($scope.deviceID, $scope.dateStart,$scope.dateEnd).then(function(data){

      var times = [];
      var values = [];

      var i = 0;
      if (data.length - 50 >=0){
        i = data.length - 50;
      }

      for (; i < data.length; i++){
        times.push(data[i].time.substring(5,10));
        values.push(parseFloat(data[i].value));
      }
      if (!Array.isArray($scope.chartConfig.xAxis)){
        $scope.chartConfig.xAxis = [];
      }

      times.sort();

      if(turbidityRepeat == true){
        $scope.chartConfig.xAxis.push({categories: times});

        $scope.chartConfig.series.push({
          name: 'Turbidity',
          type: 'spline',
          color: '#AA4643',
          yAxis: 2,
          data: values,
          marker: {
            enabled: false
          },
          dashStyle: 'shortdot',
          tooltip: {
            valueSuffix: ' mb'
          }
        })
        turbidityRepeat = false;
        $scope.$apply();
      }
    });
  };

  $scope.addpHWithDates = function (){
    console.log($scope.dateStart);
    DataService.getpHDataWithDates($scope.deviceID, $scope.dateStart,$scope.dateEnd).then(function(data){
      var times = [];
      var values = [];
      var i = 0;
      if (data.length - 50 >=0){
        i = data.length - 50;
      }
      for (; i < data.length; i++){
        times.push(data[i].time.substring(5,10));
        values.push(parseFloat(data[i].value));
      }
      if (!Array.isArray($scope.chartConfig.xAxis)){
        $scope.chartConfig.xAxis = [];
      }

      times.sort();

      if(pHRepeat == true){
        $scope.chartConfig.xAxis.push({categories: times});

        $scope.chartConfig.series.push({
          name: 'pH',
          color: '#4572A7',
          type: 'line',
          yAxis: 1,
          data: values,
          tooltip: {
            valueSuffix: ' mm'
          }
        });
        $scope.$apply();
        pHRepeat = false;
      }
    });
  };
  $scope.clearChart = function(){

    pHRepeat = true;
    tempRepeat = true;
    turbidityRepeat = true;
    $scope.chartConfig = {};
    angular.copy($scope.clearedChart, $scope.chartConfig);


  };

  $scope.submit = function(){
    $scope.clearChart();
    $scope.addTemperatureWithDates();
    $scope.addTurbidityWithDates();
    $scope.addpHWithDates();

  };




});
