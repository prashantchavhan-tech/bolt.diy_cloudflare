import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          {/* <span className="i-bolt:logo-text?mask w-[46px] inline-block" /> */}
          <img src="/logo-light-styled.png" alt="logo" className="w-[90px] inline-block dark:hidden" />
          <img src="/logo-dark-styled.png" alt="logo" className="w-[90px] inline-block hidden dark:block" />
        </a>
        <div className="flex items-center ml-4 gap-2">
          <a
            href="/openclaw-api/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors bg-bolt-elements-background-depth-1 rounded-full border border-bolt-elements-borderColor"
            title="OpenClaw Control UI"
          >
            <div className="i-ph:command-duotone text-lg text-accent" />
            <span>OpenClaw</span>
          </a>
          <button
            onClick={() => {
              const bug = prompt("Describe the bug to fix:");
              if (bug) {
                // Call our internal API or use a custom mechanism
                alert("Auto-Fixing Agent Triggered: " + bug + "\n(Check terminal logs for progress)");
                fetch("/api/auto-fix", {
                  method: "POST",
                  body: JSON.stringify({ bug }),
                  headers: { "Content-Type": "application/json" }
                });
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors bg-bolt-elements-background-depth-1 rounded-full border border-bolt-elements-borderColor"
            title="Auto Bug Fixing Agent"
          >
            <div className="i-ph:wrench-duotone text-lg text-accent" />
            <span>Auto-Fix</span>
          </button>
        </div>
      </div>
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
