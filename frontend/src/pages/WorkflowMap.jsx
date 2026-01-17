import React, { useMemo } from 'react';
import ReactFlow, {
    Handle,
    Position,
    Background,
    Controls,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, CheckCircle, FileText, Layers, AlertTriangle } from 'lucide-react';

// --- CUSTOM NODE COMPONENT ---
// This component handles the rendering of all node types (Start, Process, Bottleneck, End)
// using a unified, responsive "Card" design with glassmorphism effects.
const CustomNode = ({ data }) => {
    // 1. Base Card Style - Glassmorphism
    const baseStyle = {
        padding: '12px 16px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.95)', // Nearly opaque white
        border: '1px solid rgba(0,0,0,0.08)',    // Subtle border
        minWidth: '180px',
        textAlign: 'left',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)', // Very soft shadow
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        color: 'var(--text-primary)', // ensure black text as requested
        fontFamily: 'var(--font-family, sans-serif)',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    };

    // 2. Variant Logic - Customize based on Node Type
    let variantStyle = {};
    let Icon = FileText;
    let iconBg = 'rgba(0,0,0,0.04)';
    let iconColor = 'var(--text-secondary)';

    if (data.type === 'start') {
        variantStyle = { borderLeft: '4px solid var(--success)' };
        Icon = Play;
        iconBg = 'rgba(92, 158, 111, 0.1)';
        iconColor = 'var(--success)';
    } else if (data.type === 'end') {
        variantStyle = { borderLeft: '4px solid var(--text-primary)' };
        Icon = CheckCircle;
        iconBg = 'rgba(0,0,0,0.05)';
        iconColor = 'var(--text-primary)';
    } else if (data.isLoss) {
        // Bottleneck / Loss Node
        variantStyle = {
            border: '1px solid var(--accent-color)',
            background: '#fffbfc', // Very subtle pink warm tint
            boxShadow: '0 8px 30px rgba(209, 109, 109, 0.15)' // Muted Rose glow
        };
        Icon = AlertTriangle;
        iconBg = 'rgba(209, 109, 109, 0.1)';
        iconColor = 'var(--accent-color)';
    } else {
        // Standard Process Node
        variantStyle = { borderLeft: '4px solid #cbd5e1' }; // Slate-300 left border
    }

    return (
        <div className="custom-node-wrapper" style={{ ...baseStyle, ...variantStyle }}>
            {/* Input Handle (Not for Start Node) */}
            {data.type !== 'start' && (
                <Handle
                    type="target"
                    position={Position.Left}
                    style={{ background: '#94a3b8', width: '8px', height: '8px' }}
                />
            )}

            {/* Icon Box */}
            <div style={{
                background: iconBg,
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                <Icon size={18} color={iconColor} />
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {data.label}
                </div>
                {data.subLabel && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.2' }}>
                        {data.subLabel}
                    </div>
                )}
            </div>

            {/* Output Handle (Not for End Node) */}
            {data.type !== 'end' && (
                <Handle
                    type="source"
                    position={Position.Right}
                    style={{ background: '#94a3b8', width: '8px', height: '8px' }}
                />
            )}

            {/* Bottleneck Badge */}
            {data.isLoss && (
                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '12px',
                    background: 'var(--accent-color)',
                    color: 'white',
                    borderRadius: '20px',
                    padding: '3px 10px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                }}>
                    Bottleneck
                </div>
            )}
        </div>
    );
};

// Define outside component to avoid React Flow warning
const nodeTypes = {
    custom: CustomNode,
};

