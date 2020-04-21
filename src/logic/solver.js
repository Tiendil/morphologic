

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


function checkUpperRestrictions(searcher, checkers, item) {

    for (let i in checkers) {
        if (!checkers[i].checkUpper(searcher, item)) {
            return false;
        }
    }

    return true;
}


function checkLowerRestrictions(searcher, checkers) {

    for (let i in checkers) {
        if (!checkers[i].checkLower(searcher)) {
            return false;
        }
    }

    return true;
}


function scoreSolution(items, checkers) {

    let score = 0;

    for (let i in checkers) {
        score += checkers[i].score(items);
    }

    return score;
}


function detailedSolutionScore(items, checkers) {

    let scores = [];

    for (let i in checkers) {
        const checker = checkers[i];
        const score = checker.score(items);

        if (score != 0) {
            scores.push({ruleId: checker.ruleId,
                         score: score});
        }
    }

    return scores;
}


function* search(searcher, items, checkers, nextItemIndex, statistics, counter) {

    counter.steps += 1;

    if (counter.steps % counter.breakEvery == 0) {
        yield null;
    }

    statistics.checkedSolutions += 1;

    if (checkLowerRestrictions(searcher, checkers)) {
        statistics.scoredSolutions += 1;

        searcher.acceptCurrentSolution(scoreSolution(searcher.items, checkers));
    }

    for (let i=nextItemIndex; i<items.length; i++) {

        const item = items[i];

        if (!checkUpperRestrictions(searcher, checkers, item)) {
            continue;
        }

        searcher.forward(item);

        for (let _ of search(searcher, items, checkers, i + 1, statistics, counter)) {
            yield null
        }

        searcher.backward();
    }
};


export {search,
        SolutionSearcher,
        detailedSolutionScore};
