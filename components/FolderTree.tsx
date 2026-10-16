'use client';

/**
 * KARANA PLATFORM — FolderTree Component
 *
 * Google Earth Pro-style folder/project manager for the right panel.
 * Supports: create/rename/delete folders, add/move/remove/toggle projects.
 * Built with accessibility in mind — keyboard navigable, screen reader support.
 */

import { type RankedProject } from '@/lib/priorityEngine';
import { getWorkType } from '@/lib/workTypes';
import {
    AlertTriangle,
    ChevronDown,
    ChevronRight,
    Download,
    Eye,
    EyeOff,
    Folder,
    FolderOpen,
    FolderPlus,
    GripVertical,
    Pencil,
    Plus,
    Search,
    Trash2,
    XCircle,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

export interface ProjectFolder {
  id: string;
  name: string;
  expanded: boolean;
  projectIds: number[];
}

/* ================================================================== */
/*  Utility                                                            */
/* ================================================================== */

let folderId = 0;
export function createFolderId(): string {
  return `folder_${Date.now()}_${++folderId}`;
}

/* ================================================================== */
/*  FolderTree Component                                               */
/* ================================================================== */

export interface FolderTreeProps {
  folders: ProjectFolder[];
  ranked: RankedProject[];
  hiddenProjectIds: Set<number>;
  clashCount: number;
  onFoldersChange: (folders: ProjectFolder[]) => void;
  onToggleProjectVisibility: (projectId: number) => void;
  onRemoveProject: (projectId: number) => void;
  onZoomToProject: (projectId: number) => void;
  onAddProject: () => void;
  onExportReport: () => void;
}

export default function FolderTree({
  folders,
  ranked,
  hiddenProjectIds,
  clashCount,
  onFoldersChange,
  onToggleProjectVisibility,
  onRemoveProject,
  onZoomToProject,
  onAddProject,
  onExportReport,
}: FolderTreeProps) {
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dragProjectId, setDragProjectId] = useState<number | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  /* ---- Filter projects by search query ---- */
  const filteredRanked = useMemo(() => {
    if (!searchQuery.trim()) return ranked;
    const q = searchQuery.toLowerCase();
    return ranked.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.dept.toLowerCase().includes(q) ||
        p.work_type.toLowerCase().includes(q),
    );
  }, [ranked, searchQuery]);

  const filteredIds = useMemo(
    () => new Set(filteredRanked.map((p) => p.id)),
    [filteredRanked],
  );

  /* ---- Total project count ---- */
  const totalProjects = ranked.length;

  /* ---- Folder operations ---- */
  const addFolder = useCallback(() => {
    const newFolder: ProjectFolder = {
      id: createFolderId(),
      name: 'New Folder',
      expanded: true,
      projectIds: [],
    };
    onFoldersChange([...folders, newFolder]);
    setEditingFolderId(newFolder.id);
    setEditingName('New Folder');
  }, [folders, onFoldersChange]);

  const renameFolder = useCallback(
    (folderId: string) => {
      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        setEditingFolderId(folderId);
        setEditingName(folder.name);
      }
    },
    [folders],
  );

  const commitRename = useCallback(() => {
    if (editingFolderId && editingName.trim()) {
      onFoldersChange(
        folders.map((f) =>
          f.id === editingFolderId ? { ...f, name: editingName.trim() } : f,
        ),
      );
    }
    setEditingFolderId(null);
    setEditingName('');
  }, [editingFolderId, editingName, folders, onFoldersChange]);

  const deleteFolder = useCallback(
    (folderId: string) => {
      onFoldersChange(folders.filter((f) => f.id !== folderId));
    },
    [folders, onFoldersChange],
  );

  const toggleFolder = useCallback(
    (folderId: string) => {
      onFoldersChange(
        folders.map((f) =>
          f.id === folderId ? { ...f, expanded: !f.expanded } : f,
        ),
      );
    },
    [folders, onFoldersChange],
  );

  const toggleFolderVisibility = useCallback(
    (folder: ProjectFolder) => {
      const allHidden = folder.projectIds.every((id) =>
        hiddenProjectIds.has(id),
      );
      // If all hidden, show all. Otherwise hide all.
      for (const pid of folder.projectIds) {
        const isHidden = hiddenProjectIds.has(pid);
        if (allHidden && isHidden) {
          onToggleProjectVisibility(pid);
        } else if (!allHidden && !isHidden) {
          onToggleProjectVisibility(pid);
        }
      }
    },
    [hiddenProjectIds, onToggleProjectVisibility],
  );

  /* ---- Drag & drop ---- */
  const handleDragStart = useCallback(
    (e: React.DragEvent, projectId: number) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(projectId));
      setDragProjectId(projectId);
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, folderId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverFolderId(folderId);
    },
    [],
  );

  const handleDragLeave = useCallback(() => {
    setDragOverFolderId(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetFolderId: string) => {
      e.preventDefault();
      setDragOverFolderId(null);
      const projectId = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (isNaN(projectId)) return;

      // Move project: remove from all folders, add to target folder
      const updated = folders.map((f) => ({
        ...f,
        projectIds: f.projectIds.filter((id) => id !== projectId),
      }));
      const target = updated.find((f) => f.id === targetFolderId);
      if (target && !target.projectIds.includes(projectId)) {
        target.projectIds.push(projectId);
      }
      onFoldersChange(updated);
      setDragProjectId(null);
    },
    [folders, onFoldersChange],
  );

  const handleDragEnd = useCallback(() => {
    setDragProjectId(null);
    setDragOverFolderId(null);
  }, []);

  /* ---- Unfoldered projects ---- */
  const folderedIds = useMemo(() => {
    const s = new Set<number>();
    for (const f of folders) {
      for (const id of f.projectIds) s.add(id);
    }
    return s;
  }, [folders]);

  const unfolderedProjects = useMemo(
    () => ranked.filter((p) => !folderedIds.has(p.id) && filteredIds.has(p.id)),
    [ranked, folderedIds, filteredIds],
  );

  /* ---- Render a single project row ---- */
  const renderProjectRow = (p: RankedProject) => {
    const wt = getWorkType(p.work_type);
    const isHidden = hiddenProjectIds.has(p.id);
    const isDragging = dragProjectId === p.id;

    return (
      <div
        key={p.id}
        draggable
        onDragStart={(e) => handleDragStart(e, p.id)}
        onDragEnd={handleDragEnd}
        className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md text-left transition cursor-pointer
          ${isDragging ? 'opacity-40' : ''}
          ${isHidden ? 'opacity-50' : 'hover:bg-accent/40'}
        `}
        role="treeitem"
        aria-selected={false}
        aria-label={`${p.title}, ${wt.label}, rank ${p.rank}${p.clash_with ? ', has clash' : ''}`}
        onClick={() => onZoomToProject(p.id)}
      >
        {/* Drag handle */}
        <GripVertical
          className="h-3 w-3 text-muted-foreground/40 flex-shrink-0 opacity-0 group-hover:opacity-100 transition cursor-grab"
          aria-hidden="true"
        />

        {/* Rank badge */}
        <span
          className="text-[10px] font-bold w-5 text-center flex-shrink-0"
          style={{ color: wt.color }}
        >
          #{p.rank}
        </span>

        {/* Work type icon */}
        <span
          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: wt.color }}
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none">${wt.iconSvg}</svg>`,
          }}
        />

        {/* Title & dept */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-medium truncate ${isHidden ? 'text-muted-foreground line-through' : 'text-foreground'}`}
          >
            {p.title}
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            {p.dept} &middot; {wt.label}
          </p>
        </div>

        {/* Clash indicator */}
        {p.clash_with && (
          <AlertTriangle
            className="h-3 w-3 text-amber-500 flex-shrink-0"
            aria-label="Has spatial clash"
          />
        )}

        {/* Visibility toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleProjectVisibility(p.id);
          }}
          className="p-0.5 rounded text-muted-foreground/50 hover:text-foreground transition opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label={`${isHidden ? 'Show' : 'Hide'} ${p.title}`}
          title={isHidden ? 'Show on map' : 'Hide from map'}
        >
          {isHidden ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </button>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveProject(p.id);
          }}
          className="p-0.5 rounded text-muted-foreground/50 hover:text-red-500 transition opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-red-300"
          aria-label={`Remove ${p.title}`}
          title="Remove project"
        >
          <XCircle className="h-3 w-3" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Header actions ── */}
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={onAddProject}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border-2 border-dashed border-border text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-accent/30 transition focus:outline-none focus:ring-2 focus:ring-primary"
          title="Add new project"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add Project
        </button>
        <button
          onClick={addFolder}
          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:bg-accent/30 transition focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Create new folder"
          title="New folder"
        >
          <FolderPlus className="h-4 w-4" />
        </button>
      </div>

      {/* ── Search ── */}
      {totalProjects > 3 && (
        <div className="relative mb-3">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Search projects"
          />
        </div>
      )}

      {/* ── Conflict summary ── */}
      {clashCount > 0 && (
        <div className="mb-3 p-2.5 rounded-lg border border-amber-200 bg-amber-50">
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            {clashCount} Spatial Conflict{clashCount !== 1 ? 's' : ''} Detected
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {totalProjects === 0 && (
        <div className="text-center py-10">
          <Pencil
            className="h-7 w-7 mx-auto text-muted-foreground/40 mb-2"
            aria-hidden="true"
          />
          <p className="text-xs text-muted-foreground">
            Draw routes on the map, import KML files, or load mock data to add
            projects.
          </p>
        </div>
      )}

      {/* ── Folder tree ── */}
      <div className="flex-1 overflow-y-auto space-y-1" role="tree" aria-label="Project folders">
        {folders.map((folder) => {
          const folderProjects = folder.projectIds
            .map((id) => ranked.find((p) => p.id === id))
            .filter((p): p is RankedProject => !!p && filteredIds.has(p.id));

          const allHidden =
            folder.projectIds.length > 0 &&
            folder.projectIds.every((id) => hiddenProjectIds.has(id));
          const someHidden = folder.projectIds.some((id) =>
            hiddenProjectIds.has(id),
          );
          const isDragTarget = dragOverFolderId === folder.id;

          // If searching and no matching projects in folder, skip rendering
          if (searchQuery.trim() && folderProjects.length === 0) return null;

          return (
            <div
              key={folder.id}
              role="treeitem"
              aria-selected={false}
              aria-expanded={folder.expanded}
              className={`rounded-lg transition ${isDragTarget ? 'ring-2 ring-primary/50 bg-accent/20' : ''}`}
              onDragOver={(e) => handleDragOver(e, folder.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, folder.id)}
            >
              {/* Folder header */}
              <div className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-accent/30 transition group">
                {/* Expand/collapse */}
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="p-0.5 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={
                    folder.expanded
                      ? `Collapse ${folder.name}`
                      : `Expand ${folder.name}`
                  }
                >
                  {folder.expanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Folder icon */}
                {folder.expanded ? (
                  <FolderOpen className="h-4 w-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <Folder className="h-4 w-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
                )}

                {/* Folder name (editable) */}
                {editingFolderId === folder.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename();
                      if (e.key === 'Escape') {
                        setEditingFolderId(null);
                        setEditingName('');
                      }
                    }}
                    className="flex-1 min-w-0 px-1.5 py-0.5 text-xs font-medium border border-primary rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label="Rename folder"
                    autoFocus
                  />
                ) : (
                  <span
                    className="flex-1 min-w-0 text-xs font-semibold text-foreground truncate cursor-pointer"
                    onDoubleClick={() => renameFolder(folder.id)}
                    title="Double-click to rename"
                  >
                    {folder.name}
                  </span>
                )}

                {/* Project count badge */}
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {folderProjects.length}
                </span>

                {/* Folder visibility toggle */}
                {folder.projectIds.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolderVisibility(folder);
                    }}
                    className={`p-0.5 rounded transition opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary ${
                      allHidden
                        ? 'text-muted-foreground/50'
                        : someHidden
                          ? 'text-muted-foreground'
                          : 'text-foreground'
                    }`}
                    aria-label={`${allHidden ? 'Show' : 'Hide'} all projects in ${folder.name}`}
                    title={allHidden ? 'Show all' : 'Hide all'}
                  >
                    {allHidden ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </button>
                )}

                {/* Rename */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    renameFolder(folder.id);
                  }}
                  className="p-0.5 rounded text-muted-foreground/50 hover:text-foreground transition opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label={`Rename ${folder.name}`}
                  title="Rename folder"
                >
                  <Pencil className="h-3 w-3" />
                </button>

                {/* Delete folder */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFolder(folder.id);
                  }}
                  className="p-0.5 rounded text-muted-foreground/50 hover:text-red-500 transition opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-red-300"
                  aria-label={`Delete ${folder.name} folder`}
                  title="Delete folder"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              {/* Folder children */}
              {folder.expanded && (
                <div className="ml-4 pl-2 border-l border-border/50" role="group">
                  {folderProjects.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground/60 py-1.5 px-2 italic">
                      Empty — drag projects here
                    </p>
                  ) : (
                    folderProjects.map(renderProjectRow)
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* ── Unfoldered projects ── */}
        {unfolderedProjects.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-2 mb-1">
              Unsorted Projects
            </p>
            {unfolderedProjects.map(renderProjectRow)}
          </div>
        )}
      </div>

      {/* ── Footer: Export ── */}
      {totalProjects > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <button
            onClick={onExportReport}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export Report
          </button>
        </div>
      )}
    </div>
  );
}
