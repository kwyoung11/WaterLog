enviroHubApp.controller('devicesDetailsController', function ($scope, DataService) {
  $scope.pageClass = 'page-deviceDetails';
  console.log(DataService.getRainFallData());

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

  $scope.addRainFall = function (){
    DataService.getRainFallData().then(function(data){
      $scope.chartConfig.series.push({
        name: 'Rainfall',
        color: '#4572A7',
        type: 'column',
        yAxis: 1,
        data: data,
        tooltip: {
          valueSuffix: ' mm'
        }
      })
    });
  }

  $scope.addSeaLevelPressure = function (){
    DataService.getSeaLevelPressureData().then(function(data){
      $scope.chartConfig.series.push({
                  name: 'Sea-Level Pressure',
                  type: 'spline',
                  color: '#AA4643',
                  yAxis: 2,
                  data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
                  marker: {
                      enabled: false
                  },
                  dashStyle: 'shortdot',
                  tooltip: {
                      valueSuffix: ' mb'
                  }
      })
    });
  }

  $scope.addTemperature = function (){
    DataService.getTemperatureData().then(function(data){
      $scope.chartConfig.series.push({
          name: 'Temperature',
          color: '#89A54E',
          type: 'spline',
          data: data,
          tooltip: {
              valueSuffix: '°C'
          }
      })
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }],
      yAxis: [{ // Primary yAxis
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
          text: 'Rainfall',
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
