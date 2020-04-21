

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


function checkUpperRestrictions(searcher, checkers) {

    for (let i in checkers) {
        if (!checkers[i].checkUpper(searcher)) {
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


function* search({searcher, items, checkers, statistics, breakEvery}) {

    const indexes = [0];

    let index = 0;

    const itemsLength = items.length;

    let steps = 0;

    while (index >= 0) {

        if (itemsLength <= indexes[index]) {
            indexes.pop();
            index -= 1;
            indexes[index] += 1;
            searcher.backward();
            continue
        }

        statistics.checkedSolutions += 1;

        steps += 1;

        if (steps % breakEvery == 0) {
            yield null;
        }

        searcher.forward(items[indexes[index]]);

        if (!checkUpperRestrictions(searcher, checkers)) {
            searcher.backward();
            indexes[index] += 1;
            continue
        }

        if (checkLowerRestrictions(searcher, checkers)) {
            statistics.scoredSolutions += 1;
            searcher.acceptCurrentSolution(scoreSolution(searcher.items, checkers));
        }

        indexes.push(indexes[index] + 1);
        index += 1;
    }
}


export {search,
        SolutionSearcher,
        detailedSolutionScore};
