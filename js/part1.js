function Destinations(){
    cities.forEach(city => {
        this[city] = {previous: null, visited: false};
    });
}

function trackJourney(destinations, city1, city2){
    const path = [city2];
    let previous = destinations[city2].previous;
    while (previous != null){
        path.unshift(previous);
        previous = destinations[previous].previous;
    }

    return path;
}

function bfs(city1, city2){
    if (!cities.includes(city1) || !cities.includes(city2))
        return [];

    const destinations = new Destinations();
    const queue = [];
    destinations[city1].visited = true;
    queue.push(city1);
    colourStartNode(city1);
    colourEndNode(city2);

    while(queue.length > 0) { // Пока в очереди есть элементы
        const currentCity = queue.shift();

        for (let destination of graph[currentCity]){
            if(destinations[destination].visited)
                continue;

            queue.push(destination);
            destinations[destination] = {visited: true, previous: currentCity};
            colourNewEdge(currentCity, destination);

            if(city2 === destination){
                const path = trackJourney(destinations, city1, city2);
                colourPath(path);
                return path;
            }
            colourNewNode(destination);
        }
    }
    return [];
}

function dfs(city1, city2){
    if (!cities.includes(city1) || !cities.includes(city2))
        return [];

    const destinations = new Destinations();
    const queue = [];
    destinations[city1].visited = true;
    queue.push(city1);
    colourStartNode(city1);
    colourEndNode(city2);

    while(queue.length > 0) { // Пока в очереди есть элементы
        const currentCity = queue.pop();

        for (let destination of graph[currentCity]){ //Смотрим соседей
            if(destinations[destination].visited)
                continue;

            queue.push(destination);
            destinations[destination] = {visited: true, previous: currentCity};
            colourNewEdge(currentCity, destination);

            if(city2 === destination){
                const path = trackJourney(destinations, city1, city2);
                colourPath(path);
                return path;
            }
            colourNewNode(destination);

            break;
        }
        if (queue.length === 0 && destinations[currentCity].previous != null)
            queue.push(destinations[currentCity].previous);
    }
    return [];
}

function dls(city1, city2, limit){
    if (!cities.includes(city1) || !cities.includes(city2)){
        return [];
    }

    const destinations = new Destinations();
    const queue = [];
    destinations[city1].visited = true;
    queue.push(city1);
    colourStartNode(city1);
    colourEndNode(city2);

    while(queue.length > 0) { // Пока в очереди есть элементы
        let currentDepth = queue.length - 1;
        if (currentDepth >= limit){ // Корректировка глубины
            queue.pop();
            if (queue.length === 0)
                return [];
            currentDepth--;
        }
        const currentCity = queue[currentDepth];

        for (let destination of graph[currentCity]){ //Смотрим соседей
            if(destinations[destination].visited)
                continue;

            queue.push(destination);
            destinations[destination] = {visited: true, previous: currentCity};
            colourNewEdge(currentCity, destination);

            if(city2 === destination){
                const path = trackJourney(destinations, city1, city2);
                colourPath(path);
                return path;
            }
            colourNewNode(destination);
            break;
        }
        if (currentDepth === queue.length - 1){ // Если соседа не нашли, то идем на уровень выше
            queue.pop();
        }
    }
    return [];
}

function iddfs(city1, city2){
    for(let limit = 0; limit < cities.length; limit++){
        clear();
        const res = dls(city1, city2, limit);
        if(res.length > 0)
            return res;
    }
    return [];
}

function bidirectionalBFS(city1, city2){
    if (!cities.includes(city1) || !cities.includes(city2) || city1 === city2)
        return [];

    const destinations1 = new Destinations();
    const destinations2 = new Destinations();
    const queue1 = [];
    const queue2 = [];
    destinations1[city1].visited = true;
    destinations2[city2].visited = true;
    queue1.push(city1);
    queue2.push(city2);
    colourStartNode(city1);
    colourEndNode(city2);

    while(queue1.length > 0 && queue2.length > 0) {
        const pointer1 = queue1.shift();
        const pointer2 = queue2.shift();

        for (let destination of graph[pointer1]){
            if(destinations1[destination].visited)
                continue;

            queue1.push(destination);
            destinations1[destination] = {visited: true, previous: pointer1};
            colourNewNode(destination);
            colourNewEdge(pointer1, destination);
        }

        for (let destination of graph[pointer2]){
            if(destinations2[destination].visited)
                continue;

            queue2.push(destination);
            destinations2[destination] = {visited: true, previous: pointer2};
            colourNewEdge(pointer2, destination);
            colourNewNode(destination);
        }

        // find intersection
        for (let city of cities){
            if (destinations1[city].visited && destinations2[city].visited){
                const path = trackJourney(destinations1, city1, city)
                    .concat(
                        trackJourney(destinations2, city2, city)
                            .slice(0,-1)
                            .reverse()
                    );
                colourPath(path);
                return path;
            }
        }
    }
    return [];
}