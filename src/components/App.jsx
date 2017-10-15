'use strict';

import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {

  }

  componentWillReceiveProps(/* nextProps */) {

  }

  render() {
    return (
      <div>
        <main>
          {
            this.props.main
          }
        </main>
        <footer>
          <div>
            Simple List built with ❤️ by <a href="http://www.joahg.com">Joah Gerstenberg</a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
