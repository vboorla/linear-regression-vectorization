var ctx = document.getElementById("scatterChart");
var cty = document.getElementById("gradientDescentChart");
var ts_plot = [];
var gd_plot = [];
var theta = [0.0, 0.0];
var J = 0.0;

for (var i = 0; i < trainingSet.length; i++) {
    ts_plot.push({
        x: trainingSet[i][0],
        y: trainingSet[i][1]
    });
}


let X,Y ;

X = math.eval('trainingSet[:,1]',{trainingSet});

y = math.eval('trainingSet[:,2]',{trainingSet});
    
m = y.length;
// Part 1: Cost

 // Add Intercept Term (Bias Unit)
 // 
X = math.concat(math.ones([m, 1]).valueOf(), X);

theta = [[0], [0]];
  

var datasets = [
    {
        label: "Housing Prices",
        backgroundColor: '#2196F3',
        borderColor: '#ffbb00',
        data: ts_plot
      }
    ];
var gdatasets = [
    {
        label: "Iterations v J (Cost)",
        backgroundColor: '#2196F3',
        borderColor: '#ffbb00',
        data: gd_plot
      }
    ];
var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: datasets
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});
var gradientDescentChart = new Chart(cty, {
    type: 'scatter',
    data: {
        datasets: gdatasets
    },
    options: {
        showLine: true,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});

scatterChart.update();

function computeCost() {
    let m = y.length;

  let predictions = math.eval('X * theta', {
    X,
    theta,
  });

  let sqrErrors = math.eval('(predictions - y).^2', {
    predictions,
    y,
  });
  
  let J = math.eval(`1 / (2 * m) * sum(sqrErrors)`, {
    m,
    sqrErrors,
  });
    return J.toFixed(3);
}

function gradientDescent(X, y, theta, ALPHA, ITERATIONS) {

    let m = y.length;

    let thetaZero = theta[0];
    let thetaOne = theta[1];
  
    for (let i = 0; i < ITERATIONS; i++) {
      let predictions = math.eval('X * theta', {
        X,
        theta: [thetaZero, thetaOne],
      });
  
      thetaZero = math.eval(`thetaZero - ALPHA * (1 / m) * sum(predictions - y)`, {
        thetaZero,
        ALPHA,
        m,
        predictions,
        y,
      });
  

      thetaOne = math.eval(`thetaOne - ALPHA * (1 / m) * sum((predictions - y) .* X[:, 2])`, {
        thetaOne,
        ALPHA,
        m,
        predictions,
        y,
        X,
      });  
      theta[0] = thetaZero;
      theta[1] = thetaOne;
      let J = computeCost();      
      plotDataGD(i, J);
      plotRLine(ts_plot, theta, datasets);
    }   
    
    return [thetaZero, thetaOne];
}


function startTimer() {
    //var timer = setInterval(timeNow,10);
    // Part 2: Gradient Descent
    let ITERATIONS = document.getElementById("iter").value;// 1500;
    let ALPHA = document.getElementById("alpha").value; // 0.01;
    output.innerHTML = '';
    gd_plot = [];
    theta = gradientDescent(X, y, theta, ALPHA, ITERATIONS);

    console.log('theta: ', theta);
    //output.innerHTML += '<br>J after ' + j + ' iterations : ' + J;
    output.innerHTML += '<br>h(x) : ' + theta[0] + ' + ' + theta[1] + 'x';

    /*function timeNow(){
    var d= new Date();
    console.log(d.toLocaleTimeString())
;}
    return timer;*/
}

function stopTimer(){
    clearInterval(timer);
}

function plotRLine(ts_plot, theta, datasets) {
    let theta_0 = theta[0];
    let theta_1 = theta[1];
    let rg_plot = [];
    let x = 0;
    let xmax = Math.max.apply(Math, ts_plot.map(function (o) {
        return o.x;
    }));
    let xmin = Math.min.apply(Math, ts_plot.map(function (o) {
        return o.x;
    }));
    for (var i = xmin; i <= xmax; i += 0.1) {
        h = parseFloat(theta[0]) + parseFloat(theta[1] * i);
        rg_plot.push({
            x: i,
            y: h
        });
    }
    let rdatasets = {};
    let temp = datasets.indexOf(getDatagraph(datasets, 'Regression Line'));

    if (temp == -1) {
        rdatasets.label = 'Regression Line';
        rdatasets.data = rg_plot;
        rdatasets.backgroundColor = '#ff0000';
        rdatasets.borderColor = '#4e00ff';
        datasets.push(rdatasets);
    } else {
        rdatasets = getDatagraph(datasets, 'Regression Line');
        datasets.splice(temp, 1);
        rdatasets.data = [];
        rdatasets.backgroundColor = '#ff0000';
        rdatasets.borderColor = '#4e00ff';
        rdatasets.data = rg_plot;
        datasets.push(rdatasets);
    }

    scatterChart.update();
}

function plotDataGD(iter, J) {
    gd_plot.push({
        x: iter,
        y: J
    });

    let gd_datasets = {};
    let temp = gdatasets.indexOf(getDatagraph(gdatasets, 'Iterations v J (Cost)'));

    if (temp == -1) {
        gd_datasets.label = 'Iterations v J (Cost)';
        gd_datasets.data = gd_plot;
        gd_datasets.backgroundColor = '#2196F3';
        gd_datasets.borderColor = '#ffbb00';
        gdatasets.push(gd_datasets);
    } else {
        gd_datasets = getDatagraph(gdatasets, 'Iterations v J (Cost)');
        gdatasets.splice(0);
        gd_datasets.data = [];
        gd_datasets.backgroundColor = '#2196F3';
        gd_datasets.borderColor = '#ffbb00';
        gd_datasets.data = gd_plot;
        gdatasets.push(gd_datasets);
    }
    gradientDescentChart.update();
}

function clearPlots() {

    let temp = datasets.indexOf(getDatagraph(datasets, 'Regression Line'));
    if (temp != -1) {
        datasets.splice(temp, 1);
        scatterChart.update();
    }
    let temp2 = gdatasets.indexOf(getDatagraph(gdatasets, 'Iterations v J (Cost)'));
    if (temp2 != -1) {
        gdatasets.splice(0);
        gradientDescentChart.clear();
    }
    J = 0.0;
    theta = [0.0, 0.0];
    output.innerHTML = '';
}


function getDatagraph(datasets, label) {
    for (let item of datasets) {
        if (item.label == label) return item;
    }
    return "Plot does not exist";
}
