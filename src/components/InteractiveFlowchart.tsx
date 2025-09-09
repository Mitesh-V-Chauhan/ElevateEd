"use client";

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  ReactFlowProvider,
  Handle,
  Position,
  useReactFlow,
  getRectOfNodes,
  Node,
  Edge,
} from 'reactflow';

import 'reactflow/dist/style.css';

interface FlowchartNode {
  label: string;
  children?: number[];
}

interface FlowchartData {
  title: string;
  flowchart: {
    nodes: FlowchartNode[];
  };
}

const CustomStudyNode = ({ data }: { data: { label: string; level: number; childrenCount?: number } }) => {
  const colorPalette = [
    'border-purple-500', 'border-sky-500', 'border-emerald-500',
    'border-amber-500', 'border-red-500', 'border-pink-500',
  ];
  const colorClass = colorPalette[data.level % colorPalette.length];
  const childrenCount = data.childrenCount || 0;

  return (
    <div className={`px-6 py-3 bg-white dark:bg-zinc-800 shadow-xl rounded-xl border-2 font-sans text-center ${colorClass} relative`}>
      <Handle type="target" position={Position.Left} id="target" />
      <div className="text-zinc-800 dark:text-zinc-100">{data.label}</div>
      {childrenCount > 0 && (
        <>
          {childrenCount === 1 && <Handle type="source" position={Position.Right} id="source-0" />}
          {childrenCount === 2 && (
            <>
              <Handle type="source" position={Position.Right} id="source-0" style={{ top: '30%' }} />
              <Handle type="source" position={Position.Right} id="source-1" style={{ top: '70%' }} />
            </>
          )}
          {childrenCount >= 3 && (
            <>
              {Array.from({ length: Math.min(childrenCount, 4) }, (_, i) => (
                <Handle
                  key={i}
                  type="source"
                  position={Position.Right}
                  id={`source-${i}`}
                  style={{ top: `${20 + (i * 60 / (Math.min(childrenCount, 4) - 1))}%` }}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

const transformDataToFlowElements = (flowchartData: FlowchartData) => {
  const nodes = flowchartData?.flowchart?.nodes;
  if (!nodes || nodes.length === 0) {
    return { initialNodes: [], initialEdges: [] };
  }
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  const levels = new Map<number, number>();
  const visited = new Set<number>();
  const queue: { index: number; level: number }[] = [{ index: 0, level: 0 }];
  visited.add(0);
  levels.set(0, 0);
  while (queue.length > 0) {
    const { index, level } = queue.shift()!;
    const currentNode = nodes[index];
    if (currentNode.children) {
      for (const childIndex of currentNode.children) {
        if (!visited.has(childIndex)) {
          visited.add(childIndex);
          levels.set(childIndex, level + 1);
          queue.push({ index: childIndex, level: level + 1 });
        }
      }
    }
  }
  const xGap = 350;
  const yGap = 150;
  
  // Calculate positions with better spacing for nodes with many children
  const levelCounts = new Map<number, number>();
  nodes.forEach((node: FlowchartNode, index: number) => {
    const level = levels.get(index) ?? 0;
    levelCounts.set(level, (levelCounts.get(level) ?? 0) + 1);
  });

  const nodesPerLevel = new Map<number, number>();
  const edgeColorPalette = ['#8B5CF6', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
  
  nodes.forEach((node: FlowchartNode, index: number) => {
    const level = levels.get(index) ?? 0;
    const countAtLevel = nodesPerLevel.get(level) ?? 0;
    const totalAtLevel = levelCounts.get(level) ?? 1;
    const childrenCount = Array.isArray(node.children) ? node.children.length : 0;
    
    // Center nodes vertically within their level and add extra spacing for nodes with many children
    const baseY = (countAtLevel - (totalAtLevel - 1) / 2) * yGap;
    const extraSpacing = childrenCount > 2 ? (childrenCount - 2) * 30 : 0;
    
    initialNodes.push({
      id: `${index}`,
      type: 'custom',
      data: { label: node.label, level: level, childrenCount },
      position: { x: level * xGap, y: baseY + extraSpacing },
    });
    nodesPerLevel.set(level, countAtLevel + 1);
    
    if (Array.isArray(node.children)) {
      const edgeColor = edgeColorPalette[level % edgeColorPalette.length];
      node.children.forEach((childIndex: number, childIdx: number) => {
        initialEdges.push({
          id: `e-${index}-${childIndex}`,
          source: `${index}`,
          target: `${childIndex}`,
          sourceHandle: `source-${childIdx}`,
          targetHandle: 'target',
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: edgeColor },
          style: { strokeWidth: 2, stroke: edgeColor },
        });
      });
    }
  });
  return { initialNodes, initialEdges };
};

function downloadImage(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.setAttribute('download', filename);
  a.setAttribute('href', dataUrl);
  a.click();
}

// This is the actual component that uses the hooks
const FlowchartCanvas = ({ data, onDownload }: { data: FlowchartData; onDownload?: (downloadFn: () => void) => void }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isDownloadInProgress, setIsDownloadInProgress] = useState(false);
  const { getNodes, getEdges } = useReactFlow();

  const nodeTypes = useMemo(() => ({
    custom: CustomStudyNode,
  }), []);

  useEffect(() => {
    if (data?.flowchart) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Flowchart data:', data.flowchart);
      }
      const { initialNodes, initialEdges } = transformDataToFlowElements(data);
      if (process.env.NODE_ENV === 'development') {
        console.log('Generated nodes:', initialNodes);
        console.log('Generated edges:', initialEdges);
      }
      setNodes(initialNodes);
      setEdges(initialEdges);
      setHasInitialized(false); // Reset when new data comes
    }
  }, [data, setNodes, setEdges]);

  const onInit = useCallback((reactFlowInstance: { fitView: (options?: object) => void }) => {
    if (!hasInitialized && nodes.length > 0) {
      // Only fit view once when nodes are first loaded
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
        setHasInitialized(true);
      }, 100);
    }
  }, [nodes.length, hasInitialized]);

  const downloadFlowchart = useCallback(async () => {
    if (isDownloadInProgress) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Download already in progress, skipping...');
      }
      return;
    }
    
    setIsDownloadInProgress(true);
    
    try {
      const nodes = getNodes();
      if (nodes.length === 0) {
        setIsDownloadInProgress(false);
        return;
      }

      const nodesBounds = getRectOfNodes(nodes);
      const imageWidth = 1200;
      const imageHeight = 800;
      
      // Calculate scaling and positioning manually
      const padding = 50;
      const availableWidth = imageWidth - 2 * padding;
      const availableHeight = imageHeight - 2 * padding;
      
      const scaleX = availableWidth / nodesBounds.width;
      const scaleY = availableHeight / nodesBounds.height;
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
      
      const offsetX = padding + (availableWidth - nodesBounds.width * scale) / 2;
      const offsetY = padding + (availableHeight - nodesBounds.height * scale) / 2;

      // Create SVG directly
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgElement.setAttribute('width', imageWidth.toString());
      svgElement.setAttribute('height', imageHeight.toString());
      svgElement.setAttribute('viewBox', `0 0 ${imageWidth} ${imageHeight}`);
      
      // Add white background
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      background.setAttribute('width', '100%');
      background.setAttribute('height', '100%');
      background.setAttribute('fill', 'white');
      svgElement.appendChild(background);
      
      // Draw edges first (so they appear behind nodes)
      const flowEdges = getEdges();
      flowEdges.forEach((edge) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const sourceX = (sourceNode.position.x - nodesBounds.x) * scale + offsetX + (200 * scale);
          const sourceY = (sourceNode.position.y - nodesBounds.y) * scale + offsetY + (25 * scale);
          const targetX = (targetNode.position.x - nodesBounds.x) * scale + offsetX;
          const targetY = (targetNode.position.y - nodesBounds.y) * scale + offsetY + (25 * scale);
          
          // Draw edge line
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', sourceX.toString());
          line.setAttribute('y1', sourceY.toString());
          line.setAttribute('x2', targetX.toString());
          line.setAttribute('y2', targetY.toString());
          line.setAttribute('stroke', '#8B5CF6');
          line.setAttribute('stroke-width', '2');
          line.setAttribute('marker-end', 'url(#arrowhead)');
          
          svgElement.appendChild(line);
        }
      });
      
      // Add arrow marker definition
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'arrowhead');
      marker.setAttribute('markerWidth', '10');
      marker.setAttribute('markerHeight', '7');
      marker.setAttribute('refX', '9');
      marker.setAttribute('refY', '3.5');
      marker.setAttribute('orient', 'auto');
      
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
      polygon.setAttribute('fill', '#8B5CF6');
      
      marker.appendChild(polygon);
      defs.appendChild(marker);
      svgElement.appendChild(defs);
      
      // Draw nodes
      nodes.forEach((node) => {
        const x = (node.position.x - nodesBounds.x) * scale + offsetX;
        const y = (node.position.y - nodesBounds.y) * scale + offsetY;
        const width = 200 * scale;
        const height = 50 * scale;
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', width.toString());
        rect.setAttribute('height', height.toString());
        rect.setAttribute('fill', 'white');
        rect.setAttribute('stroke', '#8B5CF6');
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('rx', '8');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (x + width / 2).toString());
        text.setAttribute('y', (y + height / 2 + 5).toString()); // +5 for vertical centering
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-size', (14 * scale).toString());
        text.setAttribute('fill', '#333');
        text.textContent = node.data.label;
        
        svgElement.appendChild(rect);
        svgElement.appendChild(text);
      });
      
      // Convert SVG to image
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      const canvas = document.createElement('canvas');
      canvas.width = imageWidth;
      canvas.height = imageHeight;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      
      img.onload = () => {
        context.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        const title = data?.title?.replace(/\s+/g, '_').toLowerCase() || 'flowchart';
        downloadImage(dataUrl, `${title}.png`);
        URL.revokeObjectURL(svgUrl);
        // Reset download lock after successful download
        setTimeout(() => setIsDownloadInProgress(false), 1000);
      };
      img.onerror = () => {
        console.error('Image load failed');
        setIsDownloadInProgress(false);
      };
      img.src = svgUrl;
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloadInProgress(false);
    }
  }, [getNodes, getEdges, data?.title, isDownloadInProgress]);

  // Expose download function to parent - only when explicitly ready
  useEffect(() => {
    if (onDownload && hasInitialized && nodes.length > 0) {
      // Create a wrapper that adds extra safety
      const safeDownload = () => {
        if (process.env.NODE_ENV === 'development') {
        console.log('Download button clicked');
        }
        downloadFlowchart();
      };
      onDownload(safeDownload);
    }
  }, [onDownload, hasInitialized, downloadFlowchart, nodes.length]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onInit={onInit}
        className="bg-zinc-100 dark:bg-zinc-900/50"
      >
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

// This is the wrapper component that provides the context
const InteractiveFlowchart = ({ data, onDownload }: { data: FlowchartData; onDownload?: (downloadFn: () => void) => void }) => {
  return (
    <ReactFlowProvider>
      <FlowchartCanvas data={data} onDownload={onDownload} />
    </ReactFlowProvider>
  );
};

export default InteractiveFlowchart;