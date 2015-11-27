enviroHubApp.controller('devicesDetailsController', function ($scope, DataService) {
  $scope.pageClass = 'page-deviceDetails';
  //console.log(DataService.getRainFallData());

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
    DataService.getpHData().then(function(data){
      var times = [];
      var values = [];


      for (var i = 0; i < data.length; i++){
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
          type: 'column',
          yAxis: 1,
          data: values,
          tooltip: {
            valueSuffix: ' mm'
          }
        });
        pHRepeat = false;
      }
    });
  }

  $scope.addTurbidity = function (){
    DataService.getTurbidityData().then(function(data){

      var times = [];
      var values = [];

      for (var i = 0; i < data.length; i++){
        times.push(data[i].time.substring(5,10));
        values.push(parseFloat(data[i].value));
      }
      if (!Array.isArray($scope.chartConfig.xAxis)){
        $scope.chartConfig.xAxis = [];
      }

      times.sort();

      if(turbidityRepeat== true){
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
      }
    });
  }

  $scope.addTemperature = function (){
    DataService.getTemperatureData().then(function(data){
      var times = [];
      var values = [];

      for (var i = 0; i < data.length; i++){
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
          color: '#89A54E',
          yAxis: 0,
          type: 'spline',
          data: values,
          tooltip: {
            valueSuffix: '°C'
          }
        })
        tempRepeat = false;
     }
    });
  }

  $scope.chartConfig = {
    options: {
      chart: {
        zoomType: 'xy'
      },
      title: {
        text: 'Average Monthly Weather Data for Tokyo'
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
          text: 'Sea-Level Pressure',
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

});
