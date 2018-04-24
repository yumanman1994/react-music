import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import { debounce } from 'common/js/util'

import PropTypes from 'prop-types'

import './style.less'

class SearchBox extends Component {

    static defaultProps = {
        placeholder: '搜索歌曲、歌手',
        query: '',
        setStateQuery: () => {

        }
        
    }

    static propTypes = {
        placeholder: PropTypes.string.isRequired,
        query: PropTypes.string.isRequired,
        setStateQuery: PropTypes.func.isRequired
    }
    constructor(props) {
        super(props)


    }
    render() {
        let {query,placeholder} = this.props
        return <div className="search-box" >
            <i className="icon-search" ></i>
            <input value={query} onChange={this.handleChange} type="text" className="box" placeholder={placeholder} />
            <i className="icon-dismiss" onClick={this.clearQuery} style={{ display: query ? '' : 'none' }}  ></i>
        </div>
    }

    @autobind
    handleChange(e) {

        const value = e.target.value.trim()
        // debounce(value => {
        //     this.props.setStateQuery(value)
        // },200)
        this.props.setStateQuery(value)
       
    }

    @autobind
    clearQuery() {
        this.setquery('')
    }

    @autobind
    setquery(query) {
        this.props.setStateQuery(query)
    }
}

export default SearchBox
