import { h, render, Component } from 'preact';

class Clock extends Component {
  render() {
    let time = new Date().toLocaleTimeString();
    return (
      <h1>{time}</h1>
    );
  }
}

console.log('yeah');

render(<Clock/>, document.body);
