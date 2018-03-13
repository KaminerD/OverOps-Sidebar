import React, { Component } from 'react';
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
import SidePanelTheme from '../index';
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
    this.handleDropdownOpened = this.handleDropdownOpened.bind(this)
    
    this.state = {
      dropDownFunc: this.handleDropdownOpened,
      dropDownElement: null,
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [
        { title: 'Favorites',
          isDirectory: true,
          dragDisabled: true,
          children: [
            { title: 'All Errors', canDrop: false },
            { title: 'Uncauaght', canDrop: false },
            { title: 'Swallowed' },            
            { title: 'New This Week' },            
            { title: 'Recent Deployment' },            

       ] },
        {
          title: 'Logs',
          isDirectory: true,
          dragDisabled: true,
          children: [
            { title: 'info' },
            { title: 'warnings' },
            { title: 'errors' },
          ],
        },
        {
          title: 'Exceptions',
          dragDisabled: true,
          isDirectory: true,
          children: [
            { title: 'stack overflow' },
            { title: 'null reference' },
          ],
        }
      ],
    };

  }

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  handleDropdownOpened(dropElement)
  {
      const { treeData, dropDownFunc } = this.state;
      const treeDataClone = treeData.slice(0);
      const dropDownElement = treeDataClone.find((x) => x.title === dropElement)
      this.setState({ dropDownElement });
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
      dropDownFunc,
      dropDownElement
    } = this.state;

    const alertNodeInfo = ({ node, path, treeIndex }) => {
      const objectString = Object.keys(node)
        .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
        .join(',\n   ');

      global.alert(
        'Info passed to the icon and button generators:\n\n' +
          `node: {\n   ${objectString}\n},\n` +
          `path: [${path.join(', ')}],\n` +
          `treeIndex: ${treeIndex}`
      );
    };

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <div style={{ flex: '0 0 auto', padding: '0 15px' }}>
          <h3>Sidebar Template</h3>
          <button onClick={this.expandAll}>Expand All</button>
          <button onClick={this.collapseAll}>Collapse All</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <form
            style={{ display: 'inline-block' }}
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <label htmlFor="find-box">
              Search:&nbsp;
              <input
                id="find-box"
                type="text"
                value={searchString}
                onChange={event =>
                  this.setState({ searchString: event.target.value })}
              />
            </label>

            <button
              type="button"
              disabled={!searchFoundCount}
              onClick={selectPrevMatch}
            >
              &lt;
            </button>

            <button
              type="submit"
              disabled={!searchFoundCount}
              onClick={selectNextMatch}
            >
              &gt;
            </button>

            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </form>
        </div>

        <div style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}>
          <SortableTree
            theme={SidePanelTheme}
            treeData={treeData}
            onChange={this.updateTreeData}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            searchFinishCallback={matches =>
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                  matches.length > 0 ? searchFocusIndex % matches.length : 0,
              })}
            canDrag={({ node }) => !node.dragDisabled}
            canDrop={({ nextParent }) => !nextParent || nextParent.isDirectory}
            generateNodeProps={rowInfo => (
              {
              icons: rowInfo.node.isDirectory
                ? [
                    <div
                      style={{
                        borderLeft: 'solid 8px gray',
                        borderBottom: 'solid 10px gray',
                        marginRight: 10,
                        width: 16,
                        height: 12,
                        filter: rowInfo.node.expanded
                          ? 'drop-shadow(1px 0 0 gray) drop-shadow(0 1px 0 gray) drop-shadow(0 -1px 0 gray) drop-shadow(-1px 0 0 gray)'
                          : 'none',
                        borderColor: rowInfo.node.expanded ? 'white' : 'gray',
                      }}
                    />,
                  ]
                : [
                    <div
                      style={{
                        border: 'solid 1px black',
                        fontSize: 8,
                        textAlign: 'center',
                        marginRight: 10,
                        width: 12,
                        height: 16,
                      }}
                    >
                      F
                    </div>,
                  ],
                dropDownFunc: {dropDownFunc},
                dropDownElement: {dropDownElement}
            })}
          />
        </div>
      </div>
    );
  }
}

export default App;
