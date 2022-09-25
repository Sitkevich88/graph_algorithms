function getDistance(city1, city2){
    if (!cities.includes(city1) || !cities.includes(city2))
        return null;

    if (city1 === city2)
        return 0;

    for (let path of table){
        if (
            (path[0] === city1 && path[1] === city2)
            || (path[0] === city2 && path[1] === city1)
        ){
            return path[2];
        }
    }

    return null;
}

function DestinationsWithDistance(){
    cities.forEach(city => {
        this[city] = {previous: null, distance: null, visited: false};
    });
}

function getNodeDistances(city){
    if (!cities.includes(city))
        return [];

    const destinations = new DestinationsWithDistance();
    const queue = [];
    destinations[city] = {previous: null, distance: 0, visited: true};
    queue.push(city);

    while(queue.length > 0) { // Пока в очереди есть элементы
        const currentCity = queue.shift();

        for (let destination of graph[currentCity]){
            const newDistance = destinations[currentCity].distance
                + getDistance(currentCity, destination);

            if(destinations[destination].visited
                && destinations[destination].distance <= newDistance)
                continue;

            destinations[destination] = {
                previous: currentCity,
                distance: newDistance,
                visited: true
            };
            queue.push(destination);
        }
    }
    const result = {};
    cities.forEach(city => {
        result[city] = destinations[city].distance;
    });

    return result;
}

function trackJourneyWithDistance(destinationsWithDistance, city1, city2){
    const path = [city2];
    const distance = [];
    let previous = destinationsWithDistance[city2].previous;
    while (previous != null){
        distance.unshift(getDistance(previous, path[0]));
        path.unshift(previous);
        previous = destinationsWithDistance[previous].previous;
    }

    return {
        path: path,
        distance: distance,
        distanceSum: distance.reduce((acc, cur) => acc + cur, 0)
    };
}

function searchPathWithPreference(city1, city2, findBestCandidate){
    if (!cities.includes(city1) || !cities.includes(city2))
        return {
            path: [],
            distance: 0,
            distanceSum: 0
        };

    const destinations = new DestinationsWithDistance();
    const queue = [];
    destinations[city1] = {previous: null, distance: 0, visited: true};
    queue.push(city1);
    colourStartNode(city1);
    colourEndNode(city2);

    while(queue.length > 0) { // Пока в очереди есть элементы
        const currentCity = queue.pop();
        const candidates = [];

        for (let destination of graph[currentCity]){ //Смотрим соседей
            if(destinations[destination].visited)
                continue;

            candidates.push({
                city: destination,
                distance: getDistance(currentCity, destination)
            });

            if(city2 === destination) {
                colourNewEdge(currentCity, destination);
                destinations[destination] = {
                    previous: currentCity,
                    distance: candidates.pop().distance + destinations[currentCity].distance,
                    visited: true
                };
                const journey = trackJourneyWithDistance(destinations, city1, city2);
                colourPath(journey.path);
                return journey;
            }
        }

        let bestCandidate = findBestCandidate(candidates);

        if (bestCandidate.city != null){
            destinations[bestCandidate.city] = {
                previous: currentCity,
                distance: bestCandidate.distance + destinations[currentCity].distance,
                visited: true
            };
            queue.push(bestCandidate.city);
            colourNewNode(bestCandidate.city);
            colourNewEdge(currentCity, bestCandidate.city);
        }else if(destinations[currentCity].previous != null){
            queue.push(destinations[currentCity].previous);
        }
    }
    return {
        path: [],
        distance: 0,
        distanceSum: 0
    };
}

function bestFirst(city1, city2){
    const findBestCandidate = (candidates) => {
        let bestCandidate = {city: null, distance: Number.MAX_SAFE_INTEGER};
        candidates.forEach(candidate => {
            if (candidate.distance < bestCandidate.distance){
                bestCandidate = candidate;
            }
        });

        return bestCandidate;
    };

    return searchPathWithPreference(city1, city2, findBestCandidate);
}

function bestOptimal(city1, city2){
    const directDistances = getNodeDistances(city2);
    const findBestCandidate = (candidates) => {
        if(candidates.length === 0)
            return {city: null, distance: Number.MAX_SAFE_INTEGER};

        let bestCandidate = candidates[0];
        candidates.forEach(candidate => {
            if (directDistances[candidate.city] < directDistances[bestCandidate.city]){
                bestCandidate = candidate;
            }
        });

        return bestCandidate;
    };

    return searchPathWithPreference(city1, city2, findBestCandidate);
}
