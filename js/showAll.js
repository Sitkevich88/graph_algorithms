let city1 = selectors[0].value;
let city2 = selectors[1].value;
const l = 5;


selectors[0].addEventListener('change', function () {
    city1 = selectors[0].value;
});

selectors[1].addEventListener('change', function () {
    city2 = selectors[1].value;
});

document.querySelector('#button8').addEventListener('click', function (){
    clear();
});

document.querySelector('#button1').addEventListener('click', function (){
    clear();
    const path = bfs(city1, city2);
    console.log(path);
});

document.querySelector('#button2').addEventListener('click', function (){
    clear();
    const path = dfs(city1, city2);
    console.log(path);
});

document.querySelector('#button3').addEventListener('click', function (){
    clear();
    const path = dls(city1, city2, l);
    console.log(path);
});

document.querySelector('#button4').addEventListener('click', function (){
    clear();
    const path = iddfs(city1, city2);
    console.log(path);
});

document.querySelector('#button5').addEventListener('click', function (){
    clear();
    const path = bidirectionalBFS(city1, city2);
    console.log(path);
});

document.querySelector('#button6').addEventListener('click', function (){
    clear();
    const path = bestFirst(city1, city2);
    console.log(path);
});

document.querySelector('#button7').addEventListener('click', function (){
    clear();
    const path = bestOptimal(city1, city2);
    console.log(path);
});


//Этап 1

//const path = bfs(city1, city2);
//const path = dfs(city1, city2);
//const path = dls(city1, city2, l);
//const path = iddfs(city1, city2);
//const path = bidirectionalBFS(city1, city2);

//Этап 2

//const path = bestFirst(city1, city2);
//const path = bestOptimal(city1, city2);

//console.log(path);