const table = [
    ['Вильнюс', 'Брест', 531],
    ['Витебск', 'Брест', 638],
    ['Витебск', 'Вильнюс', 360],
    ['Воронеж', 'Витебск', 869],
    ['Воронеж', 'Волгоград', 581],
    ['Волгоград', 'Витебск', 1455],
    ['Витебск', 'Ниж.Новгород', 911],
    ['Вильнюс', 'Даугавпилс', 211],
    ['Калининград', 'Брест', 699],
    ['Калининград', 'Вильнюс', 333],
    ['Каунас', 'Вильнюс', 102],
    ['Киев', 'Вильнюс', 734],
    ['Киев', 'Житомир', 131],
    ['Житомир', 'Донецк', 863],
    ['Житомир', 'Волгоград', 1493],
    ['Кишинев', 'Киев', 467],
    ['Кишинев', 'Донецк', 812],
    ['С.Петербург', 'Витебск', 602],
    ['С.Петербург', 'Калининград', 739],
    ['С.Петербург', 'Рига', 641],
    ['Москва', 'Казань', 815],
    ['Москва', 'Ниж.Новгород', 411],
    ['Москва', 'Минск', 690],
    ['Москва', 'Донецк', 1084],
    ['Москва', 'С.Петербург', 664],
    ['Мурманск', 'С.Петербург', 1412],
    ['Мурманск', 'Минск', 2238],
    ['Орел', 'Витебск', 522],
    ['Орел', 'Донецк', 709],
    ['Орел', 'Москва', 368],
    ['Одесса', 'Киев', 487],
    ['Рига', 'Каунас', 267],
    ['Таллинн', 'Рига', 308],
    ['Харьков', 'Киев', 471],
    ['Харьков', 'Симферополь', 639],
    ['Ярославль', 'Воронеж', 739],
    ['Ярославль', 'Минск', 940],
    ['Уфа', 'Казань', 525],
    ['Уфа', 'Самара', 461], //last
];

const cities = table.map(arr=>arr.slice(0, -1))
    .flatMap(city => city)
    .sort()
    .filter((city, i, nonUniqueCities)=>{
        return city !== nonUniqueCities[i+1];
    });

const graph = {};

table.forEach(trainLine => {
    //editing graph object
    const city1 = trainLine[0];
    const city2 = trainLine[1];
    if (!graph.hasOwnProperty(city1))
        graph[city1] = [];
    if (!graph.hasOwnProperty(city2))
        graph[city2] = [];
    if (!graph[city1].includes(city2))
        graph[city1].push(city2);
    if (!graph[city2].includes(city1))
        graph[city2].push(city1);
});

console.log(graph);

const elements = {
    nodes: cities.map((city, i) => {
        return {
            data: { id: city },
            //position: { x: 30*i, y: 150 + Math.random()*300 }
        };
    }),
    edges: table.map(line => {
        return { data: { id: line[0]+line[1], weight: line[2], source: line[0], target: line[1]} };
    })
};

const cy = cytoscape({
    container: document.getElementById('cy'),

    style: cytoscape.stylesheet()
        .selector('node')
        .style({
            'content': 'data(id)'
        })
        .selector('edge')
        .style({
            'curve-style': 'bezier',
            'width': 3,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd'
        })
        .selector('.new')
        .style({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
        })
        .selector('.start')
        .style({
            'background-color': '#fc6197',
            'line-color': '#fc6197',
            'target-arrow-color': '#fc6197',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
        })
        .selector('.end')
        .style({
            'background-color': '#1c0a1c',
            'line-color': '#1c0a1c',
            'target-arrow-color': '#1c0a1c',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
        }),

    elements: elements,
    layout: {
        name: 'breadthfirst',
    }
});

const nodes = cy.elements();
const edges = cy.edges();

function getNodeId(city){
    for (let i = 0; i < cities.length; i++) {
        if (cities[i] === city)
            return i;
    }
    return -1;
}


function getEdgeId(city1, city2){
    for (let i = 0; i < table.length; i++) {
        if (
            (table[i][0] === city1 && table[i][1] === city2)
            || (table[i][0] === city2 && table[i][1] === city1)
        )
            return i;
    }
    return -1;
}

function colourStartNode(city){
    nodes[getNodeId(city)].addClass('start');
}

function colourNewNode(city){
    nodes[getNodeId(city)].addClass('new');
}

function colourNewEdge(city1, city2){
    edges[getEdgeId(city1, city2)].addClass('new');
}

function colourEndEdge(city1, city2){
    edges[getEdgeId(city1, city2)].addClass('end');
}

function colourEndNode(city){
    nodes[getNodeId(city)].addClass('end');
}

function colourPath(path){
    for (let i = 1; i < path.length; i++) {
        colourEndNode(path[i]);
        colourEndEdge(path[i-1], path[i]);
    }
}

function clear(){
    nodes.forEach(node => {
        node.removeClass('start');
        node.removeClass('new');
        node.removeClass('end');
    });
    edges.forEach(edge => {
       edge.removeClass('new');
       edge.removeClass('end');
    });
}