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
import PropTypes from 'prop-types';
class Th extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    };
    componentWillMount() {
        this.setState({
            value : this.props.children, 
			'data-row-index' : this.props['data-row-index'], 
			'data-cell-index'	: this.props['data-cell-index'],
			'data-sheet-name' : this.props['data-sheet-name']
        });
    }

    render() {
        return React.createElement('th', {
            ref: (th) => {
                this.th = th;
            }
		}, this.state.value);
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
export default connect(mapStateToProps, matchDispatchToProps)(Th);