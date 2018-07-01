import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import MHeader from 'components/MHeader'
import Tab from 'components/Tab'
import Rank from 'containers/Rank'
import Recommend from 'containers/Recommend'
import Search from 'containers/Search'
import Singer from 'containers/Singer'
import Player from 'containers/Player'
import UserCenter from 'containers/UserCenter'

import DevTools from 'mobx-react-devtools'
class App extends Component {
  render() {
    return (
      <div className="App">
        <MHeader />
        <Tab />
        <Switch>
          <Redirect exact from="/" to="/recommend" />
          <Route path="/recommend" component={Recommend} />
          <Route path="/singer" component={Singer} />
          <Route path="/rank" component={Rank} />
          <Route  path="/search" component={Search} />
          <Route path="/user" component={UserCenter}  ></Route>
        </Switch>
        <Player />
        {/* <DevTools /> */}
      </div>
    )
  }
}

export default App
