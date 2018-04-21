import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import MHeader from 'components/MHeader'
import Tab from 'components/Tab'
import Rank from 'containers/Rank'
import Recommend from 'containers/Recommend'
import Search from 'containers/Search'
import Singer from 'containers/Singer'
import Player from 'containers/Player'
import DevTools from 'mobx-react-devtools'
class App extends Component {
  render() {
    return (
      <div className="App">
        <MHeader />
        <Tab />
        <Switch>
          <Redirect exact from="/" to="/recommend" />
          <Route exact path="/recommend" component={Recommend} />
          <Route path="/singer" component={Singer} />
          <Route exact path="/rank" component={Rank} />
          <Route exact path="/search" component={Search} />
        </Switch>
        <Player/>
        {/* <DevTools /> */}
      </div>
    )
  }
}

export default App
