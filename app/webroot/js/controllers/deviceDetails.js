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

  $scope.chartConfig = {
    options: {
      chart: {
        zoomType: 'xy'
      },
      title: {
        text: 'Device Water Data'
      },
      xAxis: [],
      yAxis: [],
      tooltip: {
        shared: true
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 0,
        floating: true,
        backgroundColor: '#FFFFFF'
      }
    },
    series: []
  };

  $scope.clearChart = function(){
    $scope.chartConfig.xAxis = [];
    $scope.chartConfig.series = [];
    $scope.chartConfig.options.yAxis = [];
  };

  var formatTime = function (timeStr) {
    if (timeStr == undefined) return undefined;
    else return timeStr.substring(5,10);
  }

  var createYAxisObj = function (params){

    if (params.title == undefined)
      return;

    var obj = {};

    obj.labels = {};
    obj.labels.style = {};
    obj.labels.style.color = params.color || "#89A54E";

    obj.title = {};
    obj.title.text = params.title;
    obj.title.style = {};
    obj.title.style.color = params.color || "#89A54E";

    obj.opposite = params.opposite || false;

    return obj;
  }

  function drawData(data){
    var colors = ["#89A54E", "#AA4643", "#4572A7"];
    var on_left = false;
    var x = 0;

    for (var i in data){
      var times = [];
      var values = [];

      $scope.chartConfig.options.yAxis.push(createYAxisObj({ color: colors[x], title: i, opposite: on_left }));

      for (var a = 0; a < data[i].data.length; a++){
        times.push(data[i].data[a].time);
        values.push(parseFloat(data[i].data[a].val));
      }

      if ($scope.chartConfig.xAxis == undefined)
        $scope.chartConfig.xAxis = [];
      $scope.chartConfig.xAxis.push({categories: times});
      $scope.chartConfig.series.push({
        name: i,
        color: colors[x],
        type: 'line',
        yAxis: x,
        data: values,
        tooltip: {
          valueSuffix: data[i].unit || ''
        }
      });

      x++;
      on_left = !on_left;
    }
    $scope.$apply();
  }

  var addDataWithDates = function (){
    var request = DataService.getDataWithDates($scope.deviceID, $scope.dateStart,$scope.dateEnd);
    if ( request == undefined )
      return;

    request.done(drawData);
  }

  var addData = function (){
    var request = DataService.getData($scope.deviceID);
    if ( request == undefined )
      return;

    request.done(drawData);
  }

  addData();

  $scope.submit = function(){
    $scope.clearChart();
    addDataWithDates();
  };
});
