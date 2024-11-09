import React from 'react';
import { Handle, Position } from 'reactflow';
import { Link, ArrowRight, ArrowLeft, GitMerge, GitBranch, Copy } from 'lucide-react';

const RELATIONSHIP_ICONS = {
  'blocks': { icon: ArrowRight, color: 'text-red-500' },
  'blocked-by': { icon: ArrowLeft, color: 'text-orange-500' },
  'relates-to': { icon: Link, color: 'text-blue-500' },
  'duplicates': { icon: Copy, color: 'text-purple-500' },
  'parent-of': { icon: GitBranch, color: 'text-green-500' },
  'child-of': { icon: GitMerge, color: 'text-teal-500' }
};

const CanvasTask = ({ data, id }) => {
  console.log('Rendering CanvasTask:', { id, data });

  return (
    <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-lg border border-surface-200 
      dark:border-dark-border min-w-[240px] relative">
      {/* Connection Handles */}
      <Handle
        id={`${id}-top`}
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-aura-500 hover:!w-4 hover:!h-4 transition-all"
      />
      <Handle
        id={`${id}-right`}
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-aura-500 hover:!w-4 hover:!h-4 transition-all"
      />
      <Handle
        id={`${id}-bottom`}
        type="target"
        position={Position.Bottom}
        className="w-3 h-3 !bg-aura-500 hover:!w-4 hover:!h-4 transition-all"
      />
      <Handle
        id={`${id}-left`}
        type="source"
        position={Position.Left}
        className="w-3 h-3 !bg-aura-500 hover:!w-4 hover:!h-4 transition-all"
      />
      
      <div className="flex items-center gap-2 mb-1">
        {data.priority && (
          <span className={`px-1.5 py-0.5 text-xs rounded-md
            ${data.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
            data.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
            'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
            {data.priority}
          </span>
        )}
        <span className={`px-1.5 py-0.5 text-xs rounded-md
          ${data.statusColor?.light || 'bg-surface-100'} 
          ${data.statusColor?.text || 'text-surface-600'}
          ${data.statusColor?.dark || 'dark:bg-dark-hover'}`}>
          {data.mainStatus}
        </span>
      </div>
      <h3 className="font-semibold text-surface-800 dark:text-dark-text">
        {data.title}
      </h3>
      {data.description && (
        <p className="text-sm text-surface-600 dark:text-dark-text/80 line-clamp-3 mt-2">
          {data.description}
        </p>
      )}

      {/* Relationship Indicators */}
      {data.relationships && data.relationships.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-surface-200 dark:border-dark-border">
          {data.relationships.map((rel) => {
            const RelIcon = RELATIONSHIP_ICONS[rel.type]?.icon || Link;
            return (
              <div
                key={`${rel.type}-${rel.taskId}`}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-surface-50 
                  dark:bg-dark-hover text-xs"
                title={`${rel.type}: ${rel.taskId}`}
              >
                <RelIcon 
                  size={12} 
                  className={RELATIONSHIP_ICONS[rel.type]?.color || 'text-surface-500'} 
                />
                <span className="text-surface-600 dark:text-dark-text/80">
                  {rel.type}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CanvasTask;
