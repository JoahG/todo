'use strict';

import React from 'react';
import { browserHistory, Link } from 'react-router';
import { $ } from '../helpers/ApiHelper.js';

class TodoListPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      title: ``,
      items: []
    };
  }

  componentWillMount() {
    if (this.props.params.id && this.props.params.id.length > 0) {
      this.getList();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: ``,
      items: [],
      updated_at: undefined,
      _id: undefined
    }, () => {
      if (nextProps.params.id && nextProps.params.id.length > 0) {
        this.getList();
      }
    });
  }

  onChange(e, stateKey, index, prop, value, shouldUpdate) {
    e.preventDefault();

    let state = { };

    if (typeof index === `undefined`) {
      state[stateKey] = e.target.value;
    } else {
      state[stateKey] = this.state[stateKey];

      if (prop !== `done`) {
        state[stateKey][index][prop] = e.target.value; 
      } else {
        state[stateKey][index][prop] = value; 
      }
    }

    this.setState(state, () => {
      if (shouldUpdate) this.updateListItem(state[stateKey][index]);
    });

    return false;
  }

  addItem(e) {
    e.preventDefault();

    let items = this.state.items,
      title = e.target.value;
    items.push({
      title,
      done: false
    });
    this.setState({ items }, () => {
      this.refs[`input${ this.state.items.length - 1 }`].focus();
      this.refs[`input${ this.state.items.length - 1 }`].selectionStart = title.length;
    });

    return false;
  }

  getList() {
    $({
      type: `GET`,
      url: `/lists/${ this.props.params.id }`,
      success: (data) => {
        if (data.success) {
          this.setState({
            ...data.list,
            items: data.list.items.sort((a, b) => {
              let a_d = +(new Date(a.created_at)),
                b_d = +(new Date(b.created_at));

              if (a_d > b_d) return 1;
              if (b_d > a_d) return -1;
              return 0;
            }).sort((a, b) => {
              if (a.done && !b.done) return 1;
              if (b.done && !a.done) return -1;
              return 0;
            }).filter((item) => item.title.length > 0)
          });
        } else {
          browserHistory.push(`/`);
        }
      }
    });
  }

  saveList(e) {
    e.preventDefault();

    if (this.state.title.replace(/\s/gi, ``).length == 0) return false;

    $({
      type: `POST`,
      url: `/lists`,
      body: this.state,
      success: (data) => {
        if (data.success) {
          browserHistory.push(`/${ data.id }`);
        }
      }
    });

    return false;
  }

  updateListItem(item) {
    if (!this.props.params.id || this.props.params.id.length == 0) return false;

    $({
      type: `PUT`,
      url: `/lists/${ this.props.params.id }/items/${ item._id || `new` }`,
      body: item,
      success: (data) => {
        if (data.success) {
          this.getList();
        }
      }
    });
  }

  render() {
    let newList = !this.props.params.id || this.props.params.id.length == 0;

    return (
      <div className="list-wrapper" key="rootNode">
        {
          !newList ? (
            <Link to="/">New List</Link>
          ) : ``
        }
        <div className="title-wrapper">
          <input 
            type={ `text` } 
            placeholder={ `Title` }
            disabled={ !newList }
            value={ this.state.title } 
            onChange={ (e) => this.onChange(e, `title`) } />
        </div>
        <ul key="itemList">
          {
            this.state.items.map((item, i) => (
              <li key={ item._id || i }>
                <span 
                  className={ `checkbox ${ item.done ? `checked` : ``}` }
                  tabIndex={ 0 }
                  onClick={ (e) => this.onChange(e, `items`, i, `done`, !item.done, true) }
                  onKeyPress={ (e) => {
                    if (e.key == ` `) {
                      this.onChange(e, `items`, i, `done`, !item.done, true);
                    }
                  } } />

                <input
                  ref={ `input${ item._id || i }` }
                  type={ `text` }
                  value={ item.title }
                  onChange={ (e) => this.onChange(e, `items`, i, `title`) } 
                  onBlur={ () => this.updateListItem(item) } />
              </li>
            ))
          }
          {
            !this.state.items || 
            this.state.items.length == 0 || 
            this.state.items[this.state.items.length - 1].title.length > 0 ? (
              <li key={ this.state.items.length }>
                <span 
                  className={ `checkbox` }
                  tabIndex={ -1 } />

                <input
                  key={ `input${ this.state.items.length }` }
                  type={ `text` }
                  value={ `` }
                  onChange={ this.addItem.bind(this) } />
              </li>
            ) : ``
          }
        </ul>
        <div>
          {
            newList ? (
              <span 
                className="btn" 
                onClick={ this.saveList.bind(this) }
                tabIndex={ 0 }
                onKeyPress={ (e) => {
                  if (e.key == `Enter` || e.key == `Return` || e.key == ` `) {
                    this.saveList.bind(this);
                  }
                } }>Save List</span>
            ) : ``
          }
        </div>
      </div>
    );
  }
}

export default TodoListPage;
