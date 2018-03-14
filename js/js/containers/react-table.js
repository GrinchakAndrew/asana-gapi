import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectQuestion} from '../actions/index';
import {getFileExported} from '../actions/index';
import {getImageCollection} from '../actions/index';
import axios from '../libs/axios.min.js';
import Filelist from '../containers/files-list';
import {getFilelist} from '../actions/index';
import {getRow} from '../actions/index';
import {getRowIndex} from '../actions/index';
import {getSheetName} from '../actions/index';
import matchSorter from 'match-sorter'

import ReactTable from "react-table";
import "react-table/react-table.css";

import PropTypes from 'prop-types';

class reactTable extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
			data : [], 
			columns : null
        };
    };
	componentWillReceiveProps(nextProps) {
		if(nextProps['data-file-list']){
			this.setState({data: nextProps['data-file-list']});
			this.setState({columns : nextProps['data-columns']});
		}
	}
	
	range(len){
	  const arr = [];
		for (let i = 0; i < len; i++) {
			arr.push(i);
		}
		return arr;
	}
	newFileListItem(d) {
		return {
			file : this.props.filelist[d]['name'],
			link : this.state.data[d]
		}
	}
	makeData(len = this.state.data.length) {
		return this.range(len).map(d => {
			return this.newFileListItem(d);
		})
	}
    render() {
     return this.state.data.length ? (<div>
		<ReactTable
          filterable
          defaultFilterMethod={
			  function (filter, row){
				  debugger; 
				 String(row[filter.file]) === filter.value 
			  }
          }
		  data = {this.makeData()}
          columns= {this.state.columns}
          defaultPageSize={5}
          className="-striped -highlight"
        />
        <br />
      </div>) : (<div>{this.state.data}</div>)
    }
}

function mapStateToProps(state) {
    return {
        fileExported: state.fileExported,
        imageCol: state.imageCollection,
        filelist: state.filelist,
        getRow: state.getRow,
        getRowIndex: state.getRowIndex,
        getSheetName: state.getSheetName
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        selectQuestion: selectQuestion,
        getFileExported: getFileExported,
        getImageCollection: getImageCollection,
        getFilelist: getFilelist,
        getRow: getRow,
        getRowIndex: getRowIndex,
        getSheetName: getSheetName
    }, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(reactTable);