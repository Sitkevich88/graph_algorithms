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

const positions = {
    "Брест":{x:-99, y:365},
    "Вильнюс":{x:41, y:220},
    "Витебск":{x:539, y:267},
    "Волгоград":{x:826, y:658},
    "Воронеж":{x:657, y:570},
    "Даугавпилс":{x:258, y:108},
    "Донецк":{x:569, y:466},
    "Житомир":{x:116, y:438},
    "Казань":{x:1133, y:238},
    "Калининград":{x:-200, y:171},
    "Каунас":{x:9, y:102},
    "Киев":{x:315, y:355},
    "Кишинев":{x:-24, y:651},
    "Минск":{x:231, y:198},
    "Москва":{x:710, y:200},
    "Мурманск":{x:610, y:-168},
    "Ниж.Новгород":{x:995, y:168},
    "Одесса":{x:161, y:695},
    "Орел":{x:837, y:336},
    "Рига":{x:138, y:50},
    "С.Петербург":{x:607, y:9},
    "Самара":{x:1157, y:387},
    "Симферополь":{x:320, y:672},
    "Таллинн":{x:351, y:1},
    "Уфа":{x:1296, y:323},
    "Харьков":{x:536, y:385},
    "Ярославль":{x:819, y:114}
};

const elements = {
    nodes: cities.map(city => {
        const node = {
            data: { id: city }
        };
        const position = positions[city];
        if (position !== undefined)
            node.position = position;

        return node;
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
        name: 'preset',
    }
});

const nodes = cy.nodes();
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
