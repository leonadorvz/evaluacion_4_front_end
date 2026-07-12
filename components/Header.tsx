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
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white dark:bg-teal-500 shadow-md">
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
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              LabResource
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Gestión de Recursos Tecnológicos de Laboratorio
            </p>
          </div>
        </div>

        {/* Preferences / User Controls */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200/60 bg-zinc-50/50 px-3 py-1.5 dark:border-zinc-800/60 dark:bg-zinc-900/30">
            {/* User Icon */}
            <svg 
              className="h-4 w-4 text-zinc-400 dark:text-zinc-500" 
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
                  className="w-32 border-b border-teal-600 bg-transparent px-1 text-sm outline-none text-zinc-850 dark:text-zinc-200"
                />
                <button 
                  onClick={handleSave}
                  className="text-teal-600 hover:text-teal-700 text-xs font-semibold"
                >
                  Ok
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-350">
                  Responsable: <strong className="text-zinc-950 dark:text-zinc-50">{userName}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
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
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hidden xs:inline">
              {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
            </span>
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          </div>
        </div>

      </div>
    </header>
  );
}
