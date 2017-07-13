import { h, render, Component } from 'preact';

console.log('yeah');

class Clock extends Component {
  componentDidMount() {
    console.log('mount');
    import('./test.js').then(({a}) => {
      console.log('res from test', a);
    });
  }
  render() {
    let time = new Date().toLocaleTimeString();
    return (
      <h1>{time}</h1>
    );
  }
}

render(<Clock/>, document.body);
