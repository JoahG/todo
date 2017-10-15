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

  onChange(e, stateKey, index, prop, value) {
    e.preventDefault();

    let state = { };

    if (typeof index === `undefined`) {
      state[stateKey] = e.target.value;
    } else {
      state[stateKey] = this.state[stateKey];

      if (prop !== `done`) state[stateKey][index][prop] = e.target.value; 
      else state[stateKey][index][prop] = value; 
    }

    this.setState(state, () => {
      if (this.props.params.id && this.props.params.id.length > 0) {
        this.updateListItem(state[stateKey][index]);
      }
    });

    return false;
  }

  addItem(e) {
    e.preventDefault();

    let items = this.state.items;
    items.push({
      title: ``,
      done: false
    });
    this.setState({ items }, () => {
      this.refs[`input${ this.state.items.length - 1 }`].focus();
    });

    return false;
  }

  getList() {
    $({
      type: `GET`,
      url: `/lists/${ this.props.params.id }`,
      success: (data) => {
        if (data.success) {
          this.setState(data.list);
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
      <div className="list-wrapper">
        {
          !newList ? (
            <a href="/">New List</a>
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
        <ul>
          {
            this.state.items.map((item, i) => (
              <li key={ i }>
                <span 
                  className={ `checkbox ${ item.done ? `checked` : ``}` }
                  tabIndex={ 0 }
                  onClick={ (e) => this.onChange(e, `items`, i, `done`, !item.done) }
                  onKeyPress={ (e) => {
                    if (e.key == ` `) {
                      this.onChange(e, `items`, i, `done`, !item.done);
                    }
                  } } />

                <input
                  ref={ `input${ i }` }
                  type={ `text` }
                  value={ item.title }
                  onChange={ (e) => this.onChange(e, `items`, i, `title`) } />
              </li>
            ))
          }
          {
            !this.state.items || 
            this.state.items.length == 0 || 
            this.state.items[this.state.items.length - 1].title.length > 0 ? (
              <li>
                <span 
                  className={ `checkbox` }
                  tabIndex={ -1 } />

                <input
                  type={ `text` }
                  value={ `` }
                  onFocus={ this.addItem.bind(this) } />
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
