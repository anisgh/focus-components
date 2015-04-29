var builder = require('focus').component.builder;
var React = require('react');
var type = require('focus').component.types;
var infiniteScrollMixin = require('../mixin/infinite-scroll').mixin;
var translationMixin = require('../../common/i18n').mixin;
var referenceMixin = require('../../common/mixin/reference-property');
var checkIsNotNull = require('focus').util.object.checkIsNotNull;

var tableMixin = {
    /**
     * React tag name.
     */
    displayName: 'table-list',

    /**
     * Mixin dependancies.
     */
    mixins: [translationMixin, infiniteScrollMixin, referenceMixin],

    getDefaultProps: function getListDefaultProps(){
        return {
            data: [],
            idField: 'id'
        };
    },

    proptypes: {
        data: type('array'),
        onLineClick: type('func'),
        idField: type('string'),
        lineComponent: type('func', true),
        columns: type('object'),
        sortColumn: type('func')
    },

    /**
     * called before component mount
     */
    componentWillMount: function componentWillMount(){
        checkIsNotNull('lineComponent', this.props.lineComponent);
    },

    _renderTableHeader: function renderTableHeader(){
        var headerCols = [];
        for(var field in this.props.columns){
            headerCols.push(
                this._renderColumnHeader(field)
            );
        }
        return (
          <thead>
              <tr>
              {headerCols}
              </tr>
          </thead>
        );
    },

    _renderColumnHeader: function(name){
        var colProperties = this.props.columns[name];
        var sort;
        if(!this.props.isEdit && !colProperties.noSort ){
            var order = colProperties.sort ? colProperties.sort : 'asc';
            var iconClass = 'fa fa-sort-' + order;
            var icon = <i className={iconClass}/>;
            sort = <a className='sort' href='#' data-name={name} onClick={this.props.sortColumn}>{icon}</a>;
        }
        return (
            <th>
                {this.i18n(colProperties.label)}
                {sort}
            </th>
        );
    },

    _renderTableBody: function renderTableBody(){
        var lineCount = 1;
        var lineComponent = this.props.lineComponent;
        return this.props.data.map((line)=>{
            return React.createElement(lineComponent, {
                key: line[this.props.idField],
                data: line,
                ref: 'line' + lineCount++,
                reference: this._getReference()
            });
        });
    },

    /**
     * Render the list.
     * @return {XML} the render of the table list.
     */
    render: function render(){
        return (
            <table className="table-list">
            {this._renderTableHeader()}
            {this._renderTableBody()}
            </table>
        );
    }

};

module.exports = builder(tableMixin);