

class Solution {

    constructor(items, score) {
        this.items = items;
        this.score = score;
    }
}


function solutionSorter(a, b) {
    if (a.score > b.score) {
        return -1;
    }

    if (a.score < b.score) {
        return 1;
    }

    return 0;
}


class Solutions {
    constructor(size) {
        this.size = size;
        this.solutions = [];
    }

    registerSolution(items, score) {

        if (this.solutions.length >= this.size && this.solutions[-1].score > score) {
            return false;
        }

        this.solutions.push(new Solution(items, score));

        this.solutions.sort(solutionSorter);

        if (this.solutions.length >= this.size) {
            this.solutions.pop();
        }
    }

    bestSolution() {
        if (this.solutions.length == 0) {
            return null;
        }

        return this.solutions[0];
    }
}



///////////////////////////////////////////
// Ideomatic, but highly unoptimised solver
///////////////////////////////////////////

class SolutionSearcher {

    constructor(bestSolutionsLimit) {
        this.items = [];
        this.solutions = new Solutions(bestSolutionsLimit)
    }

    depth() {
        return this.items.length;
    }

    forward(item) {
        this.items.push(item)
    }

    backward() {
        this.items.pop();
    }

    acceptCurrentSolution(cost) {
        this.solutions.registerSolution(this.items.slice(), cost);
    }

}


function checkUpperRestrictions(searcher, restrictions, item) {

    for (let i in restrictions) {
        if (!restrictions[i].checkUpper(searcher, item)) {
            return false;
        }
    }

    return true;
}


function checkLowerRestrictions(searcher, restrictions) {

    for (let i in restrictions) {
        if (!restrictions[i].checkLower(searcher)) {
            return false;
        }
    }

    return true;
}


function search(searcher, items, restrictions, nextItemIndex, statistics) {

    statistics.checkedSolutions += 1;

    if (checkLowerRestrictions(searcher, restrictions)) {
        statistics.ratedSolutions += 1;

        searcher.acceptCurrentSolution(searcher.depth());
    }

    for (let i=nextItemIndex; i<items.length; i++) {
        const item = items[i];

        if (!checkUpperRestrictions(searcher, restrictions, item)) {
            continue;
        }

        searcher.forward(item);

        search(searcher, items, restrictions, i + 1, statistics);

        searcher.backward();
    }
};



function solve(items, checkers, bestSolutionsLimit) {

    const statistics = {checkedSolutions: 0,
                        ratedSolutions: 0};

    const searcher = new SolutionSearcher(bestSolutionsLimit);

    search(searcher, items, checkers, 0, statistics);

    return {'solutions': searcher.solutions,
            'statistics': statistics};

}


export {solve};
