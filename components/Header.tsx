import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  userName: string;
  onUserNameChange: (name: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function Header({
  userName,
  onUserNameChange,
  theme,
  onThemeToggle,
}: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleSave = () => {
    if (tempName.trim()) {
      onUserNameChange(tempName.trim());
    } else {
      setTempName(userName);
    }
    setIsEditing(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-indigo-100/40 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70 transition-colors">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/10">
            <svg 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-650 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              LabResource
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500">
              Gestión de Recursos Tecnológicos
            </p>
          </div>
        </div>

        {/* Preferences / User Controls */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/20 px-3.5 py-1.5 dark:border-zinc-800/80 dark:bg-zinc-900/30">
            {/* User Icon */}
            <svg 
              className="h-4 w-4 text-indigo-500 dark:text-indigo-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                  maxLength={25}
                  className="w-32 border-b border-indigo-500 bg-transparent px-1 text-sm outline-none text-zinc-800 dark:text-zinc-200"
                />
                <button 
                  onClick={handleSave}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-xs font-semibold"
                >
                  Ok
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Responsable: <strong className="text-zinc-950 dark:text-zinc-50">{userName}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded p-0.5 hover:bg-indigo-100/50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 dark:hover:text-zinc-300 transition"
                  title="Editar nombre"
                >
                  <svg 
                    className="h-3 w-3" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2.5}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Theme Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-zinc-400 dark:text-zinc-500 hidden xs:inline">
              {theme === 'dark' ? 'Oscuro' : 'Claro'}
            </span>
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          </div>
        </div>

      </div>
    </header>
  );
}
