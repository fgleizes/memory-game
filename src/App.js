import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
// import HallOfFame from './HallOfFame'
import HallOfFame, { FAKE_HOF } from './HallOfFame'

const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {
  state = {
    title: 'Memory Game',
    cards: this.generateCards(),
    currentPair: [],
    guesses: 0,
    matchedCardIndices: [],
    // error: null,
    // isLoaded: false,
    // hallOfFame: []
  }

  // componentDidMount() {
  //   // récupérer des données :
  //   fetch('http://localhost:8888/live13/datasHallOfFameMemory/datasHallOfFame.php')
  //     .then(response => response.json())
  //     .then(
  //       (result) => {
  //         this.setState({
  //           isLoaded: true,
  //           hallOfFame: result
  //         })
  //       },
  //       (error) => {
  //         this.setState({
  //           isLoaded: true,
  //           error
  //         });
  //       })

  //   // Envoyer des données : // NE MARCHE PAS //
  //   const url = 'http://localhost:8888/live13/datasHallOfFameMemory/datasHallOfFame.php';
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json;charset=UTF-8'
  //     },
  //     body: JSON.stringify({
  //       a: 10,
  //       b: 20
  //     })
  //   };

  //   fetch(url, options)
  //     .then(response => {
  //       console.log(response.status);
  //     });
  // }

  generateCards() {
    const result = []
    const size = SIDE * SIDE
    const candidates = shuffle(SYMBOLS)
    while (result.length < size) {
      const card = candidates.pop()
      result.push(card, card)
    }
    return shuffle(result)
  }

  getFeedbackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state
    const indexMatched = matchedCardIndices.includes(index)

    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
    }

    if (currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }

    return indexMatched ? 'visible' : 'hidden'
  }

  // Fonction fléchée pour le binding
  handleCardClick = index => {
    const { currentPair } = this.state

    if (currentPair.length === 2) {
      return
    }

    if (currentPair.length === 0) {
      this.setState({ currentPair: [index] })
      return
    }

    this.handleNewPairClosedBy(index)
  }

  handleNewPairClosedBy(index) {
    const { cards, currentPair, guesses, matchedCardIndices } = this.state

    const newPair = [currentPair[0], index]
    const newGuesses = guesses + 1
    const matched = cards[newPair[0]] === cards[newPair[1]]
    this.setState({ currentPair: newPair, guesses: newGuesses })
    if (matched) {
      this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
    }
    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
  }

  // handleHallOfFame() {
  //   console.log(this.state.hallOfFame)
  //   console.log(this.state.guesses)

  //   for (let i = 0; i < this.state.hallOfFame.length; i++) {
  //     if (this.state.guesses < this.state.hallOfFame[i].guesses) {
        
  //       console.log("Index => " + i)
  //       console.log(this.state.hallOfFame[i])

  //       const id = this.state.hallOfFame[i].id
  //       const player = this.state.player
  //       const guesses = this.state.guesses
  //       const date = new Date().toLocaleDateString()

  //       const newPlayer = {id, player, guesses, date}
  //       console.log("=== newPlayer ===")
  //       console.log(newPlayer)

  //       break;
  //     }
  //   }
  // }

  render() {
    const { cards, guesses, matchedCardIndices } = this.state
    const won = matchedCardIndices.length === cards.length
    
    // const won = true
    // this.state.isLoaded && won && this.handleHallOfFame()
    
    return (
      <div className="memory my-5">
        <h1 className="text-center my-5" >{this.state.title}</h1>
        <GuessCount guesses={guesses} />
        {cards.map((card, index) => (
          <Card 
            card={card} 
            feedback={this.getFeedbackForCard(index)} 
            key={index}
            index={index}  
            onClick={this.handleCardClick} 
          />
        ))}
        {won && <HallOfFame entries={ FAKE_HOF } />}
      </div>
    )
  }
}

export default App