// --- MAIN MAP COMPONENT ---
const WorkflowMap = ({ input }) => {

    // 3. Generate Nodes & Edges dynamically
    const { nodes, edges } = useMemo(() => {
        const generatedNodes = [];
        const generatedEdges = [];

        let xOffset = 0;
        const yPos = 100;
        const xStep = 280; // Wider spacing for cards

        // A. Start Node
        generatedNodes.push({
            id: 'start',
            type: 'custom',
            data: { type: 'start', label: 'Start Request' },
            position: { x: xOffset, y: yPos }
        });
        xOffset += xStep;

        // B. Approval Nodes
        const approvals = input.approvals_per_task || 0;
        for (let i = 1; i <= Math.min(approvals, 4); i++) {
            const isBottleneck = i > 1; // 2nd+ approval is a bottleneck
            generatedNodes.push({
                id: `app-${i}`,
                type: 'custom',
                data: {
                    type: isBottleneck ? 'process' : 'process',
                    isLoss: isBottleneck,
                    label: `Approval Level ${i}`,
                    subLabel: isBottleneck ? 'Redundant Layer' : 'Manager Review' // More descriptive text
                },
                position: { x: xOffset, y: yPos }
            });
            xOffset += xStep;
        }

        // C. Process/Tools Nodes
        if (input.tools_used && input.tools_used.length > 2) {
            generatedNodes.push({
                id: `tools`,
                type: 'custom',
                data: {
                    type: 'process',
                    isLoss: true, // Mark massive tool-switching as loss
                    label: 'Data Entry Bridge',
                    subLabel: `Manual entry across ${input.tools_used.length} tools`
                },
                position: { x: xOffset, y: yPos }
            });
            xOffset += xStep;
        }

        // D. End Node
        generatedNodes.push({
            id: 'end',
            type: 'custom',
            data: { type: 'end', label: 'Completion' },
            position: { x: xOffset, y: yPos }
        });

        // --- EDGES ---
        for (let i = 0; i < generatedNodes.length - 1; i++) {
            generatedEdges.push({
                id: `e-${i}`,
                source: generatedNodes[i].id,
                target: generatedNodes[i + 1].id,
                type: 'smoothstep', // Modern engineered look
                animated: true,
                style: { stroke: '#94a3b8', strokeWidth: 1.5 }, // Slate-400
                markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' }
            });
        }

        // Rework Loop (if applicable)
        if (input.rejection_rate > 0 && generatedNodes.length > 2) {
            // Find a source node for the loop (preferably an approval or process node)
            // Use logic: if approvals exist, take last approval. If not, take generic process.
            const approvalNodeIndex = generatedNodes.findIndex(n => n.id.startsWith('app-'));
            const targetIndex = approvalNodeIndex > -1 ? approvalNodeIndex : generatedNodes.length - 2;

            const sourceNode = generatedNodes[targetIndex];

            if (sourceNode) {
                generatedEdges.push({
                    id: 'e-rework',
                    source: sourceNode.id,
                    target: generatedNodes[0].id, // Back to Start
                    type: 'smoothstep',
                    animated: true,
                    label: `${input.rejection_rate}% Rework`,
                    labelStyle: {
                        fill: 'var(--text-primary)', // Black text as requested
                        fontWeight: '700',
                        fontSize: '11px',
                        background: 'white',
                        padding: '2px'
                    },
                    labelBgStyle: { fill: 'rgba(255,255,255,0.8)' },
                    style: { stroke: 'var(--accent-color)', strokeDasharray: '5,5', strokeWidth: 1.5 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--accent-color)' }
                });
            }
        }

        return { nodes: generatedNodes, edges: generatedEdges };
    }, [input]);

    return (
        <div style={{
            height: '380px',
            background: 'white',
            borderRadius: '24px',
            border: '1px solid rgba(0,0,0,0.06)',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02)' // Subtle inner depth
        }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.4 }}
                proOptions={{ hideAttribution: true }} // Clean look
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnScroll={false}
            >
                <Background
                    color="#e2e8f0" // Slate-200 dots (subtle)
                    gap={24}
                    size={2}
                    variant="dots"
                />
                <Controls showInteractive={false} position="bottom-right" />
            </ReactFlow>
        </div>
    );
};

export default WorkflowMap;
