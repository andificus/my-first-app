/* Navbar layout helpers (no colors hard-coded) */
.navbarLinks {
  display: flex;
  gap: 14px;
}

.navbarRight {
  margin-left: auto;
  display: flex;
  gap: 14px;
  align-items: center;
}

/* Avatar dropdown */
.avatarMenuWrap {
  position: relative;
  display: flex;
  align-items: center;
}

.avatarButton {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--card);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 22px var(--shadow);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}

.avatarButton:focus-visible {
  outline: 2px solid var(--link);
  outline-offset: 3px;
}

.avatarImg {
  border-radius: 999px;
}

.avatarInitials {
  font-weight: 600;
  color: var(--text);
}

.userMenu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 240px;
  padding: 12px;
  border-radius: 16px;
}

.userMenuHeader {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 4px 10px 4px;
}

.userMenuName {
  font-weight: 600;
}

.userMenuEmail {
  color: var(--muted);
  font-size: 0.92rem;
}

.userMenuDivider {
  height: 1px;
  background: var(--border);
  margin: 10px 0;
}

.userMenuItem {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.userMenuItem:hover {
  border-color: var(--border);
}

.userMenuItem:focus-visible {
  outline: 2px solid var(--link);
  outline-offset: 2px;
}

.userMenuItem.danger {
  color: var(--text);
}
