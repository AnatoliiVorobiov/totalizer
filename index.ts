type User = string
type Score = `${number}:${number}`
type Bet = { user: User, score: Score }
type Points = 0 | 1 | 2
type WinResult = `${User}:${Points}`

const results: Bet[] = [
    {user: 'John', score: '10:1'},
    {user: 'Paul', score: '5:5'},
    {user: 'George', score: '3:2'},
]

const calculateWins = (bets: Bet[], gameResult: Score): WinResult[] => {
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
            (gameHomeScore > gameAwayScore && userHomeScore > userAwayScore) ||
            (gameHomeScore < gameAwayScore && userHomeScore < userAwayScore)
        )
        const isUserLost = !isUserWon && !isUserGuessedTheOutcome

        if (isUserWon) acc[0].push(`${bet.user}:2` as WinResult)
        if (isUserGuessedTheOutcome) acc[1].push(`${bet.user}:1` as WinResult)
        if (isUserLost) acc[2].push(`${bet.user}:0` as WinResult)

        return acc
    }, accumulator);


    return results.flat()
}


console.log(
    calculateWins(results, '3:2')
)
