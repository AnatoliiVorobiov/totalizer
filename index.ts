type User = string
type Score = `${number}:${number}`
type Bet = { user: User, score: Score }
type Points = 0 | 1 | 2
type WinResult = `${User}:${Points}`
type Strategy = (bets: Bet[], gameResult: Score) => WinResult[]

/**
 * Best approach for the team readability, but with extra memory usage
 * Time complexity: O(2n) => O(n), considering the flat method is doing n iterations
 * Memory complexity: O(3n) => O(n)
 */
const calculateWins: Strategy = (bets: Bet[], gameResult: Score): WinResult[] => {
    const [gameHomeScore, gameAwayScore] = gameResult.split(':').map(Number)

    const accumulator = [
        [], // Winners (2 points)
        [], // Correct outcome (1 point)
        [], // Losses (0 points)
    ] as WinResult[][];

    const results = bets.reduce((acc, bet) => {
        const [userHomeScore, userAwayScore] = bet.score.split(':').map(Number)

        const isUserWon = gameHomeScore === userHomeScore && gameAwayScore === userAwayScore
        const isUserGuessedTheOutcome = !isUserWon && (
            (gameHomeScore > gameAwayScore && userHomeScore > userAwayScore) || // Home team win guess
            (gameHomeScore < gameAwayScore && userHomeScore < userAwayScore) || // Away team win guess
            (gameHomeScore == gameAwayScore && userHomeScore == userAwayScore) // Draw guess
        )
        const isUserLost = !isUserWon && !isUserGuessedTheOutcome

        if (isUserWon) acc[0].push(`${bet.user}:2` as WinResult)
        if (isUserGuessedTheOutcome) acc[1].push(`${bet.user}:1` as WinResult)
        if (isUserLost) acc[2].push(`${bet.user}:0` as WinResult)

        return acc
    }, accumulator);


    return results.flat()
}

/**
 * Optimized for memory usage, but less readable
 * Memory complexity: O(n)
 * Time complexity: O(n)
 */
const calculateWinsOptimized: Strategy = (bets: Bet[], gameResult: Score): WinResult[] => {
    const [gameHomeScore, gameAwayScore] = gameResult.split(':').map(Number)

    const results: WinResult[] = new Array(bets.length)

    let winnerPointer = 0
    let guessPointer = 0
    let lostPointer = bets.length - 1
    for (const bet of bets) {
        const [userHomeScore, userAwayScore] = bet.score.split(':').map(Number)

        const isUserWon = gameHomeScore === userHomeScore && gameAwayScore === userAwayScore
        const isUserGuessedTheOutcome = !isUserWon && (
            (gameHomeScore > gameAwayScore && userHomeScore > userAwayScore) || // Home team win guess
            (gameHomeScore < gameAwayScore && userHomeScore < userAwayScore) || // Away team win guess
            (gameHomeScore == gameAwayScore && userHomeScore == userAwayScore) // Draw guess
        )
        const isUserLost = !isUserWon && !isUserGuessedTheOutcome

        if (isUserWon) {
            const winnerPositionIsOccupied = results[winnerPointer];
            if (winnerPositionIsOccupied) results[guessPointer] = winnerPositionIsOccupied
            results[winnerPointer++] = `${bet.user}:2` as WinResult
            guessPointer++
        }
        if (isUserGuessedTheOutcome) results[guessPointer++] = `${bet.user}:1` as WinResult
        if (isUserLost) results[lostPointer--] = `${bet.user}:0` as WinResult
    }

    return results
}


// Simple testing section
// The would be put under a test file, but for the sake of simplicity, it's here
// ----–––––––––---------
const targets: { name: string, strategy: Strategy }[] = [
    { name: 'calculateWins', strategy: calculateWins },
    { name: 'calculateWinsOptimized', strategy: calculateWinsOptimized },
];

type TestCase = {
    description: string,
    bets: Bet[],
    gameResult: Score,
    expected: WinResult[]
}

const testCases: TestCase[]  = [
    {
        description: 'should correctly calculate wins, guesses, and losses',
        bets: [
            { user: 'Alice', score: '2:1' },
            { user: 'Bob', score: '1:2' },
            { user: 'Charlie', score: '3:1' },
            { user: 'Bob', score: '1:1' }
        ],
        gameResult: '2:1',
        expected: ['Alice:2', 'Charlie:1', 'Bob:0', 'Bob:0']
    },
    {
        description: 'should handle all guesses',
        bets: [
            {user: 'Alice', score: '4:0'},
            {user: 'Bob', score: '5:2'},
            {user: 'Charlie', score: '3:1'},
        ],
        gameResult: '3:2',
        expected: ['Alice:1', 'Bob:1', 'Charlie:1'],
    },
    {
        description: 'should handle all losses',
        bets: [
            { user: 'Alice', score: '0:0' },
            { user: 'Alice', score: '1:3' }
        ],
        gameResult: '2:1',
        expected: ['Alice:0', 'Alice:0']
    },
    {
        description: 'should handle all wins',
        bets: [
            { user: 'Alice', score: '2:1' },
            { user: 'Bob', score: '2:1' }
        ],
        gameResult: '2:1',
        expected: ['Alice:2', 'Bob:2']
    }
];

targets.forEach(target => {
    console.log(`\nTesting ${target.name}`);
    testCases.forEach(testCase => {
        const result = target.strategy(testCase.bets, testCase.gameResult);
        const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);

        console.log(`${testCase.description}: ${passed ? 'PASSED' : 'FAILED'}`);
    });
});
