"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

interface DashboardProps {
  files: string[];
}

export default function Dashboard({ files }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  useEffect(() => {
    if (copiedFile) {
      const timer = setTimeout(() => {
        setCopiedFile(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedFile]);

  // Set the first file as selected by default
  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0]);
    }
  }, [files, selectedFile]);

  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = async (e: React.MouseEvent, file: string) => {
    e.stopPropagation(); // Prevent choosing file when clicking copy button
    try {
      const shareableUrl = `${window.location.origin}/api/pdf/${encodeURIComponent(file)}`;
      await navigator.clipboard.writeText(shareableUrl);
      setCopiedFile(file);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const getCleanName = (name: string) => {
    return name.replace(/\.[^/.]+$/, ""); // Remove extension
  };

  return (
    <div className={styles.workspaceLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            fdn<span>Pdf</span>
          </div>
          <span className={styles.docCount}>
            {filteredFiles.length} {filteredFiles.length === 1 ? "document" : "documents"}
          </span>
        </div>

        <div className={styles.searchContainer}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.fileList}>
          {filteredFiles.map((file) => {
            const isSelected = selectedFile === file;
            const isCopied = copiedFile === file;

            return (
              <div
                key={file}
                className={`${styles.fileItem} ${isSelected ? styles.fileItemActive : ""}`}
                onClick={() => setSelectedFile(file)}
              >
                <div className={styles.fileInfo}>
                  <svg
                    className={styles.fileIcon}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className={styles.fileName}>{getCleanName(file)}</span>
                </div>

                <button
                  className={`${styles.copyBtn} ${isCopied ? styles.copyBtnSuccess : ""}`}
                  onClick={(e) => handleCopyLink(e, file)}
                  title="Copy shareable link"
                  aria-label="Copy shareable link"
                >
                  {isCopied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
          {filteredFiles.length === 0 && (
            <div className={styles.emptySearch}>No matching policies found.</div>
          )}
        </div>
      </aside>

      <main className={styles.previewContainer}>
        {selectedFile ? (
          <div className={styles.previewActive}>
            <header className={styles.previewHeader}>
              <div className={styles.previewMeta}>
                <span className={styles.previewTag}>PREVIEWING</span>
                <h2 className={styles.previewTitle}>{getCleanName(selectedFile)}</h2>
              </div>
              <div className={styles.previewActions}>
                <button
                  className={`${styles.actionBtn} ${copiedFile === selectedFile ? styles.actionBtnSuccess : ""}`}
                  onClick={(e) => handleCopyLink(e, selectedFile)}
                >
                  {copiedFile === selectedFile ? "Copied URL!" : "Copy Shareable Link"}
                </button>
                <a
                  className={styles.actionBtnSecondary}
                  href={`/api/pdf/${encodeURIComponent(selectedFile)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in New Tab
                </a>
              </div>
            </header>
            <div className={styles.iframeWrapper}>
              <iframe
                src={`/api/pdf/${encodeURIComponent(selectedFile)}`}
                className={styles.iframe}
                title={selectedFile}
              />
            </div>
          </div>
        ) : (
          <div className={styles.previewEmpty}>
            <div className={styles.emptyGlow}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <circle cx="10" cy="13" r="2" />
                <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" />
              </svg>
            </div>
            <h3>No Document Selected</h3>
            <p>Choose a policy document from the sidebar to inspect its content, search details, or copy its shareable URL link.</p>
          </div>
        )}
      </main>
    </div>
  );
}
