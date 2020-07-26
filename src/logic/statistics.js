
function factorial(n) {
    if (n <= 1) {
        return 1;
    }
    return factorial(n-1) * n;
}


function binomialCoefficient(n, k) {
    return factorial(n) / (factorial(k) * (factorial(n - k)))
}


function solutionSpaceEstimationForGroup(n, kMin, kMax) {
    let total = 0;

    for (let k=kMin; k <= kMax; k++) {
        total += binomialCoefficient(n, k)
    }

    return total
}

export {factorial,
        solutionSpaceEstimationForGroup}
