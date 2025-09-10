import React from 'react';

function BinaryTreeViz({ songs }) {
    if (!songs || songs.length === 0) {
        return <p>No songs to visualize.</p>;
    }

    // Configuration constants - easy to change!
    const NODE_SIZE = 60;
    const HORIZONTAL_SPACING = 20; // Space between adjacent nodes
    const VERTICAL_SPACING = 100; // Space between levels
    const NODE_RADIUS = NODE_SIZE / 2;

    // Calculate tree dimensions
    const getTreeHeight = () => {
        return Math.floor(Math.log2(songs.length)) + 1;
    };

    const getTreeWidth = () => {
        const height = getTreeHeight();
        const leafNodes = Math.pow(2, height - 1);
        return leafNodes * NODE_SIZE + (leafNodes - 1) * HORIZONTAL_SPACING;
    };

    // Calculate position for each node
    const getNodePosition = (index, level, positionInLevel) => {
        const nodesAtThisLevel = Math.pow(2, level);
        const totalWidthThisLevel = nodesAtThisLevel * NODE_SIZE + (nodesAtThisLevel - 1) * HORIZONTAL_SPACING;
        const treeWidth = getTreeWidth();
        
        const startX = (treeWidth - totalWidthThisLevel) / 2;
        const x = startX + positionInLevel * (NODE_SIZE + HORIZONTAL_SPACING) + NODE_RADIUS;
        const y = level * VERTICAL_SPACING + NODE_RADIUS;
        
        return { x, y };
    };

    // Get level and position for a given index
    const getNodeLevelInfo = (index) => {
        const level = Math.floor(Math.log2(index + 1));
        const positionInLevel = index - (Math.pow(2, level) - 1);
        return { level, positionInLevel };
    };

    const renderNode = (index) => {
        if (index >= songs.length) return null;

        const song = songs[index];
        const { level, positionInLevel } = getNodeLevelInfo(index);
        const { x, y } = getNodePosition(index, level, positionInLevel);
        
        const leftIndex = 2 * index + 1;
        const rightIndex = 2 * index + 2;

        return (
            <React.Fragment key={index}>
                {/* Current node */}
                <div
                    style={{
                        position: 'absolute',
                        left: x - NODE_RADIUS,
                        top: y - NODE_RADIUS,
                        border: '2px solid #000000ff',
                        borderRadius: '50%',
                        width: `${NODE_SIZE}px`,
                        height: `${NODE_SIZE}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: '#9bffa0ff',
                        fontSize: '10px',
                        textAlign: 'center',
                        padding: '2px',
                        wordWrap: 'break-word',
                        overflow: 'hidden',
                        boxSizing: 'border-box'
                    }}
                >
                    <strong>{song.rating.toFixed(1)}</strong>
                    <div style={{ fontSize: '10px', lineHeight: '1.1' }}>
                        {song.title.length > 16 ? song.title.substring(0, 16) + '...' : song.title}
                    </div>
                </div>

                {/* Connection lines to children */}
                {leftIndex < songs.length && (
                    (() => {
                        const { level: leftChildLevel, positionInLevel: leftChildPosInLevel } = getNodeLevelInfo(leftIndex);
                        const leftChildPos = getNodePosition(leftIndex, leftChildLevel, leftChildPosInLevel);
                        return (
                            <svg
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width: '100%',
                                    height: '100%',
                                    pointerEvents: 'none',
                                    zIndex: -1
                                }}
                            >
                                <line
                                    x1={x}
                                    y1={y + NODE_RADIUS}
                                    x2={leftChildPos.x}
                                    y2={leftChildPos.y - NODE_RADIUS}
                                    stroke="black"
                                    strokeWidth="2"
                                />
                            </svg>
                        );
                    })()
                )}

                {rightIndex < songs.length && (
                    (() => {
                        const { level: rightChildLevel, positionInLevel: rightChildPosInLevel } = getNodeLevelInfo(rightIndex);
                        const rightChildPos = getNodePosition(rightIndex, rightChildLevel, rightChildPosInLevel);
                        return (
                            <svg
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width: '100%',
                                    height: '100%',
                                    pointerEvents: 'none',
                                    zIndex: -1
                                }}
                            >
                                <line
                                    x1={x}
                                    y1={y + NODE_RADIUS}
                                    x2={rightChildPos.x}
                                    y2={rightChildPos.y - NODE_RADIUS}
                                    stroke="black"
                                    strokeWidth="2"
                                />
                            </svg>
                        );
                    })()
                )}

                {/* Render child nodes recursively */}
                {renderNode(leftIndex)}
                {renderNode(rightIndex)}
            </React.Fragment>
        );
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Max Heap Visualization (Highest Rating at Top)</h3>
            {songs.length > 0 ? (
                <div style={{ 
                    overflowX: 'auto',
                    overflowY: 'auto',
                    minHeight: `${getTreeHeight() * VERTICAL_SPACING + NODE_SIZE}px`,
                    border: '1px solid #eee',
                    borderRadius: '5px',
                    position: 'relative'
                }}>
                    <div style={{ 
                        position: 'relative', 
                        width: `${getTreeWidth()}px`, 
                        height: `${getTreeHeight() * VERTICAL_SPACING + NODE_SIZE}px`,
                        minWidth: '100%'
                    }}>
                        {renderNode(0)}
                    </div>
                </div>
            ) : (
                <p>No songs to display</p>
            )}
        </div>
    );
}

export default BinaryTreeViz;