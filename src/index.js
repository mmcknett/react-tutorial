import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component
{
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

    render() {
        const width = 3;
        const height = 3;

        let rows = [];
        for (let row = 0; row < height; ++row)
        {
            let cols = [];
            for (let col = 0; col < width; ++col)
            {
                cols[col] = this.renderSquare(row * width + col);
            }

            rows[row] = <div className="board-row">{cols}</div>;
        }

        return <div>{rows}</div>;
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            moveNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.moveNumber + 1);
        const current = history[this.state.moveNumber];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i])
        {
            // If someone won or the square isn't empty...
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares: squares}]),
            moveNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(move) {
        this.setState({
            moveNumber: move,
            xIsNext: (move % 2) === 0, // Update this if X ever starts second.
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.moveNumber];
        const winner = calculateWinner(current.squares);

        // Create list items of all the moves in history
        const moves = history.map((step, move) => {
            const description = move ? 'Move #' + move : 'Game start';
            const descWithFormat =
                move === this.state.moveNumber ?
                (
                    <b>{description}</b>
                )
                : description
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>
                    {descWithFormat}
                    </a>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        }
        else if (boardFull(current.squares))
        {
            status = "Cat's game.";
        }
        else
        {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; ++i)
    {
        const [a, b, c] = lines[i];
        if (squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c])
        {
            return squares[a];
        }
    }

    return null;
}

function boardFull(squares) {
    for (let i = 0; i < squares.length; ++i)
    {
        if (!squares[i])
        {
            return false;
        }
    }
    return true;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
